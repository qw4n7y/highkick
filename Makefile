hello:
	@echo "Hello"

run: hello
	cd dev && PORT=8000 go run sample_app.go

run_with_hotreloading: hello
	./air -c ./.air.conf

run_migrations_dev: hello
	migrate -path "./migrations" -database "mysql://root:root@tcp(127.0.0.1:3306)/highkick_dev" up

build_client: hello
	cd client && REACT_APP_PUBLIC_URL=/highkick/client yarn run build && cd ..
	# rm -rf server/static/* && cp -R gui/build/ server/static/
	# sed -i -e 's/src=\"\/static/src=\"\/highkick\/gui\/static/g' server/static/index.html