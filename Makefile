.RECIPEPREFIX = >
.PHONY: build-backend build-frontend up down

build-backend:
> docker build -t blog-backend ./backend

build-frontend:
> docker build -t blog-frontend ./frontend

up: build-backend build-frontend
> docker-compose up -d

down:
> docker-compose down
