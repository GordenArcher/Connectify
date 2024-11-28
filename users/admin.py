from django.contrib import admin
from .models import Profile

# Register your models here.
class AdminProfile(admin.ModelAdmin):
    list_display = ["user", "bio", "profile_picture", "cover_picture", "date_of_birth"]
    search_fields = ["user", "bio", "date_of_birth"]

    def __str__(self):
        return self.user
    


admin.site.register(Profile, AdminProfile)