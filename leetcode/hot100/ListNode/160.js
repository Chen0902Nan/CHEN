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
  function getLength (head) {
    let len = 0
    while (head.next && head) {
      head = head.next
      len++
    }
    return len
  }
  let lenA = getLength(headA)
  let lenB = getLength(headB)
  if (lenA < lenB) {
    ;[headA, headB] = [headB, headA]
    ;[lenA, lenB] = [lenB, lenA]
  }
  let i = lenA - lenB
  for (i; i > 0; i--) {
    headA = headA.next
  }
  while (headA !== headB && headA.next) {
    headA = headA.next
    headB = headB.next
  }
  if (headA == headB) {
    return headA
  } else {
    return null
  }
}
