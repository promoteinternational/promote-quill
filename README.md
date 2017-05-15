# WYSIWYG editor

Rich content editor based on [Quilljs](https://quilljs.com/).

## Dev setup

1. Get nodejs - easily installed via [nvm](http://nvm.sh/).
2. Install dev dependencies: `$ npm install --dev`

## Running the demo for dev/debugging

1. Start the webserver: `$ npm run dev`
2. In another terminal tab (from the root dir): `$ npm run dist --watch` or if you want to run the production version: `$ PROD_ENV=1 npm run dist --watch`

## Running tests
``` bash
$ npm test
```

## Bundling

The bundled version is `dist/promote-editor.js`. To create a new version, run:
``` bash
$ npm run dist
```

Bundle a production version - at the moment the only difference is that there is a comment with version at the top of the file. The output file is `dist/promote-editor.dist.js`:
``` bash
$ PROD_ENV=1 npm run dist
```
