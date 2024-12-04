from django.db import models
from django.contrib.auth.models import User
import mimetypes

class Posts(models.Model):
    MEDIA_TYPE_CHOICES = (
        ('image', 'Image'),
        ('video', 'Video'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    text_post = models.TextField(null=True, blank=True)
    media = models.FileField(upload_to='post_media', blank=True, null=True)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.media:
            # Get the MIME type of the file
            mime_type, _ = mimetypes.guess_type(self.media.name)
            if mime_type:
                if mime_type.startswith('video'):
                    self.media_type = 'video'
                elif mime_type.startswith('image'):
                    self.media_type = 'image'
        super().save(*args, **kwargs)



class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name="likes")
    liked_at = models.DateTimeField(auto_now_add=True)  

    class Meta:
        unique_together = ('user', 'post') 

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    commented_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.content[:20]}..."
    


class Follows(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    follow = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    followed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} follows {self.follow.username}"