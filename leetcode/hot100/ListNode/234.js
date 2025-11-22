// /**
//  * Definition for singly-linked list.
//  * function ListNode(val, next) {
//  *     this.val = (val===undefined ? 0 : val)
//  *     this.next = (next===undefined ? null : next)
//  * }
//  */
// /**
//  * @param {ListNode} head
//  * @return {boolean}
//  */
// var isPalindrome = function (head) {
//   let arr = []
//   while (head) {
//     arr.push(head.val)
//     head = head.next
//   }

//   return arr.join('') === arr.reverse().join('')
// }

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function (head) {
  let fast = head
  let slow = head
  // 快慢指针找终点
  while (fast.next && fast.next.next) {
    fast = fast.next.next
    slow = slow.next
  }
  // 翻转后半部指针
  let cur = slow.next
  let pre = null
  while (cur) {
    let t = cur.next
    cur.next = pre
    pre = cur
    cur = t
  }
  // 遍历反转后的后半部指针，比较相等
  let left = head
  let right = pre
  while (right) {
    if (left.val !== right.val) return false
    left = left.next
    right = right.next
  }
  return true
}
