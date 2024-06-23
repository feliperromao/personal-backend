start:
	docker-compose up

up:
	docker-compose up -d

build:
	docker-compose up -d --build

down:
	docker-compose down

logs:
	docker-compose logs -f personal_app

bash:
	docker exec -ti personal_app bash

nest-build:
	docker exec -ti personal_app npm run build