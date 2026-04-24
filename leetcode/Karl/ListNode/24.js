/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var swapPairs = function (head) {
  let rhead = new ListNode(0, head)
  t = rhead
  while (t.next && t.next.next) {
    let cur = t.next.next
    let pre = t.next
    pre.next = cur.next
    cur.next = pre
    t.next = cur
    t = pre
  }
  return rhead.next
}
