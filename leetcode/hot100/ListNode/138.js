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
  let cur = head
  let nHead = new _Node(cur.val, cur.next, cur.random)
  let dummy = new _Node(0, nHead, 0)

  while (cur) {
    nHead = nHead.next
    cur = cur.next
  }
}
