.RECIPEPREFIX = >
.PHONY: build build-backend-dev build-frontend-dev build-dev up down dev dev-down

build:
> docker build -t blog-backend -f backend/Dockerfile .

build-backend-dev:
> docker build -t blog-backend-dev -f backend/Dockerfile.dev .

build-frontend-dev:
> docker build -t blog-frontend-dev -f frontend/Dockerfile.dev frontend

build-dev: build-backend-dev build-frontend-dev

up: build
> docker-compose up -d

down:
> docker-compose down

dev:
> docker-compose -f docker-compose.dev.yaml up

dev-down:
> docker-compose -f docker-compose.dev.yaml down
