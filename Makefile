
IMAGE_NAME=fake-store-backend
CONTAINER_NAME=fake-store-backend-container
PORT=8080
DOCKER_FILE=Dockerfile

# build docker image
docker-build:
	docker build -t ${IMAGE_NAME} -f ${DOCKER_FILE} .

# run docker container
docker-run: 
	docker run -d --name ${CONTAINER_NAME} --restart=always -p ${PORT}:${PORT} ${IMAGE_NAME}

# start docker container
docker-start:
	docker container start ${CONTAINER_NAME} -a