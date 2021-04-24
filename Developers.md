### How to run client dev server

- run sample_app (that serves /highkick on 8000 port)
- cd client && yarn run start

### How to bake client build into package

- pkger (https://github.com/markbates/pkger)


### How to run migrations

migrate -path "./migrations/" -database "mysql://root:root@tcp(127.0.0.1:3306)/highkick_dev" up

### How to run deploy a new package version

git tag -a v0.3.1 -m "v0.3.1"
git push --follow-tags origin