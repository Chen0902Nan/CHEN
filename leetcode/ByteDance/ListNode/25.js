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
    // 将 dummy或上一组的尾部指向翻转完成后的头部
    p0.next = pre;
    // 连接剩余节点
    start.next = cur;
    p0 = start;
    n -= k;
  }
  return dummy.next;
};
