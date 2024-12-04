from django.contrib import admin
from .models import Posts, Like, Comment, Follows

# Register your models here.
class PostsAdmin(admin.ModelAdmin):
    list_display = ["user", "content", "media", "text_post", "created_at"]
    search_fields = ["user", "content", "text_post", "created_at"]

    def __str__(self):
        return self.content 
    

class LikeAdmin(admin.ModelAdmin):
    list_display = ["user", "post", "liked_at"]
    search_fields = ["user", "post", "liked_at"]

    def __str__(self):
        return self.user
    

class CommentAdmin(admin.ModelAdmin):
    list_display = ["user",  "post", "content", "commented_at"]
    search_fields = ["user", "post", "content", "commented_at"]

    def __str__(self):
        return self.user
    


class FollowAdmin(admin.ModelAdmin):
    list_display = ["user",  "follow", "followed_at"]
    search_fields = ["user", "follow", "followed_at"]

    def __str__(self):
        return self.user
    


admin.site.register(Posts, PostsAdmin)    
admin.site.register(Like, LikeAdmin)    
admin.site.register(Comment, CommentAdmin)    
admin.site.register(Follows, FollowAdmin)    