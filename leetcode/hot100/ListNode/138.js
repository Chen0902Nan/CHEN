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
  let dummy = new _Node(0, head, 0)
  let cur = dummy.next
  let nHead = new _Node(head.val, head, head.random)
  let nDummy = nHead
  let count = 0
  while (cur) {
    nDummy.next = cur
    nDummy = nDummy.next
    cur = cur.next
    count++
  }
  while (count--) {}
  return nHead.next
}
