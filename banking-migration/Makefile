.PHONY: db-up db-down seed backend-dev frontend-dev test-all test-backend test-frontend

db-up:
	docker compose up -d postgres pgadmin

db-down:
	docker compose down -v

seed:
	cd backend && npm run seed

backend-dev:
	cd backend && npm run start:dev

frontend-dev:
	cd frontend && npm start

test-all: test-backend test-frontend

test-backend:
	cd backend && npm test

test-frontend:
	cd frontend && npm test -- --watch=false --browsers=ChromeHeadless
