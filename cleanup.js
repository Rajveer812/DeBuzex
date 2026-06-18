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

    // Fix double nesting
    const badStr = "\\${import.meta.env.VITE_BACKEND_URL || '\\${import.meta.env.VITE_BACKEND_URL || \\'http://localhost:5000\\'}'}";
    const goodStr = "\\${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}";
    
    // Using string replace with split/join to replace all occurrences literally
    content = content.split("${import.meta.env.VITE_BACKEND_URL || '${import.meta.env.VITE_BACKEND_URL || \\'http://localhost:5000\\'}'}").join("${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}");
    content = content.split("${import.meta.env.VITE_BACKEND_URL || '${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}'}").join("${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Cleaned up ${file}`);
    }
});
