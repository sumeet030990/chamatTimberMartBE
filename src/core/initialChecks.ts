import fs from 'fs';

/**
 * Check if essential directories are present
 * for eg: public, uploads, signage:  where files are uploaded
 */
const checkForUploadDirectories = () => {
  // check for public folder(all the uploads are kept in public)
  fs.access('./public', error => {
    if (error) {
      fs.mkdirSync('./public');
    }
  });

  // check for public/uploads folder(all the product images are kept here)
  fs.access('./public/uploads', error => {
    if (error) {
      fs.mkdirSync('./public/uploads');
    }
  });

  // check for public/signage folder(all the signages are kept here)
  fs.access('./public/signage', error => {
    if (error) {
      fs.mkdirSync('./public/signage');
    }
  });
};
// check for necessary information which are required to run app
const initialChecks = () => {
  checkForUploadDirectories(); //  check for important directories are available or not
};

export default initialChecks;
