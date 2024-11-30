from django.contrib import admin
from .models import Profile, FriendRequest

# Register your models here.
class AdminProfile(admin.ModelAdmin):
    list_display = ["user", "bio", "profile_picture", "cover_picture", "date_of_birth"]
    search_fields = ["user", "bio", "date_of_birth"]

    def __str__(self):
        return self.user
    

class AdminFriends(admin.ModelAdmin):
    list_display = ["from_user", "to_user", "is_accepted", "is_rejected", "created_at"]
    search_fields = ["from_user", "to_user", "is_accepted", "is_rejected", "created_at"]

    def __str__(self):
        return self.user
    




admin.site.register(Profile, AdminProfile)
admin.site.register(FriendRequest, AdminFriends)