### How to run client dev server

- run sample_app (that serves /highkick on 8000 port)
- cd client && yarn run start

### How to bake files into package

- use `pkger.Include` anywhere in the code
- pkger (https://github.com/markbates/pkger)

### How to run deploy a new package version

git tag -a v1.6.3 -m "v1.6.3"
git push --follow-tags origin

### Migrations

`migrate -path "./migrations/mysql" -database "mysql://root:root@tcp(127.0.0.1:3306)/highkick_dev" up`