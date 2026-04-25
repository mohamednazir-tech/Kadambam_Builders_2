import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the built index.html
const indexPath = path.join(__dirname, '../dist/index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Create 404.html with redirect script
const redirectScript = `
    <script>
      sessionStorage.setItem("redirect", location.pathname);
      location.replace("/");
    </script>`;

// Insert the redirect script after the head tag
const fortyFourContent = indexContent.replace(
  '<head>',
  '<head>' + redirectScript
);

// Write 404.html
const fortyFourPath = path.join(__dirname, '../dist/404.html');
fs.writeFileSync(fortyFourPath, fortyFourContent);

console.log('✅ Created dist/404.html with redirect script');
