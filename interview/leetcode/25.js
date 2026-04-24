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
  function reverse(node) {
    let pre = null;
    let cur = node;
    while (cur !== null) {
      let next = cur.next;
      cur.next = pre;
      pre = cur;
      cur = next;
    }
    return pre;
  }

  const dummy = new ListNode(0);
  dummy.next = head;

  let pre = dummy;
  while (1) {
    let end = pre;
    for (let i = 0; i < k; i++) {
      end = end.next;
      // 剩下的节点不够翻转要求k个，直接结束
      if (!end) return dummy.next;
    }
    // 当前组的第一个节点，翻转后要变成尾巴
    let start = pre.next;
    let nextGroup = end.next;
    // 断开连接
    end.next = null;
    pre.next = reverse(start);
    // start已经成为了尾部 把nextGroup接上
    start.next = nextGroup;
    pre = start;
  }
};
