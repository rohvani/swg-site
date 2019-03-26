default_mysql_ip="127.0.0.1"
default_mysql_port="3306"
default_mysql_username="root"
default_mysql_password="password"

echo "Please note, this script will drop the 'swgsite' database and re-create it!"

read -p "Enter MySQL IP [$default_mysql_ip]: " mysql_ip
read -p "Enter MySQL Port [$default_mysql_port]: " mysql_port
read -p "Enter MySQL User Name [$default_mysql_username]: " mysql_username
read -p "Enter MySQL Password [$default_mysql_password]: " mysql_password

mysql_ip=${mysql_ip:-$default_mysql_ip}
mysql_port=${mysql_port:-$default_mysql_port}
mysql_username=${mysql_username:-$default_mysql_username}
mysql_password=${mysql_password:-$default_mysql_password}

mysql -u$mysql_username -p$mysql_password -h$mysql_ip -P$mysql_port < init.sql