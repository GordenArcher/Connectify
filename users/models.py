from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    cover_picture = models.ImageField(upload_to='cover_pictures/', blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    following = models
    
    def __str__(self):
        return f'{self.user.username} Profile'



class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name="sent_requests", on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name="received_requests", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.from_user} to {self.to_user}"
    
    def accept(self):
        self.is_accepted = True
        self.save()

    def reject(self):
        self.is_rejected = True
        self.save()