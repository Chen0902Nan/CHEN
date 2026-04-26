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
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  function reverse(head) {
    let pre = null;
    let cur = head;
    while (cur) {
      let next = cur.next;
      cur.next = pre;
      pre = cur;
      cur = next;
    }
    return pre;
  }

  let head1 = head;
  let head2 = reverse(slow.next);
  while (head2) {
    if (head1.val !== head2.val) return false;
    head1 = head1.next;
    head2 = head2.next;
  }
  return true;
};
