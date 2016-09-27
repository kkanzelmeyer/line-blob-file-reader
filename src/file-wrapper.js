import fs from 'fs';
import util from 'util';

class FileWrapper {
  /**
   *
   * @param [String, Object]  file  A file path to the file or an HTML5 File reference
   */
  constructor(file) {
    // check if the input file is a path
    if (typeof file === 'string' || file instanceof String) {
      this.mode = 'server';
      this.fd = fs.openSync(file, 'r');
      this.size = util.inspect(fs.statSync(file)).size;
    } else {
      this.mode = 'client';
      this.file = file;
      this.size = file.size;
    }
  }

  slice(position, length) {
    if (this.mode === 'server') {
      const buffer = '';
      fs.readSync(this.fd, buffer, 0, length, position);
      return buffer;
    }
    return this.file.slice(position, length);
  }

  getSize() {
    return this.size;
  }

}

export default FileWrapper;
