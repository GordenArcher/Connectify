from django.contrib import admin
from .models import Messages

# Register your models here.
class MessagesAdmin(admin.ModelAdmin):
    list_display = ["user", "recipient", "message_sent", "message_received", "media", "sent_at"]
    search_fields = ["user", "recipient", "message_sent", "message_received", "media", "sent_at"]

    def __str__(self):
        return self.user()
    



admin.site.register(Messages, MessagesAdmin)