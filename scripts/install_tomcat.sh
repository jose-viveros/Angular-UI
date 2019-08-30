#!/bin/bash
echo " update packages"
sudo apt -y update  
echo " install java"
sudo apt install default-jdk -y 
echo "create tomcat user"
sudo useradd -r -m -U -d /opt/tomcat -s /bin/false tomcat
echo "Download  tomcat 9.0.16"
wget http://mirrors.estointernet.in/apache/tomcat/tomcat-9/v9.0.16/bin/apache-tomcat-9.0.16.tar.gz -P /tmp
echo "Extract and install tomcat 9.0.16"
sudo tar xf /tmp/apache-tomcat-9.0.16.tar.gz -C /opt/tomcat
sudo ln -s /opt/tomcat/apache-tomcat-9.0.16 /opt/tomcat/latest
echo "Apply permission for tomcat user"
sudo chown -RH tomcat: /opt/tomcat/latest
sudo sh -c 'chmod +x /opt/tomcat/latest/bin/*.sh'
sudo sed -i 's/Connector port="8080"/Connector port="80"/g' /opt/tomcat/latest/conf/server.xml 
sudo sed -i "s#exec "$PRGDIR"/"$EXECUTABLE"#exec authbind -deep "$PRGDIR"/"$EXECUTABLE"#g" /opt/tomcat/latest/bin/startup.sh
sudo cat /opt/tomcat/latest/conf/server.xml 
echo "Create service file"
sudo cp tomcat.service /etc/systemd/system/
sudo systemctl daemon-reload
echo "Start tomcat"
sudo systemctl start tomcat
sudo systemctl status tomcat
sudo systemctl enable tomcat
sudo ufw allow 18080/tcp
