/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function (head, k) {
  let n = 0;
  let node = head;
  while (node) {
    node = node.next;
    n++;
  }
  let dummy = new ListNode(0, head);
  let p0 = dummy,
    cur = p0.next,
    pre = null,
    temp = null;
  while (n >= k) {
    let start = cur;
    for (let i = 0; i < k; i++) {
      temp = cur.next;
      cur.next = pre;
      pre = cur;
      cur = temp;
    }
    p0.next = pre;
    start.next = cur;
    p0 = start;
    n -= k;
  }
  return dummy.next;
};
