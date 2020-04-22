# WYSIWYG editor

Rich content editor based on [Quilljs](https://quilljs.com/).

## Dev setup

1. Get nodejs - easily installed via [nvm](http://nvm.sh/).
2. Install dev dependencies: `$ npm install`
3. (semioptional) Install dos2unix, to convert line endings after bundling.

## Running the demo for dev/debugging

1. Start the webserver: `$ npm run dev` and navigate to [localhost:8080](http://localhost:8080)
2. This will watch and autorecompile promote-editor.js, note that it serves it directly without writing to disk.

## Running tests

```bash
$ npm test
```

## Bundling

To create a new version of `dist/promote-editor.js`:
First bump version in `package.json`,
preferably edit this version directly on master and push it:

```bash
git checkout master
git pull
# edit package.json
git add package.json
git commit -v "Bump version"
git push
# use the correct version
git tag -a v0.x.y
git push --tags
```

Then either run this,
or trigger the tag build on CI to generate the asset there.


```bash
$ npm run dist
```

<https://ci.promoteapp.net/blue/organizations/jenkins/gems%2Fpromote-quill/branches>
