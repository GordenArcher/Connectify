from django.contrib import admin
from .models import Posts

# Register your models here.
class PostsAmin(admin.ModelAdmin):
    list_display = ["user", "content", "created_at"]
    search_fields = ["user", "content", "created_at"]

    def __str__(self):
        return self.user()
    


admin.site.register(Posts, PostsAmin)    