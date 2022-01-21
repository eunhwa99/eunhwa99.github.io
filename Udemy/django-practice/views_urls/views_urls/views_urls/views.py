#from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def contact(request):
    return render(request, 'contact.html')

def result(request):
    user_input = request.GET['user_input']
    user_input = user_input.upper()
    
    return render(request, 'results.html', {'home_input': user_input})