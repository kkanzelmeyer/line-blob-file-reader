'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileWrapper = function () {
  /**
   *
   * @param [String, Object]  file  A file path to the file or an HTML5 File reference
   */
  function FileWrapper(file) {
    _classCallCheck(this, FileWrapper);

    // check if the input file is a path
    if (typeof file === 'string' || file instanceof String) {
      this.mode = 'server';
      this.fd = _fs2.default.openSync(file);
      this.file.size = _util2.default.inspect(_fs2.default.statSync(file)).size;
    } else {
      this.mode = 'client';
      this.file = file;
      this.file.size = file.size;
    }
  }

  _createClass(FileWrapper, [{
    key: 'slice',
    value: function slice(position, length) {
      if (this.mode === 'server') {
        var buffer = '';
        _fs2.default.readSync(this.fd, buffer, 0, length, position);
        return buffer;
      }
      return this.file.slice(position, length);
    }
  }, {
    key: 'size',
    value: function size() {
      return this.file.size;
    }
  }]);

  return FileWrapper;
}();

exports.default = FileWrapper;