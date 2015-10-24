#!/bin/bash
 
WEB_PATH='/var/www/OneMoreFace/OneMoreFace'
WEB_USER='www-data'
WEB_USERGROUP='www-data'
 
echo "Start deployment"
cd $WEB_PATH
echo "pulling source code..."
git reset --hard origin/master
git clean -f
git pull origin master
git checkout master
echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
service apache2 restart
echo "Finished."
