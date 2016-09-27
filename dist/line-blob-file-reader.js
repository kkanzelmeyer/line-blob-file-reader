'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fileApi = require('file-api');

var _fileApi2 = _interopRequireDefault(_fileApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileLineReader = function () {

  /**
   * FileLineReader constructor
   * @param  {FileWrapper}  file      The file reference
   * @param  [Object]       options   The configuration options
   */
  function FileLineReader(file, options) {
    _classCallCheck(this, FileLineReader);

    this.file = file;
    this._setDefaults = this._setDefaults.bind(this);
    this._readBlob = this._readBlob.bind(this);
    this._processBlob = this._processBlob.bind(this);
    this.readFile = this.readFile.bind(this);
    this.readFirstBlob = this.readFirstBlob.bind(this);
    this.readLastBlob = this.readLastBlob.bind(this);
    this.readReverse = false;
    this.defaults = {
      chunkSize: options.chunkSize || 1024 * 100 * 1,
      offset: 0,
      progress: 0,
      chunksRead: 0,
      delimiter: options.delimiter || '\n'
    };
  }

  /**
   * Sets the initial values to the defaults
   */


  _createClass(FileLineReader, [{
    key: '_setDefaults',
    value: function _setDefaults() {
      var _defaults = this.defaults;
      var chunkSize = _defaults.chunkSize;
      var offset = _defaults.offset;
      var progress = _defaults.progress;
      var chunksRead = _defaults.chunksRead;
      var delimiter = _defaults.delimiter;

      this.chunkSize = chunkSize;
      this.offset = offset;
      this.progress = progress;
      this.chunksRead = chunksRead;
      this.delimiter = delimiter;
      this.fr = new _fileApi2.default.FileReader();

      // simple error handler
      this.fr.onerror = function (err) {
        throw Error(err);
      };
    }

    /**
     * Method to read a slice of a file
     */

  }, {
    key: '_readBlob',
    value: function _readBlob(cb) {
      var file = this.file;
      var offset = this.offset;
      var fr = this.fr;

      var nextChunk = this.offset + this.chunkSize;

      // approcahing end of file
      if (nextChunk > file.size()) {
        // adjust the final chunk size to read the remaining file contents
        this.chunkSize = nextChunk - file.size();
      }

      // reached end of file
      if (offset >= file.size()) {
        cb({}, 100, true);
        return;
      }

      var slice = file.slice(offset, nextChunk);
      fr.readAsText(slice);
    }

    /**
     * Internal method to process a slice of data from the FileReader
     *
     * @param  {Function} callback The function to call after the slice is processed
     */

  }, {
    key: '_processBlob',
    value: function _processBlob(cb) {
      var file = this.file;
      var fr = this.fr;
      var delimiter = this.delimiter;


      var dataChunk = fr.result;
      var lastCharIndex = this.readReverse ? dataChunk.indexOf(delimiter) + 1 : dataChunk.lastIndexOf(delimiter);
      if (lastCharIndex === -1) {
        throw Error('delimeter not found');
      }

      // Make data chunk end at the last complete line
      var resultString = this.readReverse ? '' + dataChunk.substring(lastCharIndex) : '' + dataChunk.substring(0, lastCharIndex);

      // update the callback
      this.progress = Math.round(this.offset / file.size() * 100);
      cb(resultString, this.progress);

      // update bookkeeping values
      this.offset += lastCharIndex + 1;
      this.chunksRead += 1;
    }

    /**
     * Read an entire file slice by slice, calling the callback after each slice
     * is read
     * @param  {Function} callback The function to call after each slice is processed.
     *                             The callback is given (data, progress, finished)
     */

  }, {
    key: 'readFile',
    value: function readFile(cb) {
      var _this = this;

      this._setDefaults();
      this.fr.onload = function () {
        _this._processBlob(cb);
        _this._readBlob(cb);
      };
      this._readBlob(cb);
    }

    /**
     * Read the first slice of a file, calling the callback after the slice is read
     *
     * @param  {Function} callback The function to call after each slice is processed.
     *                             The callback is given (data, progress)
     */

  }, {
    key: 'readFirstBlob',
    value: function readFirstBlob(cb) {
      var _this2 = this;

      this._setDefaults();
      this.fr.onload = function () {
        _this2._processBlob(cb);
      };
      this._readBlob();
    }

    /**
     * Read the last slice of a file, calling the callback after the slice is read
     *
     * @param  {Function} callback The function to call after each slice is processed.
     *                             The callback is given (data, progress)
     */

  }, {
    key: 'readLastBlob',
    value: function readLastBlob(cb) {
      var _this3 = this;

      this._setDefaults();
      // force the seek function to only read the last file chunk
      this.offset = this.file.size() - this.chunkSize;
      this.readReverse = true;
      this.fr.onload = function () {
        _this3._processBlob(cb);
      };
      this._readBlob();
    }
  }]);

  return FileLineReader;
}();

exports.default = FileLineReader;