# prac2_microservice

Clone repo from github:
```
git clone git@github.com:DangKimAn/prac2_microservice.git
cd prac2_microservice
cp .env.example .env
```

Install Doker from:

```
https://www.docker.com/products/docker-desktop/
```

Add enviroment variable to .env file:

Run docker compose:
```
docker compose up -d --build   
```

Access to see swagger:
localhost://{PRODUCT_SERVICE_PORT}/api-docs
localhost://{ORDER_SERVICE_PORT}/api-docs
localhost://{AUTH_SERVICE_PORT}/api-docs

access:
localhost://{API_GATEWAY_PORT}/api/productcs = localhost://{PRODUCT_SERVICE_PORT}/api
localhost://{API_GATEWAY_PORT}/api/orders = localhost://{ORDER_SERVICE_PORT}/api

    