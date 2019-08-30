#!/bin/bash
echo "Stopping excel-plus-api"
sudo systemctl stop tomcat
rm -rf /opt/tomcat/latest/webapps/ROOT/excelplus