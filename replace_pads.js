const fs = require('fs');
const path = require('path');

const dirsToCheck = ['src', 'backend', 'electron', 'app', 'admin-dashboard'];

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        let newContent = content
            .replace(/Nappee Pads/gi, 'Nappee Diapers')
            .replace(/nappee pads/gi, 'nappee diapers')
            .replace(/menstrual care/gi, 'baby care')
            .replace(/sanitary pad packs/gi, 'diaper packs')
            .replace(/sanitary pad/gi, 'diaper')
            .replace(/sanitary pads/gi, 'diapers')
            .replace(/cotton sanitary pads/gi, 'cotton diapers')
            .replace(/\bpads\b/gi, 'diapers')
            .replace(/\bpad\b/gi, 'diaper');
        
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf-8');
            console.log(`Updated ${filePath}`);
        }
    } catch (e) {
        console.error(`Could not process ${filePath}: ${e.message}`);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== '.expo') {
                walkDir(fullPath);
            }
        } else {
            if (file.match(/\.(tsx|jsx|ts|js|json|md)$/i) && file !== 'package-lock.json') {
                replaceInFile(fullPath);
            }
        }
    }
}

dirsToCheck.forEach(walkDir);
replaceInFile('package.json');
replaceInFile('app.json');

console.log("Done replacing pads with diapers");
