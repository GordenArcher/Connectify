from django.shortcuts import render, redirect, get_object_or_404
from django.http import response
from django.contrib.auth.models import User
from django.contrib import messages, auth
from django.core.mail import send_mail, EmailMessage
from .models import Profile
from posts.models import Posts
from django.contrib.auth.decorators import login_required
from django.db import transaction
from .models import FriendRequest
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth import get_user_model
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.http import JsonResponse
import json

# Create your views here.
def register(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        try:
            if password == password2:
                if User.objects.filter(username=username).exists():
                    messages.error(request, f"{username} already exists")
                    return redirect("register")
        
                elif User.objects.filter(email=email).exists():
                    messages.error(request, f"{email} already exists")
                    return redirect("register")
                
                else:
                    user = User.objects.create_user(username=username, email=email, password=password)
                    user.save()
                    messages.success(request, f"{username}! You registered sucessfully")
                    return redirect("login")
                
            else:
                messages.error(request, "password doesn't match")
                return redirect("register")    

        except Exception as e:
            messages.error(request, f"Error registering user", {e})
            return redirect("register")
        

    return render(request, 'register.html')



def login(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        try:
            user = auth.authenticate(username=username, password=password)

            if user:
                auth.login(request, user)
                messages.success(request, "You're logged In")
                return redirect("/posts/feed")
            
            else:
                messages.warning(request, "Invalid credentials")
                return redirect("login")
            
        except Exception as e:
            messages.error(request, f"Error logging in {e}")    


    return render(request, 'login.html')


def logout(request):
    try:
        auth.logout(request)
        messages.success(request, "You have been logged out successfully.")
        return redirect("login")
    
    except Exception as e:
        messages.error(request, f" Coul'nt logout{e}")

    return render(request, "logout.html")        
  


@login_required
def profile(request, username):
    user = User.objects.get(username=username)

    try:
        profile_info = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        profile_info = None

    my_posts = Posts.objects.filter(user=user).exclude(media__isnull=True).exclude(media="")
    text_posts = Posts.objects.filter(user=user).exclude(text_post__isnull=True).exclude(text_post="")
    friend_requests = FriendRequest.objects.filter(to_user=request.user, is_accepted=False) 

    context = {
        "user_posts" : my_posts,
        "profile": profile_info,
        "text_posts":text_posts,
        'friend_requests': friend_requests
    }

    return render(request, 'profile.html', context)


@login_required
def edit_profile(request, username):
    user =  User.objects.get(username=username)
    profile_info, _ = Profile.objects.get_or_create(user=user)

    if request.method == "POST":
        profile_picture = request.FILES.get("profile")
        cover_picture = request.FILES.get("cover")
        bio = request.POST.get("bio")
        user_username = request.POST.get("username")
        email = request.POST.get("email")

        try:
            with transaction.atomic():
                if profile_picture:
                    if profile_info.profile_picture:
                        profile_info.profile_picture.delete()
                    profile_info.profile_picture = profile_picture
                if cover_picture:
                    profile_info.cover_picture = cover_picture
                if bio:
                    profile_info.bio = bio
                profile_info.save()

                if user_username:
                    user.username = user_username
                if email:
                    user.email = email
                user.save()

            messages.success(request, "Profile updated successfully!")
            return redirect("profile", username=user.username)

        except Exception as e:
            messages.error(request, f"Error saving your changes: {e}")

    context = {
        "profile": profile_info,
        "user": user,
    }

    return render(request, "edit.html", context)




@login_required
def send_friend_request(request, user_id):
    to_user = get_object_or_404(User, id=user_id)
    
    if FriendRequest.objects.filter(from_user=request.user, to_user=to_user, is_accepted=False).exists():
        messages.error(request, "Friend request already sent.")

    elif FriendRequest.objects.filter(from_user=request.user, to_user=to_user, is_accepted=True).exists():
        messages.error(request, f"You're already friends with {to_user.username}")   

    elif request.user == to_user:
        messages.error(request, "You cannot send a friend request to yourself.")
    else:
        FriendRequest.objects.create(from_user=request.user, to_user=to_user)
        messages.success(request, f"Friend request sent to {to_user.username}.")

    return redirect('messages')


@login_required
def view_friend_requests(request):
    friend_requests = FriendRequest.objects.filter(to_user=request.user, is_accepted=False)
    return render(request, 'messages', {'friend_requests': friend_requests})


@login_required
def accept_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=request.user)
    
    friend_request.is_accepted = True
    friend_request.save()

    FriendRequest.objects.get_or_create(from_user=request.user, to_user=friend_request.from_user,  is_accepted=True)
    messages.success(request, f"You are now friends with {friend_request.from_user.username}.")

    return redirect('messages')



@login_required
def reject_friend_request(request, request_id):
    friend_request = get_object_or_404(FriendRequest, id=request_id, to_user=request.user)

    friend_request.delete()
    messages.success(request, "Friend request rejected.")

    return redirect('messages')



@login_required
def delete_account(request):
    user = request.user
    
    if request.method == 'POST':
        user.delete()
        messages.success(request, "Your account has been successfully deleted.")
        return redirect('')

    return render(request, 'delete_account.html', {'user': user})


def request_password(request):
    return render (request, 'request_password.html')



def send_email(request):

        
    return render(request, 'request_password.html')  



def send_request(request):
    if request.method =='POST':
        data = json.loads(request.body)
        email = data.get("email")

        user = User.objects.filter(email=email).first()

        try:
            if user:
                uid = urlsafe_base64_encode(force_bytes(user.pk))

                context = {
                    'reset_url': f'https://127.0.0.1:8000/user/reset_password/{uid}/',
                    'username': user.username,
                    'message': "You forgot your password? No problem,"
                }

                html_message = render_to_string('change_password_email.html', context)
                plain_message = strip_tags(html_message)
                subject = "Reset Password"
                from_email = "archergorden@gmail.com"
                recipient_list = [email]

                email_message = EmailMessage(subject, html_message, from_email, recipient_list)
                email_message.content_subtype = "html"
                email_message.send()

                return JsonResponse({
                    "status": "sucess",
                    "message":"Email sent successfully."
                    }, status=200)

            else:
                return JsonResponse({
                    "status": "error",
                    "message":f"{email} is not a user"
                    }, status=400)

        except Exception as e:
            return JsonResponse({
                "status":"error",
                "message": f"Error sending email: {e}"
                }, status=500)
        
    return JsonResponse({
        "status":"error",
        "message":"request is not valid"
    })    



def reset_password(request, uidb64):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)

        if request.method == 'POST':
            password = request.data.get("password")
            if not password:
                return JsonResponse({"error": "Password is required."}, status=400)

            user.set_password(password)
            user.save()

            return JsonResponse({
                "message": "Password reset successful.",
            }, status=201)

    except Exception as e:
        return JsonResponse({"error": f"Something occurred: {str(e)}. Please try again later."}, status=500)


def email_sent(request):
    return render(request, 'email_sent.html')