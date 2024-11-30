from django.shortcuts import render
from users.models import FriendRequest
from django.contrib.auth.models import User

# Create your views here.
def messages(request):
    sent_requests = FriendRequest.objects.filter(from_user=request.user)
    received_requests = FriendRequest.objects.filter(to_user=request.user)
    accepted_requests = FriendRequest.objects.filter(is_accepted=True, to_user=request.user)
    all_users = User.objects.all()

    return render(request, 'messages.html',{
        'sent_requests': sent_requests,
        'received_requests': received_requests,
        "accepted_requests" : accepted_requests,
        "users":all_users
    })