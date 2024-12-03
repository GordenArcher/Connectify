from django.urls import path
from . import views

urlpatterns = [
    path("", views.messages, name="messages"),
    path("chat/@<str:username>/", views.chat_messages, name="chat_messages")
]
