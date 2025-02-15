NOTE: Before attempting to run anything, make sure "padaria.42.pt" is added to /etc/hosts so it resolves to 127.0.0.1

1. cd /srcs/requirements
2. docker build server
3. docker run -d -p 443:443 <IMAGE_ID>
