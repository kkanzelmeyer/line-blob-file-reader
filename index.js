
class FileLineReader {

  /**
   * FileLineReader constructor
   * @param  {File} file      The file reference
   * @param  {Number} chunkSize The size in bytes to read at one time
   * @param  {String} delimiter The character to search for in the data chunk
   */
  constructor (file, chunkSize, delimiter) {
    this.file = file;
    this._setDefaults = this._setDefaults.bind(this);
    this._readBlob = this._readBlob.bind(this);
    this._processBlob = this._processBlob.bind(this);
    this.readFile = this.readFile.bind(this);
    this.readFirstBlob = this.readFirstBlob.bind(this);
    this.readLastBlob = this.readLastBlob.bind(this);
    this.readReverse = false;
    this.defaults = {
      chunkSize: chunkSize || 1024*100*1,
      offset: 0,
      objectCount: 0,
      progress: 0,
      chunksRead: 0,
      delimiter: delimiter || '\n'
    };
  }

  /**
   * Sets the initial values to the defaults
   */
  _setDefaults () {
    const { chunkSize, offset, objectCount, progress, chunksRead, delimiter } = this.defaults;
    this.chunkSize = chunkSize;
    this.offset = offset;
    this.objectCount = objectCount;
    this.progress = progress;
    this.chunksRead = chunksRead;
    this.delimiter = delimiter;
    this.fr = new FileReader();

    // simple error handler
    this.fr.onerror = function () {
      console.debug('Error reading file =(');
    };
  }

  /**
   * Method to read a slice of a file
   */
  _readBlob (callback) {
    const { file, offset, fr } = this;
    let nextChunk = this.offset + this.chunkSize;

    // approcahing end of file
    if (nextChunk > file.size) {
      // adjust the final chunk size to read the remaining file contents
      this.chunkSize = nextChunk-file.size;
      console.debug('Last chunk of data');
    }

    // reached end of file
    if (offset >= file.size) {
      console.debug('End of file');
      console.debug(`Object count: ${this.objectCount}`);
      console.debug(`Chunks Read: ${this.chunksRead}`);
      callback({}, 100, true);
      return;
    }

    const slice = file.slice(offset, nextChunk);
    fr.readAsText(slice);
  }

  /**
   * Internal method to process a slice of data from the FileReader
   *
   * @param  {Function} callback The function to call after the slice is processed
   */
  _processBlob (callback) {
    const { file, fr, delimiter } = this;

    const dataChunk = fr.result;
    const lastCharIndex = this.readReverse ? dataChunk.indexOf(delimiter)+1 : dataChunk.lastIndexOf(delimiter);
    if (lastCharIndex === -1) {
      console.debug('No delimiter found');
      console.debug(dataChunk);
      return;
    }

    // Make data chunk end at the last complete line
    const resultString = this.readReverse
      ? `${dataChunk.substring(lastCharIndex)}`
      : `${dataChunk.substring(0, lastCharIndex)}`;

    // update the callback
    this.progress = Math.round((this.offset/file.size) * 100);
    callback(resultString, this.progress);

    // update bookkeeping values
    this.objectCount += dataObject.length;
    this.offset += lastCharIndex+1;
    this.chunksRead += 1;
  }

  /**
   * Read an entire file slice by slice, calling the callback after each slice
   * is read
   * @param  {Function} callback The function to call after each slice is processed.
   *                             The callback is given (data, progress, finished)
   */
  readFile (callback) {
    console.debug('reading file');
    this._setDefaults();
    this.fr.onload = () => {
      this._processBlob(callback);
      this._readBlob(callback);
    };
    this._readBlob(callback);
  }

  /**
   * Read the first slice of a file, calling the callback after the slice is read
   *
   * @param  {Function} callback The function to call after each slice is processed.
   *                             The callback is given (data, progress)
   */
  readFirstBlob (callback) {
    console.debug('reading first file chunk');
    this._setDefaults();
    this.fr.onload = () => {
      this._processBlob(callback);
    };
    this._readBlob();
  }

  /**
   * Read the last slice of a file, calling the callback after the slice is read
   *
   * @param  {Function} callback The function to call after each slice is processed.
   *                             The callback is given (data, progress)
   */
  readLastBlob (callback) {
    console.debug('reading last file chunk');
    this._setDefaults();
    // force the seek function to only read the last file chunk
    this.offset = this.file.size - this.chunkSize;
    this.readReverse = true;
    this.fr.onload = () => {
      this._processBlob(callback);
    };
    this._readBlob();
  }
}

export default FileLineReader;
