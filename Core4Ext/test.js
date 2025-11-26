const ClassDetector = require('./out/classDetector.js').ClassDetector;

const detector = new ClassDetector();
const testHTML = `
<div class="px-1 py-2 m-3 mx-4">
  <p class="fs-lg">Test</p>
</div>
`;

const classes = detector.detectClasses(testHTML);
console.log('Detected classes:', Array.from(classes));
console.log('Has px-1?', classes.has('px-1'));
console.log('Has py-2?', classes.has('py-2'));
