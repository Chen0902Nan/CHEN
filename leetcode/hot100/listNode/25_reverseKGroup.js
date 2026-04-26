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
  // 辅助反转函数
  function reverse(node) {
    let pre = null;
    let cur = node;
    while (cur) {
      let t = cur.next;
      cur.next = pre;
      pre = cur;
      cur = t;
    }
    return pre;
  }
  let dummy = new ListNode(0, head);
  let pre = dummy;
  while (1) {
    let cur = pre;
    for (let i = 0; i < k; i++) {
      cur = cur.next;
      if (!cur) return dummy.next;
    }
    let start = pre.next;
    let nextNode = cur.next;
    cur.next = null;
    pre.next = reverse(start);
    start.next = nextNode;
    cur = nextNode;
    pre = start;
  }
};
