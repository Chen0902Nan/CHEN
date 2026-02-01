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

var middleNode = function (head) {
  let slow = head,
    pre = head,
    fast = head;
  while (fast && fast.next) {
    pre = slow;
    slow = slow.next;
    fast = fast.next.next;
  }
  // 断开前面链接
  pre.next = null;
  return slow;
};

var mergeTwoLists = function (list1, list2) {
  let dummy = new ListNode();
  let cur = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }
  cur.next = list1 ? list1 : list2;
  return dummy.next;
};

var sortList = function (head) {
  if (head === null || head.next === null) {
    return head;
  }
  let head2 = middleNode(head);
  // 分治
  head = sortList(head);
  head2 = sortList(head2);
  // 合并
  return mergeTwoLists(head, head2);
};
