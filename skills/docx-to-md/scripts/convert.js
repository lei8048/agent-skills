const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputDir = process.argv[3] || 'output';

if (!inputFile) {
    console.error('Usage: node convert.js <input.docx> [output_dir]');
    process.exit(1);
}

console.log('Converting ' + inputFile + ' to ' + outputDir + '...');
console.log('Note: This is a template. Use python-docx for actual conversion.');
console.log('Install: pip install python-docx');
console.log('Run: python scripts/convert.py ' + inputFile + ' ' + outputDir);
