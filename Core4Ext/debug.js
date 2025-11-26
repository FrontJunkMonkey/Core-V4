const fs = require('fs');
const path = require('path');
const { ClassDetector } = require('./out/classDetector.js');

const detector = new ClassDetector();
const htmlFile = '../components-demo.html';
const content = fs.readFileSync(htmlFile, 'utf8');

console.log('Scanning:', htmlFile);
console.log('File contains "px-1"?', content.includes('px-1'));
console.log('File contains "py-2"?', content.includes('py-2'));
console.log('File contains class="fs-lg px-1 py-2"?', content.includes('class="fs-lg px-1 py-2"'));

const classes = detector.detectClasses(content);
console.log('\nTotal classes found:', classes.size);
console.log('Has px-1?', classes.has('px-1'));
console.log('Has py-2?', classes.has('py-2'));

const pClasses = Array.from(classes).filter(c => c.startsWith('p'));
console.log('\nAll p* classes:');
console.log(pClasses.join(', '));
