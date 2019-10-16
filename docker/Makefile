
#IMAGE=angular-cli-docker:7.0.5
IMAGE=node:12.11.1-alpine
NAME=node-12.11.1

USER_ID=`id -u $(USER)`
HOTE=192.168.1.7



dev: ## Run container on port configured in `config.env`--network="host" --name="$(NAME)"
	docker run -e UID=$(USER_ID) --hostname="my-node" -it --rm -p 8080:8080 -v $(CURDIR)/../app:/app $(IMAGE)


build:
	docker build --rm -f Dockerfile  -t $(IMAGE) .