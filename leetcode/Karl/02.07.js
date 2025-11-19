/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

// /**
//  * @param {ListNode} headA
//  * @param {ListNode} headB
//  * @return {ListNode}
//  */
// var getIntersectionNode = function (headA, headB) {
//   let aListNode = headA
//   let bListNode = headB
//   let i = 1
//   const hash = new Map()
//   // hash表存值
//   while (aListNode !== null) {
//     hash.set(i, aListNode)
//     aListNode = aListNode.next
//     i++
//   }
//   // 遍历第二个链表，找到与A链表相同的值
//   while (bListNode !== null) {
//     for (const x of hash.values()) {
//       if (bListNode == x) {
//         return bListNode
//       }
//     }
//     bListNode = bListNode.next
//   }
// }
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
  function getLen (ListNode) {
    let head = ListNode
    let len = 0
    while (head !== null) {
      head = head.next
      len++
    }
    return len
  }

  let aList = headA
  let bList = headB
  aLen = getLen(aList)
  bLen = getLen(bList)
  // 确保aList 是较长的链表
  if (aLen < bLen) {
    ;[aList, bList] = [bList, aList]
    ;[aLen, bLen] = [bLen, aLen]
  }
  // 将两个链表对齐
  let i = aLen - bLen
  while (i-- > 0) {
    aList = aList.next
  }
  while (aList && aList !== bList) {
    aList = aList.next
    bList = bList.next
  }
  return aList
}
