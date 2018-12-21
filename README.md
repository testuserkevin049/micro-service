# micro-service

  Simple node swagger service with basic ( username & password ) authentication.

## Prerequisites

  1. Nodejs - version - ~ v8.9.4 [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
  2. Visual Studio Code (IDE) [https://code.visualstudio.com/download](https://code.visualstudio.com/download)


### setup

  - Please create a new directory at root of the project called data. This is a temporary folder where
    downloaded thumbnails before they are deleted during tests.


```bash

# Test directory 
$ mkdir data/tests

# User directory
# replace the username with the username of the user
# Please run this everytime you are about to login a user
$ mkdir data/{USERNAME}

```

## How to use

The following npm scripts are available:

~~~ sh
npm start          // starts the application
npm test           // runs all tests
npm run build      // creates a docker container
npm run watch      // runs a file watcher to restart and test on each file change
~~~

## License

MIT