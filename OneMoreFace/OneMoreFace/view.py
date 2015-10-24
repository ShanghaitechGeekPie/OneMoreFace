#coding=utf-8
from django.template import RequestContext
from django.shortcuts import render_to_response,HttpResponse,Http404
from django.views.decorators.csrf import csrf_exempt
import os

@csrf_exempt
def update(request):
    os.system('/var/www/OneMoreFace/deploy.sh > /var/www/a')

def live(request):
    return(render_to_response("live.html"))

def live2(request):
    return(render_to_response("live2.html"))
