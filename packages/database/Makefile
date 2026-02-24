# Makefile for PostgreSQL Docker Compose
.PHONY: up down restart logs psql

# Start container
up:
	docker-compose up -d

# Stop container
down:
	docker-compose down

# Restart container
restart: down up

# Show logs
logs:
	docker-compose logs -f

# Connect to PostgreSQL shell
psql:
	docker exec -it postgres_db psql -U user -d stardrips
