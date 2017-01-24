# Avidity editor

There is a need for a user-friendly, capable and well engineered editor in the Avidity suite of products, most notably, Promote and Assessor. Work has been made to research and customize the best of embedded HTML editors.

## Requirements

The requirements for the editor are listed in [this epic](https://www.pivotaltracker.com/n/projects/539231/epics/1862928 "Editor epic") and further developed in [this brief](https://github.com/avidity/promote-editor/blob/master/BRIEF.md "Editor brief"). In can be summed up in “the usual requirements”, with a few additions and hard requirements. The editor should support headings, paragraphs, bold and italic text, links, lists, quotes and code. It should have a clickable and easily navigable menu, as well as keyboard shortcuts for commonly used commands. It should be able to switch to code-view, and back. What’s more, it should support easy embedding of images, with automatic upload functionality, and embedding of videos from big video services such as YouTube and Vimeo.

Should it not support these features and fulfil these requirements out of the box, it should be easily extendible, and be extended to do so. Further, the editor should produce semantically correct HTML, where the various elements of the text have a sensible mapping to the underlying HTML structure.

Finally, it should be supported in modern versions of auto-updating browsers, as well as IE11.

## Contenders

Many editors have been written, and these are a few of them:

* Trix — Supported by and used in Basecamp, handles files and images well

* Squire — Used in FastMail, made for text

* ProseMirror — newish editor, supported by IndieGogo campaign, good design

* Scribe — Supported and used by The Guardian, good model

* CKEditor — old and battle-tested, lots of plugins

* Quill

* Summernote

* wysihtml

* TinyMCE — old and tested

* Textbox.IO — new from TinyMCE team

* Froala — Many features, content layout

* Redactor — Lots of features, closed source, worsening reputation

### WYSIWYG vs WYSIWYM

A common way to implement a rich text editor is the WYSIWYG paradigm. It is user-friendly and, if implemented well, offers the user a simple way of creating good looking content. When it comes to creating well-structured content, however, it often falls short. It may let the user insert “large”, “medium” or “small” text — or let the user even specify the font size — instead of offering headings of different levels. It may insert hard line breaks in text, instead of dividing it in different paragraphs, and so on.

WYSIWYM is a response to this confusion and is an attempt to present, and let a user edit, the structure of a document. Instead of What You See Is What You Get, it’s What You See Is What You Mean. In particular, a WYSIWYM editor will let the user perfom actions that map to some structured schema, and actions which do not map to that schema are simply not possible. As such, the underlying document is always well-structured, and you know what you get.

### contentEditable and execCommand

The contentEditable standard is in a sad state and is not a good basis for an editor. This is not only because of vague requirements and differences in browser implementations, but also because it is, plainly put, [terrible](https://medium.com/medium-eng/why-contenteditable-is-terrible-122d8a40e480#.pt9ytlsfr "Why ContentEditable is Terrible"). This is related to the previous point of WYSIWYG and WYSIWYM, and it is impossible to create a WYSIWYM editor with contentEditable as such.

### Trix

Trix is one of the final contenders, in particular it handles images well. We have spent some time researching and customizing this editor. It’s supported by Basecamp which makes it unlikely to lose support in the near future. It also has an internal document structure, and only uses contentEditable as an I/O device, parsing the HTML to it’s own format and serializing it back again.

Unfortunately, it has a weak internal document structure and is WYSIWYG. It “separates” paragraphs with hard line breaks and, as it depends on the document model, this is not easily fixed. What’s more, it is not very extensible, and we had to make extensive changes to the editor in order to add e.g. support for embedding videos. This makes the long-term support of the editor less attractive, since we would still need to maintain our own fork.

### ProseMirror

ProseMirror is interesting in that it also parses to its own document model. What’s more, it’s a good model and it adheres to the WYSIWYM paradigm. It also supports pluggable schemas, making it possible to add or remove types of content, for instance limiting headings to level 1, 2 and 3. This is how support for video embedding would be implemented.

It is also extendible in its commands, adding or removing commands from its context aware menu, with configurable keyboard shortcuts. Further, it has the concept of automatic input, where, for instance, a leading ‘> ‘ will turn into a block quote, surrounding ‘""‘ will turn into ‘“”‘ and so on. This is how e.g. video short-codes would be implemented.

It has a nice API and good documentation. Among its cons is that it is still very young and in a state of rapid change. The core document format and architecture will probably not change much, but tracking of changes will be necessary. However, this is mitigated by it’s API and extensible nature.

### Others

Most of the other researched editors are WYSIWYG and/or have weak document structure and architecture. Scribe could be interesting, in particular, because of it’s plug-in architecture and institutional support. Squire may also be interesting.

## Recommendation

After researching the requirements, the work done and the various editors, my conclusion is that the strongest contender is ProseMirror. It’s default schema maps to CommonMark, and it also has support for Markdown. It has a sound architecture, which will change, but tracking the changes should be maintainable given its API and focus on extensibility. The architecture and the direction of development can likely be influenced, and pull requests are welcome. Support from the main author is available via the forum.

As a proof of concept, support for drag and drop of images has been implemented, as well as embedding videos using the point-and-click menu or inserting short-codes.

## Final thoughts

The field of embedded HTML editors is a tricky one and in constant flux. Any advanced editor is a complex program, particularly if supporting it’s own sound document model, and a sensible extension API. Picking the right contender is never easy, and keeping an eye on the development in the field is advisable. I feel confident in my assessment that ProseMirror is the best choice, but would keep track of Trix and Scribe, at least, and have an eye out for any new contenders.

    This document was written with ProseMirror and later exported to markdown.

## New input 2017-01-23

The last version Prosemirror worked completely was version 0.7.0. Today (2017-01-23) the latest version is 0.17.3. The API has been in constant flux since 0.7.0 and because of that updating to 0.17.3 is difficult. Furthermore, the editor doesn't support IE browser and Edge browsers, and the author of Prosemirror has choosen not to add and maintain that functionality. Because of this a new editor has been selected.

After looking through the options and also reading through this document, [quilljs](https://quilljs.com) has been selected. Out of the box it supports most of the functionality we require - even adding a special case for video inclusion.
