docker compose down
docker container rm -f $(docker container ls -aq)
docker network remove nat