import multer = require('multer');
import { uuid } from './utils';

const getFileExtension = (file) => {
  return file.originalname.split('.').pop();
}

const getStorage = (path:string) => {
  return multer.diskStorage({
    destination: `public/uploads/${path}`,
    filename: (req, file, cb) => {
      cb(null, uuid() + '.' + getFileExtension(file));
    }
  });
}

const getUploader = (path:string) => {
  return multer({storage: getStorage(path)});
}

export default getUploader;
