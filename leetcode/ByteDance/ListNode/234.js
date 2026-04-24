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

var middleNode = function (head) {
  let fast = head,
    slow = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
};

var reverseList = function (head) {
  let pre = null,
    cur = head;
  while (cur !== null) {
    const t = cur.next;
    cur.next = pre;
    pre = cur;
    cur = t;
  }
  return pre;
};
var isPalindrome = function (head) {
  let mid = middleNode(head);
  let head2 = reverseList(mid);
  while (head2 !== null) {
    if (head2.val !== head.val) {
      return false;
    }
    head = head.next;
    head2 = head2.next;
  }
  return true;
};
