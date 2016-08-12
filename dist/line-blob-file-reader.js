(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["lineBlobFileReader"] = factory();
	else
		root["lineBlobFileReader"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FileLineReader = function () {
	
	  /**
	   * FileLineReader constructor
	   * @param  {File} file      The file reference
	   * @param  {Number} chunkSize The size in bytes to read at one time
	   * @param  {String} delimiter The character to search for in the data chunk
	   */
	  function FileLineReader(file, chunkSize, delimiter) {
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
	      chunkSize: chunkSize || 1024 * 100 * 1,
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
	
	
	  _createClass(FileLineReader, [{
	    key: '_setDefaults',
	    value: function _setDefaults() {
	      var _defaults = this.defaults;
	      var chunkSize = _defaults.chunkSize;
	      var offset = _defaults.offset;
	      var objectCount = _defaults.objectCount;
	      var progress = _defaults.progress;
	      var chunksRead = _defaults.chunksRead;
	      var delimiter = _defaults.delimiter;
	
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
	
	  }, {
	    key: '_readBlob',
	    value: function _readBlob(callback) {
	      var file = this.file;
	      var offset = this.offset;
	      var fr = this.fr;
	
	      var nextChunk = this.offset + this.chunkSize;
	
	      // approcahing end of file
	      if (nextChunk > file.size) {
	        // adjust the final chunk size to read the remaining file contents
	        this.chunkSize = nextChunk - file.size;
	        console.debug('Last chunk of data');
	      }
	
	      // reached end of file
	      if (offset >= file.size) {
	        console.debug('End of file');
	        console.debug('Object count: ' + this.objectCount);
	        console.debug('Chunks Read: ' + this.chunksRead);
	        callback({}, 100, true);
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
	    value: function _processBlob(callback) {
	      var file = this.file;
	      var fr = this.fr;
	      var delimiter = this.delimiter;
	
	
	      var dataChunk = fr.result;
	      var lastCharIndex = this.readReverse ? dataChunk.indexOf(delimiter) + 1 : dataChunk.lastIndexOf(delimiter);
	      if (lastCharIndex === -1) {
	        console.debug('No delimiter found');
	        console.debug(dataChunk);
	        return;
	      }
	
	      // Make data chunk end at the last complete line
	      var resultString = this.readReverse ? '' + dataChunk.substring(lastCharIndex) : '' + dataChunk.substring(0, lastCharIndex);
	
	      // update the callback
	      this.progress = Math.round(this.offset / file.size * 100);
	      callback(resultString, this.progress);
	
	      // update bookkeeping values
	      this.objectCount += dataObject.length;
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
	    value: function readFile(callback) {
	      var _this = this;
	
	      console.debug('reading file');
	      this._setDefaults();
	      this.fr.onload = function () {
	        _this._processBlob(callback);
	        _this._readBlob(callback);
	      };
	      this._readBlob(callback);
	    }
	
	    /**
	     * Read the first slice of a file, calling the callback after the slice is read
	     *
	     * @param  {Function} callback The function to call after each slice is processed.
	     *                             The callback is given (data, progress)
	     */
	
	  }, {
	    key: 'readFirstBlob',
	    value: function readFirstBlob(callback) {
	      var _this2 = this;
	
	      console.debug('reading first file chunk');
	      this._setDefaults();
	      this.fr.onload = function () {
	        _this2._processBlob(callback);
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
	    value: function readLastBlob(callback) {
	      var _this3 = this;
	
	      console.debug('reading last file chunk');
	      this._setDefaults();
	      // force the seek function to only read the last file chunk
	      this.offset = this.file.size - this.chunkSize;
	      this.readReverse = true;
	      this.fr.onload = function () {
	        _this3._processBlob(callback);
	      };
	      this._readBlob();
	    }
	  }]);
	
	  return FileLineReader;
	}();
	
	exports.default = FileLineReader;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=line-blob-file-reader.js.map