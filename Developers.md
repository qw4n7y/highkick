### How to run client dev server

- run sample_app (that serves /highkick on 8000 port)
- cd client && yarn run start

### How to bake files into package

- use `pkger.Include` anywhere in the code
- pkger (https://github.com/markbates/pkger)

### How to run deploy a new package version

git tag -a v1.2.5 -m "v1.2.5"
git push --follow-tags origin