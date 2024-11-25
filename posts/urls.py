from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create, name="create"),
    path("feed/", views.feed, name="feed")
]
