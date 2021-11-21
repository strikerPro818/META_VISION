# Running Human in a Docker container

This guide covers multiple scenarios:

1. Run app using Human as a full environment inside container
2. Run app using Human as NodeJS worker inside container
3. Run Human for web inside container

<br>

## Install Docker
For details see [Docker Docs: Installation Guide](https://docs.docker.com/engine/install/)

Example: Install Docker using official convenience script:
> curl https://get.docker.com | sudo sh

Check Docker status installation:
> sudo docker version  
> sudo docker info  
> sudo systemctl status containerd docker  

Get list of running containers
> docker ps

Get logs from a running container
> docker logs `containerID`

Stop container
> docker stop `containerID`

Go to shell inside container
> docker exec -it `containerID` /bin/bash

<br>

## 1. Run Human full environment

- To run `human` inside docker container,  
  simply *dockerize* your application as usual
- Note that if your app has a dependency on `@vladmandic/human`,  
  all of `human` components will be installed by default and not just the library  
  (for example, this includes copies of in `/models` and sources in `/src`)
- It is strongly recommended to dockerize prodution mode only apps (`npm install --production`)  
  to avoid installing all of `human` dev dependencies inside the container

<br>

## 2. Run Human as NodeJS worker

### Minimize Dependnecies

To minimize size of a container dont install `human` as your app dependency  
And avoid importing entire `@vladmandic/human` as usual:

```js
// const Human = require('@vladmandic/human').default;
```

Instead import `human` library directly as only library is required inside docker container:

```js
const Human = require('./human-dist/human.node.js').default;
```

### Configure Docker

Create Docker recipe `myapp.docker` in your `human` project folder  

- Can use `NodeJS` 14 or 16
- Minimal footprint as only `/dist` is actually required
- Assumes user has NodeJS app `myapp` with its `package.json`
- Modify workdir path as needed
- Modify entry point as needed

```text
FROM node:16
WORKDIR <path-to-myapp>
COPY package.json .
copy <myapp> .
RUN npm install
COPY node_modules/@vladmandic/human/dist ./human-dist
ENTRYPOINT node myapp/index.js
USER node
```

### Build image

> sudo docker build . --file myapp.docker --tag myapp

### Run container 

- Maps `models` from host to a docker container so there is no need to copy it into each container
- Modify path as needed

> docker run -docker run -it --init --detach \
--volume node_modules/@vladmandic/human/models:$PWD/models \
myapp

<br>

## 3. Run Human for Web

### Configure Docker

Create Docker recipe `human-web.docker` in your `human` project folder  

- Can use `NodeJS` 14 or 16
- Default package is empty as `human` has no external dependencies
- Minimal footprint as only `/dist` is actually required
- As an example, copies default `/demo` web app to serve
- Uses `@vladmandic/build` as web server
- Modify workdir path as needed

```text
FROM node:16
WORKDIR <path-to-myapp>
RUN npm init --yes
COPY build.json .
RUN npm install @vladmandic/build --no-fund
COPY dist ./dist
COPY demo ./demo
EXPOSE 10031
ENTRYPOINT node node_modules/@vladmandic/build/dist/build.js --profile serve
USER node
```

### Build image

> sudo docker build . --file human-web.docker --tag human-web

### Run container 

- Maps `models` from host to a docker container so there is no need to copy it into each container
- Maps human internal web server to external port 8001 so app can be accessed externally

> docker run -docker run -it --init --detach --name human-web-instance \
--publish 8001:10031 \
--volume node_modules/@vladmandic/human/models:$PWD/models \
human-web

<br>
