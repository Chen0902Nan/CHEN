// reduce
function reverseStr (str) {
  return [...str].reduce((reversed, cur) => cur + reversed, '')
}

console.log(reverseStr('Hello'))
