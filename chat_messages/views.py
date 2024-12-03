from django.shortcuts import render, redirect, get_object_or_404
from users.models import FriendRequest
from django.contrib.auth.models import User
from .models import Messages
from django.db.models import Q

# Create your views here.
def messages(request):
    sent_requests = FriendRequest.objects.filter(from_user=request.user)
    received_requests = FriendRequest.objects.filter(to_user=request.user, is_accepted=False)
    accepted_requests = FriendRequest.objects.filter(is_accepted=True, to_user=request.user)
    all_users = User.objects.all()

    return render(request, 'messages.html',{
        'sent_requests': sent_requests,
        'received_requests': received_requests,
        "accepted_requests" : accepted_requests,
        "users":all_users
    })


def chat_messages(request, username):
    user_n = get_object_or_404(User, username=username)

    sent_requests = FriendRequest.objects.filter(from_user=request.user)
    received_requests = FriendRequest.objects.filter(to_user=request.user)
    accepted_requests = FriendRequest.objects.filter(is_accepted=True, to_user=request.user)
    all_users = User.objects.all()

    user = request.user

    all_messages = Messages.objects.filter(
        (Q(user=user) & Q(recipient=user_n)) |
        (Q(user=user_n) & Q(recipient=user))
    ).order_by('sent_at')

    context = {
        'sent_requests': sent_requests,
        'received_requests': received_requests,
        'accepted_requests': accepted_requests,
        'users': all_users,
        'all_messages': all_messages,
        'chat_user': user_n,  
    }

    return render(request, 'chat.html', context)