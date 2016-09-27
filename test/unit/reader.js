import test from 'ava';
// import winston from 'winston';
import LineBlobReader from '../../src/line-blob-file-reader';
import FileWrapper from '../../src/file-wrapper';

let reader = null;

test.before('instantiate', t => {
  const file = new FileWrapper('../chapter1-loomings.txt');
  const readerOptions = {
    chunkSize: 1024 * 1,
    delimeter: '\n',
  };
  reader = new LineBlobReader(file, readerOptions);
  reader._setDefaults();
  t.is(reader.chunkSize, readerOptions.chunkSize, 'values should be equal');
});

test('parse first chunk', t => {
  reader.readFirstBlob((text, progress) => {
    t.pass(text, progress);
  });
});
