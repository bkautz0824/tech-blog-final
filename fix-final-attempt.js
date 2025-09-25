#!/usr/bin/env node

const fs = require('fs');

// Read the backup file
let content = fs.readFileSync('lib/articles-data.ts', 'utf8');

// The most minimal fix - only escape backticks in code fences
// Since all the other attempts failed, let's try escaping ONLY the backticks
// and nothing else to see if that's the only real issue
content = content.replace(/```/g, '\\`\\`\\`');

// Write the result
fs.writeFileSync('lib/articles-data.ts', content);

console.log('Final minimal fix applied!');