# Development Server

## Dev Server

To use dev server, you must have an SSL certificate since browsers enforce *https* for webcam access  

You can use a provided ones self-signed certificate or configure your own  

Self-signed test certificate was generated using:

```shell
openssl req -x509 -newkey rsa:4096 -nodes -keyout https.key -out https.crt -days 365 -subj "/C=US/ST=Florida/L=Miami/O=@vladmandic"
```

If you want to use your own certificate, edit `build.json`:

By default, secure http2 web server will run on port `10031` and unsecure http server will run on port `10030` which is configurable in `build.json`  

Development environment is started by running `npm run dev`

```js
2021-09-10 21:03:37 INFO:  @vladmandic/human version 2.1.5
2021-09-10 21:03:37 INFO:  User: vlado Platform: linux Arch: x64 Node: v16.5.0
2021-09-10 21:03:37 INFO:  Application: { name: '@vladmandic/human', version: '2.1.5' }
2021-09-10 21:03:37 INFO:  Environment: { profile: 'development', config: 'build.json', tsconfig: true, eslintrc: true, git: true }
2021-09-10 21:03:37 INFO:  Toolchain: { build: '0.3.4', esbuild: '0.12.26', typescript: '4.4.3', typedoc: '0.21.9', eslint: '7.32.0' }
2021-09-10 21:03:37 STATE: WebServer: { ssl: false, port: 10030, root: '.' }
2021-09-10 21:03:37 STATE: WebServer: { ssl: true, port: 10031, root: '.', sslKey: 'node_modules/@vladmandic/build/cert/https.key', sslCrt: 'node_modules/@vladmandic/build/cert/https.crt' }
2021-09-10 21:03:37 STATE: Watch: { locations: [ 'test/src/**', 'src/**', 'tfjs/*', [length]: 3 ] }
2021-09-10 21:03:37 STATE: Watch: { locations: [ 'test/src/**', 'src/**', 'tfjs/*', [length]: 3 ] }
2021-09-10 21:03:37 STATE: Watch: { locations: [ 'test/src/**', 'src/**', 'tfjs/*', [length]: 3 ] }
2021-09-10 21:07:48 INFO:  Watch: { event: 'modify', input: 'src/human.ts' }
2021-09-10 21:07:48 STATE: Build: { name: 'tfjs for browser esm bundle', type: 'development', format: 'esm', platform: 'browser', input: 'tfjs/tf-browser.ts', output: 'dist/tfjs.esm.js', files: 7, inputBytes: 2168, outputBytes: 2343946 }
2021-09-10 21:07:49 STATE: Build: { name: 'human for browser esm bundle', type: 'development', format: 'esm', platform: 'browser', input: 'src/human.ts', output: 'dist/human.esm.js', files: 47, inputBytes: 2799374, outputBytes: 2583497 }
2021-09-10 21:07:31 DATA:  GET/1.1 200 text/html; charset=utf-8 6435 / ::ffff:192.168.0.200
2021-09-10 21:07:31 DATA:  GET/1.1 200 text/css; charset=utf-8 107884 /icons.css ::ffff:192.168.0.200
2021-09-10 21:07:31 DATA:  GET/1.1 200 text/javascript; charset=utf-8 44675 /index.js ::ffff:192.168.0.200
2021-09-10 21:07:31 DATA:  GET/1.1 200 text/javascript; charset=utf-8 2583497 /dist/human.esm.js ::ffff:192.168.0.200
...
```

## Human as a Daemon

If you want to run `Human` as a `systemd` service on `Linux`,  
take a look at included sample `human.service` file:

- modify NodeJS path in `ExecStart`
- modify path to `@vladmandic/build` in `ExecStart`
- set your working folder in `WorkingDirectory`
- ser your user in `User`

```text
[Unit]
Description=human
After=network.target network-online.target

[Service]
Type=simple
Environment="NODE_ENV=production"
ExecStart=/home/vlado/.nvm/versions/node/v16.5.0/bin/node /home/vlado/dev/human/node_modules/@vladmandic/build/src/build.js --profile development
WorkingDirectory=/home/vlado/dev/human
StandardOutput=inherit
StandardError=inherit
Restart=always
RestartSec=300
User=vlado
StandardOutput=null

[Install]
WantedBy=multi-user.target
```

To activate service:

- copy the content to your `/etc/systemd/system` folder
- reload service configuration: `sudo systemctl daemon-reload`
- start service with: `sudo systemctl start human`
- stop service with: `sudo systemctl stop human`
- check status with: `sudo systemctl status human`
- to run service on system startup: `sudo systemctl enable human`
- to disable running service on system startup: `sudo systemctl disable human`

<br>
