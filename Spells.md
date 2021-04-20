migrate -path "./migrations/" -database "mysql://root:root@tcp(127.0.0.1:3306)/highkick_dev" up

git tag -a v0.3.1 -m "v0.3.1"
git push --follow-tags origin