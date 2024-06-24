#!/bin/bash

cd /home/server/chat-hub

#接收使用此脚本参数
applicationVersion=$1
key=$2

if [ -z "$applicationVersion" ]; then
  echo "Error: application version is not set or is empty."
  exit 1
fi

if [ -z "$key" ]; then
    echo "Error: key is not set or is empty."
    exit 1
fi

#移除之前的docker跑的容器
echo "rm docker ChatHubService success , docker id $(docker rm -f ChatHubService 2>/dev/null)"

#启动
docker run -d --name ChatHubService -u 0 -p 8080:8080 -v /home/server/chat-hub:/home/server/chat-hub openjdk:17 java -jar -Duser.timezone=GMT+08 /home/server/picture/application-1.0."$applicationVersion".jar --mpw.key="$key"

#输出提升
echo "run java application-1.0."$applicationVersion".jar success"

#输出dockerId
javaDockerId=$(docker ps -a | grep 'ChatHubService' | awk '{print $1}')
echo "docker id $javaDockerId"
