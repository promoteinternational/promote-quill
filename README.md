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

To create a new version of `dist/promote-editor.js`,
first bump version in `package.json`, then run:

``` bash
$ npm run dist
```

