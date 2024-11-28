from django.contrib import admin
from .models import Posts, Like, Comment

# Register your models here.
class PostsAmin(admin.ModelAdmin):
    list_display = ["user", "content", "image", "video", "created_at"]
    search_fields = ["user", "content", "created_at"]

    def __str__(self):
        return self.user()
    

class LikeAmin(admin.ModelAdmin):
    list_display = ["user", "post", "liked_at"]
    search_fields = ["user", "post", "liked_at"]

    def __str__(self):
        return self.user()
    

class CommentAmin(admin.ModelAdmin):
    list_display = ["user",  "post", "content", "commented_at"]
    search_fields = ["user", "post", "content", "commented_at"]

    def __str__(self):
        return self.user()
    


admin.site.register(Posts, PostsAmin)    
admin.site.register(Like, LikeAmin)    
admin.site.register(Comment, CommentAmin)    