# Instrukcja
Uruchamianie
```sh
docker network create --driver bridge net
docker compose up -d
```
Usuwanie:
```sh
docker compose down
docker network remove nat
``` 