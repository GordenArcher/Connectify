from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from .models import Messages
from django.core.files.base import ContentFile
import base64
import uuid

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.message_count = 0
        self.sender = self.scope['user']
        self.recipient_username = self.scope['url_route']['kwargs']['username']
        self.room_group_name = self.get_room_group_name(self.sender.username, self.recipient_username)

        if not self.sender.is_authenticated:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = (data.get('message') or '').strip()
        media = data.get('media')

        media_file = None
        if media:
            media_file = await self.save_media_async(media)
            if not media_file:
                await self.send_error('Invalid media file')
                return

        if not message and not media:
            await self.send_error('You must send either a message or media')
            return

        recipient = await self.get_recipient_async()
        if not recipient:
            await self.send_error('Recipient does not exist')
            return

        message_obj = await self.save_message_async(
            self.sender, recipient, message, media_file
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'media': message_obj.media.url if message_obj.media else None,
                'sender': self.sender.username,
                'recipient': recipient.username,
                'message_id': message_obj.id
            }
        )

        await self.send_notification(recipient, message_obj)

    async def chat_message(self, event):
        self.message_count += 1
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'media': event.get('media'),
            'sender': event['sender'],
            'recipient': event['recipient'],
            'loggedInUser': self.sender.username,
            'incomingMessageCount': self.message_count, 
        }))

    @sync_to_async
    def save_message_async(self, sender, recipient, message, media=None):
        return Messages.objects.create(
            user=sender,
            recipient=recipient,
            message_sent=message,
            media=media,
            sent_at=now(),
            is_read=False
        )

    @sync_to_async
    def save_media_async(self, media):
        try:
            format, imgstr = media.split(';base64,')
            ext = format.split('/')[-1]
            filename = f"{now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex}.{ext}"
            file_data = ContentFile(base64.b64decode(imgstr), name=filename)
            return file_data  
        except Exception as e:
            print(f"Error saving media: {e}")
            return None

    async def send_error(self, error_message):
        await self.send(text_data=json.dumps({'error': error_message}))

    async def send_notification(self, recipient, message_obj):
        notification_data = {
            'type': 'new_message_notification',
            'message': message_obj.message_sent,
            'media': message_obj.media.url if message_obj.media else None,
            'sender': self.sender.username,
            'timestamp': message_obj.sent_at.isoformat(),
        }

        recipient_group_name = f"user_{recipient.username}"

        print(f"Sending notification to {recipient_group_name}: {notification_data}")

        await self.channel_layer.group_send(
            recipient_group_name,
            {
                'type': 'deliver_notification',
                'notification': notification_data
            }
        )

    async def deliver_notification(self, event):
        notification = event['notification']
        await self.send(text_data=json.dumps(notification))


    def get_room_group_name(self, sender_username, recipient_username):
        return f"chat_{min(sender_username, recipient_username)}_{max(sender_username, recipient_username)}"

    @sync_to_async
    def get_recipient_async(self):
        try:
            return User.objects.get(username=self.recipient_username)
        except User.DoesNotExist:
            return None
