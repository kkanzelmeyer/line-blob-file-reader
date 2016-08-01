# Line Blob File Reader
Reads files in blobs of lines in the browser

## Quick Start
### Install the dependency
```javascript
npm install line-blob-file-reader --save
```

### Import the module
```javascript
import LineBlobFileReader from 'line-blob-file-reader';
```

### Parse Your File
```javascript
// get the file reference
const file = document.getElementById('input').files[0];

// create a handler to handle file blobs
const handleBlob = (data, progress, finished) => {
  console.debug(`Progress: ${progress}%`);

  if (finished) {
    console.debug('Reading complete');
  }
  // do something with the data. Remember, the reader is returning
  // only a chunk of the file; not the whole file
  console.debug(data);
}

// call the reader
const blobReader = new LineBlobFileReader(file);
blobReader.readFile(handleBlob);
```

## Documentation

## Examples
