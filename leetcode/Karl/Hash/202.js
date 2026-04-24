/**
 * @param {number} n
 * @return {boolean}
 */
// var isHappy = function (n) {
//   let map = new Map()
//   const getSum = function (n) {
//     let sum = 0
//     while (n) {
//       sum = sum + (n % 10) ** 2
//       n = Math.floor(n / 10)
//     }
//     return sum
//   }
//   while (true) {
//     if (map.has(n)) return false
//     if (n === 1) return true
//     map.set(n, 1)
//     n = getSum(n)
//   }
// }

let getNext = function (n) {
  return n
    .toString()
    .split('')
    .map(i => i ** 2)
    .reduce((a, b) => a + b)
}
let isHappy = function (n) {
  let slow = n
  let fast = getNext(n)
  while (fast !== 1 && fast !== slow) {
    slow = getNext(slow)
    fast = getNext(getNext(fast))
  }
  return fast === 1
}
