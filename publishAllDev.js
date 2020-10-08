const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


const folderNames = fs.readdirSync('./');

const run = async () => {
  for (const folderName of folderNames) {
    const isDir = fs.statSync(folderName).isDirectory();
    const notTemplateFolders = ['.git', '.github', 'scripts'];
  
    // is template dir
    if (isDir && !notTemplateFolders.includes(folderName)) {
      console.log('start publishing', folderName);
      const { stdout, stderr } = await exec(`dir=${folderName} npm run publishDev`);
      if (stderr) console.error('stderr:', stderr);
      console.log(folderName, 'published');
    }
  }
}

run();
