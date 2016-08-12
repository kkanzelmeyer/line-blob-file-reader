import lineBlobFileReader from '../../src/line-blob-file-reader';

describe('lineBlobFileReader', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(lineBlobFileReader, 'greet');
      lineBlobFileReader.greet();
    });

    it('should have been run once', () => {
      expect(lineBlobFileReader.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(lineBlobFileReader.greet).to.have.always.returned('hello');
    });
  });
});
