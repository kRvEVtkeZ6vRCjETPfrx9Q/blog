.RECIPEPREFIX = >
.PHONY: build up down dev dev-down

build:
> docker build -t blog-backend -f backend/Dockerfile .

up: build
> docker-compose up -d

down:
> docker-compose down

dev:
> docker-compose -f docker-compose.dev.yaml up --build

dev-down:
> docker-compose -f docker-compose.dev.yaml down
