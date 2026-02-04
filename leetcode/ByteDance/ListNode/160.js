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

// const getLength = function (head) {
//   let len = 0;
//   while (head) {
//     head = head.next;
//     len++;
//   }
//   return len;
// };
// var getIntersectionNode = function (headA, headB) {
//   let lenA = getLength(headA);
//   let lenB = getLength(headB);

//   if (lenA >= lenB) {
//     let step = lenA - lenB;
//     while (step--) {
//       headA = headA.next;
//     }
//     while (headA && headB) {
//       if (headA == headB) return headA;
//       headA = headA.next;
//       headB = headB.next;
//     }
//   } else {
//     let step = lenB - lenA;
//     while (step--) {
//       headB = headB.next;
//     }
//     while (headB && headA) {
//       if (headA == headB) return headB;
//       headB = headB.next;
//       headA = headA.next;
//     }
//   }
//   return headA;
// };
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

var getIntersectionNode = function (headA, headB) {
  let p = headA,
    q = headB;
  // (x+z)+y=(y+z)+x
  while (q !== p) {
    p = p ? p.next : headB;
    q = q ? q.next : headA;
  }
  return p;
};
