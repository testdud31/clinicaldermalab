import fs from 'fs';
const content = fs.readFileSync('docs/index.html', 'utf8');
console.log(content.slice(0, 300));
