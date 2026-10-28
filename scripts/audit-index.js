import fs from 'fs';
import path from 'path';

const indexPath = path.join(process.cwd(), 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

console.log('Total Lines:', content.split('\n').length);
console.log('Total Length:', content.length);

// Check JSON-LD
const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
if (jsonLdMatch) {
  console.log('JSON-LD found');
}

// Check Cards
const cards = content.match(/class="spotlight-card[^"]*"/g) || [];
console.log('Spotlight cards count:', cards.length);

// Check modal
console.log('Has credentials modal:', content.includes('credentials-modal'));
