const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

// Mapping dark glassmorphism classes to clean white/enterprise AHA classes
const replacements = [
  // Heavy Backgrounds
  { regex: /bg-slate-950/g, replacement: 'bg-white' },
  { regex: /bg-slate-900\/50/g, replacement: 'bg-slate-50' },
  { regex: /bg-slate-900\/40/g, replacement: 'bg-white' },
  { regex: /bg-slate-900\/80/g, replacement: 'bg-white' },
  { regex: /bg-slate-900/g, replacement: 'bg-white' },
  { regex: /bg-slate-800\/50/g, replacement: 'bg-slate-100' },
  { regex: /bg-slate-800/g, replacement: 'bg-slate-100' },
  { regex: /bg-slate-700/g, replacement: 'bg-slate-200' },
  
  // Text Colors
  { regex: /text-white/g, replacement: 'text-slate-900' },
  { regex: /text-slate-400/g, replacement: 'text-slate-600' },
  { regex: /text-slate-300/g, replacement: 'text-slate-700' },
  { regex: /text-slate-500/g, replacement: 'text-slate-500' },
  
  // Border Colors
  { regex: /border-slate-800\/50/g, replacement: 'border-slate-200' },
  { regex: /border-slate-800\/80/g, replacement: 'border-slate-200' },
  { regex: /border-slate-800/g, replacement: 'border-slate-200' },
  { regex: /border-slate-700/g, replacement: 'border-slate-300' },
  { regex: /border-slate-600/g, replacement: 'border-slate-300' },
  
  // Glassmorphism removal (Enterprise looks solid)
  { regex: /backdrop-blur-md/g, replacement: 'shadow-lg' },
  { regex: /backdrop-blur-sm/g, replacement: 'shadow-sm' },
  { regex: /backdrop-blur-lg/g, replacement: 'shadow-xl' },
  { regex: /backdrop-blur-3xl/g, replacement: 'shadow-2xl' },
  
  // Custom specific swaps
  { regex: /text-brand-400/g, replacement: 'text-brand-600' },
  { regex: /text-accent-400/g, replacement: 'text-accent-600' },
  { regex: /bg-brand-500\/10/g, replacement: 'bg-brand-50' },
  { regex: /bg-accent-500\/10/g, replacement: 'bg-accent-50' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  let changedFilesCount = 0;

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      changedFilesCount += processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
        changedFilesCount++;
      }
    }
  }

  return changedFilesCount;
}

console.log("Starting AHA Red & White Theme Conversion...");
let totalChanges = 0;
for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    totalChanges += processDirectory(dir);
  }
}
console.log(`\nConversion complete. Interacted with ${totalChanges} files.`);
