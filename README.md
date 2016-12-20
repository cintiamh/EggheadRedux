# EggheadRedux

## Setting up a React Redux Webpack project

### Setting up Webpack

Initialize the npm packages and install webpack:

```
$ npm init
$ npm i webpack --save-dev
$ npm i webpack-dev-server --save-dev
$ touch webpack.config.js
```

Create the folder structure:

```
+ dist 
+ src +
      + index.jsx
+ test
```

The `webpack.config.js` file content:

```javascript
var webpack = require('webpack');
var path = require('path');

var config = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3000',
    './src/index.jsx'
  ],
  resolve: {
    root: [
      // allows us to import modules as if /src was the root.
      // so I can do: import Comment from 'components/Comment'
      // instead of:  import Comment from '../components/Comment' or whatever relative path would be
      path.resolve(__dirname, './src')
    ],
    // allows you to require without the .js at end of filenames
    // import Component from 'component' vs. import Component from 'component.js'
    extensions: ['', '.js', '.json', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
          test: /\.jsx?$/,
          loaders: ['babel'],
          exclude: /(node_modules|bower_components)/
      }
    ]
  }
}

module.exports = config;
```

#### Babel

```
$ npm i babel-loader babel-core babel-preset-react babel-preset-es2015 --save-dev
$ touch .babelrc
```

The `.babelrc` file content is:

```json
{
  "presets": ["react", "es2015"]
}
```

#### React

Install the React packages:

```
$ npm i react react-dom redux react-redux --save
```

In `package.json`, include the following scripts for build and dev:

```json
scripts: {
  "dev": "webpack-dev-server --port 3000 --devtool eval --progress --colors --hot --content-base dist",
  "build": "webpack"
}
```

Let's create some files for testing.

```
$ touch src/index.jsx
$ touch dist/index.html
```

src/index.jsx
```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';

class Root extends Component {
    render() {
        return <h1> Hello World </h1>;
    }
}

render(<Root />, document.getElementById('root'));
```

dist/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
<div id="root"></div>
<script src="bundle.js"></script>
</body>
</html>
```

Now you should be able to run build:

```
$ npm run build
```

And you can also run development mode. The preview will be available at http://localhost:3000

```
$ npm run dev
```

### Setting up Tests

We are going to setup Mocha, Chai, Sinon and Enzyme for testing.

```
$ npm i mocha chai sinon babel-register enzyme react-addons-test-utils --save-dev
```

Let's create a helper file to do repetitive importing at once and our first test:

```
$ touch test/testHelper.js
$ touch test/index.spec.js
```

test/testHelper.js
```javascript
import { expect } from 'chai';
import sinon from 'sinon';

global.expect = expect;
global.sinon = sinon;
```

test/index.spec.js
```javascript
describe('hello world', () => {
    it('works!', () => {
        expect(true).to.be.true;
    });
});
```

Include these scripts into package.json:

```javascript
scripts: {
    "test": "mocha --compilers js:babel-register --require ./test/test_helper.js --recursive",
    "test:watch": "npm test -- --watch"
}
```

Now you can run the tests once with:

```
$ npm run test
```

Or keep them running and watching for changes (development mode):

```
$ npm run test:watch
```

### Setting up Karma

At this point, we already have all tests working fine, but we can make the tests simpler and doing
more by using Karma.

```
$ npm i karma karma-chai karma-mocha karma-webpack --save-dev
$ npm i karma-sourcemap-loader karma-phantomjs-launcher --save-dev
$ npm i karma-spec-reporter --save-dev
$ npm i yargs --save-dev
$ touch karma.config.js
```

The karma.config.js file content is:

```javascript
var argv = require('yargs').argv;
var path = require('path');

module.exports = function(config) {
  config.set({
    // only use PhantomJS for our 'test' browser
    browsers: ['PhantomJS'],

    // just run once by default unless --watch flag is passed
    singleRun: !argv.watch,

    // which karma frameworks do we want integrated
    frameworks: ['mocha', 'chai'],

    // displays tests in a nice readable format
    reporters: ['spec'],

    // include some polyfills for babel and phantomjs
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './test/**/*.js' // specify files to watch for tests
    ],
    preprocessors: {
      // these files we want to be precompiled with webpack
      // also run tests throug sourcemap for easier debugging
      ['./test/**/*.js']: ['webpack', 'sourcemap']
    },
    // A lot of people will reuse the same webpack config that they use
    // in development for karma but remove any production plugins like UglifyJS etc.
    // I chose to just re-write the config so readers can see what it needs to have
    webpack: {
       devtool: 'inline-source-map',
       resolve: {
        // allow us to import components in tests like:
        // import Example from 'components/Example';
        root: path.resolve(__dirname, './src'),

        // allow us to avoid including extension name
        extensions: ['', '.js', '.jsx'],

        // required for enzyme to work properly
        alias: {
          'sinon': 'sinon/pkg/sinon'
        }
      },
      module: {
        // don't run babel-loader through the sinon module
        noParse: [
          /node_modules\/sinon\//
        ],
        // run babel loader for our tests
        loaders: [
          { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
        ],
      },
      // required for enzyme to work properly
      externals: {
        'jsdom': 'window',
        'cheerio': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': 'window'
      },
    },
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-sourcemap-loader'
    ]
  });
};
```

Now you can update the test scripts on `package.json` to use karma:

```javascript
scripts: {
    "test": "node_modules/.bin/karma start karma.config.js"
}
```

### Setting up ESLint

```
$ npm i eslint-config-airbnb eslint-plugin-react eslint --save-dev
$ touch .eslintignore
$ touch .eslintrc
```

In package.json include:

```javascript
scripts: {
    "lint": "eslint . --ext .js --ext .jsx"
}
```

In .eslintignore include:

```
node_modules/
dist/
```

In .eslintrc include:

```javascript
{
  "extends": "airbnb",
  "env": {
    "browser": true
  },
  "rules": {
    "indent": [2, 4],
    "comma-dangle": "off",
    "no-plusplus": "off",
    "max-len": [2, 100, 4, {"ignoreComments": true}]
  }
}
```
