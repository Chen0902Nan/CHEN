/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
  const dummy = new ListNode(0, null);
  let head = dummy;
  while (list1 && list2) {
    if (list1.val < list2.val) {
      head.next = new ListNode(list1.val, null);
      head = head.next;
      list1 = list1.next;
    } else {
      head.next = new ListNode(list2.val, null);
      head = head.next;
      list2 = list2.next;
    }
  }

  if (list1) {
    head.next = list1;
  } else {
    head.next = list2;
  }

  return dummy.next;
};
