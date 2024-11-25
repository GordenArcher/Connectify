from django.shortcuts import render, redirect
from django.http import response
from django.contrib.auth.models import User
from django.contrib import messages, auth
from django.core.mail import send_mail

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
  