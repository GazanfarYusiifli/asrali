const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/app');

function processFile(filePath) {
  if (filePath.includes('AuthContext.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Track if we need to add the import
  let needsImport = false;

  if (content.includes('localStorage.getItem')) {
    content = content.replace(/localStorage\.getItem/g, 'getAppStorage');
    needsImport = true;
  }
  if (content.includes('localStorage.setItem')) {
    content = content.replace(/localStorage\.setItem/g, 'setAppStorage');
    needsImport = true;
  }
  if (content.includes('localStorage.removeItem')) {
    content = content.replace(/localStorage\.removeItem/g, 'removeAppStorage');
    needsImport = true;
  }

  // Also catch window.localStorage
  if (content.includes('window.localStorage.getItem')) {
    content = content.replace(/window\.localStorage\.getItem/g, 'getAppStorage');
    needsImport = true;
  }
  if (content.includes('window.localStorage.setItem')) {
    content = content.replace(/window\.localStorage\.setItem/g, 'setAppStorage');
    needsImport = true;
  }

  if (needsImport) {
    if (!content.includes("from '@/utils/storage'")) {
      // Find the last import statement
      const importRegex = /^import\s+.*?;?\s*$/gm;
      let match;
      let lastImportIndex = 0;
      while ((match = importRegex.exec(content)) !== null) {
        lastImportIndex = match.index + match[0].length;
      }

      const importStatement = "\nimport { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';\n";
      
      if (lastImportIndex > 0) {
        content = content.slice(0, lastImportIndex) + importStatement + content.slice(lastImportIndex);
      } else {
        // If there are 'use client' directives at the top, insert after them
        const useClientMatch = content.match(/^('use client'|"use client");?\s*/);
        if (useClientMatch) {
            content = content.slice(0, useClientMatch[0].length) + importStatement + content.slice(useClientMatch[0].length);
        } else {
            content = importStatement + content;
        }
      }
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

walkDir(srcDir);
console.log('Done!');
