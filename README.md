# WYSIWYG editor

Rich content editor based on [Quilljs](https://quilljs.com/).

## Dev setup

1. Get nodejs - easily installed via [nvm](http://nvm.sh/).
2. Install dev dependencies: `$ npm install --dev`
3. Install webpack: `$ npm install webpack --save`
4. Install webpack dev server: `$ npm install webpack-dev-server --save`

### Running the demo for dev/debugging

1. Start the webserver (from the `demo/` dir): `$ webpack-dev-server`
2. In another terminal tab (from the root dir): `$ webpack --watch` or if you want to run the production version: `$ PROD_ENV=1 webpack --watch`

## Bundling

The bundled version is `dist/promote-editor.js`. To release a new version run:
```
$ npm run dist
```

Bundle a production version - at the moment the only difference is that there is a comment with version at the top of the file. The output file is `dist/promote-editor.dist.js`:
```
$ PROD_ENV=1 npm run dist
```
