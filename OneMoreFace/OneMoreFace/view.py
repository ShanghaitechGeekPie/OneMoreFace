#coding=utf-8
from django.template import RequestContext
from django.shortcuts import render_to_response,HttpResponse,Http404
from django.views.decorators.csrf import csrf_exempt
import os

def get_token():
	import requests
	headers = {
		'X-RTCAT-APIKEY': '2e45679e-7858-4257-a598-204122e61593',
		'X-RTCAT-SECRET': 'cd1cc702-7c72-4421-abd1-9884c4a14b6d',
	}
	response = requests.post('https://api.realtimecat.com/v0.1/tokens', data={'session_id': 'b7d92101-77b6-4dd8-81b8-ca734afc4d77', 'type': 'pub'}, headers=headers)
	return(response.json()['token'])

def live(request):
	return(render_to_response("live.html", {
		'token': get_token(),
		}))
