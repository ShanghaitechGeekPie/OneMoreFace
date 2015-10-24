# -*- coding: utf-8 -*-

import os
import sys
import django.core.handlers.wsgi

sys.path.append(r'/var/www/OneMoreFace/OneMoreFace')
os.environ['DJANGO_SETTINGS_MODULE'] = 'OneMoreFace.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

