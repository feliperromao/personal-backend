start:
	docker-compose up

up:
	docker-compose up -d

up-prod:
	docker-compose -f docker-compose-prod.yaml up -d

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

create-tag:
	# command: make create-tag version="1.0.0"
	@[ "${version}" ] || ( echo ">> var version is not set"; exit 1 )
	DOCKER_BUILDKIT=1 docker build --no-cache  --target production -t personal-backend:${version} .

push-image:
	# docker tag a015b37ab2c4 feliperomao07/personal-backend:1.0.0
	# docker push feliperomao07/personal-backend:1.0.0