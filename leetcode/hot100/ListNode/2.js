/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let dummy = new ListNode(0)
  let cur = dummy
  let carry = 0
  while (l1 || l2 || carry) {
    const val1 = l1 ? l1.val : 0
    const val2 = l2 ? l2.val : 0
    sum = val1 + val2 + carry
    // 处理进位
    carry = Math.floor(sum / 10)
    // cur.next指向新的节点
    cur.next = new ListNode(sum % 10)
    // 移动指针
    cur = cur.next
    if (l1) l1 = l1.next
    if (l2) l2 = l2.next
  }
  return dummy.next
}
