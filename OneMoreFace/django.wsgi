# -*- coding: utf-8 -*-

import os
import sys
import django.core.handlers.wsgi

sys.path.append(r'/www/umunc')
os.environ['DJANGO_SETTINGS_MODULE'] = 'umunc.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

