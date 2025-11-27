// /**
//  * // Definition for a _Node.
//  * function _Node(val, next, random) {
//  *    this.val = val;
//  *    this.next = next;
//  *    this.random = random;
//  * };
//  */

// /**
//  * @param {_Node} head
//  * @return {_Node}
//  */
// var copyRandomList = function (head) {
//   if (head == null) {
//     return null
//   }
//   // 交错创建节点 A -> A' -> B -> B' -> C -> C'
//   for (let cur = head; cur; cur = cur.next.next) {
//     cur.next = new Node(cur.val, cur.next, null)
//   }
//   // 处理 新创节点的random
//   for (let cur = head; cur; cur = cur.next.next) {
//     if (cur.random) {
//       cur.next.random = cur.random.next
//     }
//   }
//   // 将两个链表分开，不改变原链表指向
//   const nhead = head.next
//   let cur = head
//   for (; cur.next.next; cur = cur.next) {
//     const copy = cur.next
//     cur.next = copy.next
//     copy.next = copy.next.next
//   }
//   // 原链表最后指向空
//   cur.next = null
//   return nhead
// }

/**
 * // Definition for a _Node.
 * function _Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {_Node} head
 * @return {_Node}
 */
var copyRandomList = function (head) {
  if (!head) {
    return null
  }
  let map = new Map()
  // 第一遍遍历 ，map 存下映射
  for (let cur = head; cur; cur = cur.next) {
    map.set(cur, new Node(cur.val, null, null))
  }
  // 第二遍遍历 取出next和random
  for (let cur = head; cur; cur = cur.next) {
    const nhead = map.get(cur)
    if (cur.next) {
      nhead.next = map.get(cur.next)
    }
    if (cur.random) {
      nhead.random = map.get(cur.random)
    }
  }
  return map.get(head)
}
