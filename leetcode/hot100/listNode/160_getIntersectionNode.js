/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  function listLen(head) {
    let cur = head;
    let len = 1;
    while (cur) {
      cur = cur.next;
      len++;
    }
    return len;
  }

  let lenA = listLen(headA);
  let lenB = listLen(headB);
  let nodeA = headA;
  let nodeB = headB;
  if (lenA > lenB) {
    for (let i = 0; i < lenA - lenB; i++) {
      nodeA = nodeA.next;
    }
  } else {
    for (let i = 0; i < lenB - lenA; i++) {
      nodeB = nodeB.next;
    }
  }
  while (nodeA) {
    if (nodeA == nodeB) return nodeA;
    nodeA = nodeA.next;
    nodeB = nodeB.next;
  }
  return null;
};
var getIntersectionNode = function (headA, headB) {
  let p = headA;
  let q = headB;
  while (q !== p) {
    q = q ? q.next : headA;
    p = p ? p.next : headB;
  }
  return p;
};
