# Installation

Install Node.js and then:

```sh
$ git clone https://github.com/idispatch75/4t-angular.git
$ sudo npm -g install grunt-cli karma bower bower-installer
$ cd 4t-angular
$ npm install
$ bower-installer
```

# Development

```sh
$ grunt watch
```
```sh
$ cd server
$ node server.js
```
Open http://localhost:1337/ in Chrome with `--disable-web-security`.
The served pages are in `./build`.

# Compilation for deployment

```sh
$ grunt
```
The deployable is in `./bin`.

# Example

The bin is visible here : http://idispatch75.github.io/4t-angular/
It must be used with Chrome with command line options `--disable-web-security`.
