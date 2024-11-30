from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Messages(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages", blank=True, null=True)
    message_sent = models.TextField(max_length=1000000) 
    message_received = models.TextField(max_length=1000000) 
    media = models.FileField(upload_to='chat_messages_media/', blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    received_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)


    def __str__(self):
        return f"Message from {self.user} at {self.sent_at}"