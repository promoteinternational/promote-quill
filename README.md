# WYSIWYG editor

Rich content editor based on [Quilljs](https://quilljs.com/).

## Dev setup

1. Get nodejs - easily installed via [nvm](http://nvm.sh/).
2. Install dev dependencies: `$ npm install --only=dev`
3. (semioptional) Install dos2unix, to convert line endings after bundling.

## Running the demo for dev/debugging

1. Start the webserver: `$ npm run dev` and navigate to [localhost:8080](http://localhost:8080)
2. This will watch and autorecompile promote-editor.js, note that it serves it directly without writing to disk.

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
