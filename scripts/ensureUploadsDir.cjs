const fs = require('fs');
const path = require('path');

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
const dbPath = path.join(process.cwd(), 'db.json');

fs.mkdirSync(uploadDir, { recursive: true });

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ items: [] }, null, 2));
}

console.log('Prepared', uploadDir, 'and', dbPath);
