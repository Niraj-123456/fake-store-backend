
IMAGE_NAME=fake-store-backend
CONTAINER_NAME=fake-store-backend-container
PORT=8080
DOCKER_FILE=Dockerfile
BASE_URL=localhost:8080

# build docker image
docker-build:
	docker build -t ${IMAGE_NAME} -f ${DOCKER_FILE} .

# remove docker image
docker-image-remove:
	docker image rm ${IMAGE_NAME}

# run docker container
docker-run: 
	docker run -d --name ${CONTAINER_NAME} --restart=always -p ${PORT}:${PORT} ${IMAGE_NAME}

# start docker container
docker-start:
	docker start -a ${CONTAINER_NAME}

# stop docker container
docker-stop:
	docker stop ${CONTAINER_NAME}

#remove docker container
docker-remove:
	docker container rm ${CONTAINER_NAME}

stripe-webhooks:
	stripe listen --forward-to ${BASE_URL}/api/v1/stripe-webhook