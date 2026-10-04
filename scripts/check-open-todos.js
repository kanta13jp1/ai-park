const fs = require('fs');
const content = fs.readFileSync('src/app/feedback-todo/page.tsx', 'utf8');
const items = [];
const blocks = content.split('  {');
for (const b of blocks) {
  const idMatch = b.match(/id:\s*"([^"]+)"/);
  const statusMatch = b.match(/status:\s*"([^"]+)"/);
  const titleMatch = b.match(/title:\s*"([^"]+)"/);
  if (idMatch && statusMatch && statusMatch[1] !== 'done') {
    items.push({ id: idMatch[1], status: statusMatch[1], title: titleMatch ? titleMatch[1] : '' });
  }
}
console.log('Open items:', items);
