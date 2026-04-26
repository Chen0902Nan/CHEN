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
  const dummy = new ListNode(0, null);
  let cur = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    let sum = carry;
    if (l1) {
      sum += l1.val;
      l1 = l1.next;
    }
    if (l2) {
      sum += l2.val;
      l2 = l2.next;
    }
    cur.next = new ListNode(sum % 10, null);
    cur = cur.next;
    carry = Math.floor(sum / 10);
  }
  return dummy.next;
};
var addTwoNumbers = function (l1, l2, carry = 0) {
  if (!l1 && !l2 && carry === 0) {
    return null;
  }
  let sum = carry;
  if (l1) {
    sum += l1.val;
    l1 = l1.next;
  }
  if (l2) {
    sum += l2.val;
    l2 = l2.next;
  }
  carry = Math.floor(sum / 10);
  return new ListNode(sum % 10, addTwoNumbers(l1, l2, carry));
};
