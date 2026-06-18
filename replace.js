const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('d:/Projects-raw/DEBuzzer/Frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace single/double quoted strings
    content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, "`\\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}$1`");

    // Replace within backticks
    let parts = content.split('`');
    // parts[1], parts[3], parts[5] etc are inside backticks
    for (let i = 1; i < parts.length; i += 2) {
        parts[i] = parts[i].replace(/http:\/\/localhost:5000/g, "\\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}");
    }
    content = parts.join('`');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
