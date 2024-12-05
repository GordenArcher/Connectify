from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User

class Messages(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages", null=True)
    message_sent = models.TextField(null=True) 
    message_received = models.TextField(null=True) 
    media = models.FileField(upload_to='chat_messages_media/', blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    received_at = models.DateTimeField(null=True, blank=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)

    is_read = models.BooleanField(default=False)

    def mark_as_read(self):
        self.is_read = True
        self.received_at = now()
        self.save()


    def update_last_seen(self):
        self.last_seen = now()
        self.is_online = False
        self.save()    

    class Meta:
        ordering = ['-sent_at']

    def __str__(self):
        return f"Message from {self.user.username} to {self.recipient.username} at {self.sent_at}"