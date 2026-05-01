import fs from 'fs';
import path from 'path';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('dist')) {
        replaceInDir(fullPath);
      }
    } else {
      if (['.ts', '.tsx', '.json', '.html'].includes(path.extname(fullPath))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('CareCompana')) {
          fs.writeFileSync(fullPath, content.replace(/CareCompana/g, 'CompanaConnect'), 'utf8');
        }
      }
    }
  }
}
replaceInDir('.');
