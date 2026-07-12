const fs = require('fs');
const path = require('path');

function fixDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixDir(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // If the file contains 'use client', it's a client component.
      // We must remove the force-dynamic export entirely because it's not allowed in client components.
      if (content.includes("'use client'") || content.includes('"use client"')) {
        content = content.replace("export const dynamic = 'force-dynamic';\n", "");
        // just to be safe, if there's any other spacing
        content = content.replace(/export const dynamic = ['"]force-dynamic['"];?[\r\n]*/g, "");
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixDir(path.join(__dirname, 'app'));
console.log('Fixed client components!');
