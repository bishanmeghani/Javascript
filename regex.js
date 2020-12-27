let quit = 'qu';
let noquit = 'qu';
let quRegex = /q(?=u)/;
let qRegex = /q(?!u)/;

let res = quit.match(quRegex);

let res1 = noquit.match(qRegex);

console.log(res);
console.log(res1);