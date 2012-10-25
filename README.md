# NodeExamples

Just some little node example scripts

## ReadFiles

`
    node ./ReadFiles/read-some.js
`
Demonstrates walking a directory tree using dive.

## ProcessImages

Utilizes ImageMagick to resize a bunch of images in a directory.

### process-some-0.js

Demonstrates how naively invoking im.resize on every image will eventually blow up as system resource limits will get exhuasted. In this case, its probably the maximum number of open files which on the author's machine is 256.

### process-some-1.js

Demonstrates the use of step to invoke im.resize in parallel on a small subset of resize operations. Upon successful completion of these, another batch will get started.
