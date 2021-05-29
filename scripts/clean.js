const {
  existsSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync
 } = require('fs');

/**
 * @namespace Cleaner
 * @description - Cleans project by removing the following files and folders:
 * docs, node_modules, yarn.lock, and package-lock.json.
 */
class Cleaner {

  removePath = (pathToRemove) => {
    if (existsSync(pathToRemove)) {
      console.log(`Removing: ${pathToRemove}`);
      if (statSync(pathToRemove).isFile()) unlinkSync(pathToRemove);

      else {
        const files = readdirSync(pathToRemove);

        files.forEach((file) => {
          const filePath = `${pathToRemove}/${file}`;

          if (statSync(filePath).isDirectory()) this.removePath(filePath);
          else unlinkSync(filePath);
        });
        rmdirSync(pathToRemove);
      }
    }
  };
}

module.exports.Cleaner = Cleaner;