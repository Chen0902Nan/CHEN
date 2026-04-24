/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */

let mergeTwoLists = function (list1, list2) {
  const dummy = new ListNode();
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

var mergeKLists = function (lists) {
  const k = lists.length;
  if (k === 0) return null;
  // 大合并跨度是翻倍的
  for (let step = 1; step < k; step *= 2) {
    // i<k-step 不越界， i  i+step
    for (let i = 0; i < k - step; i += step * 2) {
      lists[i] = mergeTwoLists(lists[i], lists[i + step]);
    }
  }
  return lists[0];
};
