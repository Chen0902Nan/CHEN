function reverseStr (str) {
  let reversed = ''
  for (const x of str) {
    reversed = x + reversed
  }
  return reversed
}
console.log(reverseStr('Hello'))
