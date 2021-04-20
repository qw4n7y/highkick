hello:
	@echo "Hello"

run: hello
	cd dev && PORT=8000 go run sample_app.go

run_client: hello
	cd client && PORT=3000 yarn run start

run_with_hotreloading: hello
	./air -c ./.air.conf

run_migrations_dev: hello
	migrate -path "./migrations" -database "mysql://root:root@tcp(127.0.0.1:3306)/highkick_dev" up

build_client: hello
	rm -rf client/build
	cd client && REACT_APP_PUBLIC_URL=/highkick/client yarn run build && cd ..

generate_docs: hello
	go doc -all