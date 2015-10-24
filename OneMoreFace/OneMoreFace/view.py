#coding=utf-8
from django.template import RequestContext
from django.shortcuts import render_to_response,HttpResponse,Http404
from django.views.decorators.csrf import csrf_exempt
import os

@csrf_exempt
def update(request):
    os.system('/var/www/OneMoreFace/deploy.sh')

def view_post(request, id):
    pass
