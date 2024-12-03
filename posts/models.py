from django.db import models
from django.contrib.auth.models import User

class Posts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    text_post = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    video = models.FileField(upload_to='post_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)



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