/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */

var detectCycle = function (head) {
  let fast = head
  let slow = head
  // 快慢指针判断链表是否有环
  while (fast !== null && fast.next !== null) {
    fast = fast.next.next
    slow = slow.next
    // 有环，重新定义一个指针从头结点出发，fast和index1每次都走一步，相遇点即为入口
    if (slow == fast) {
      let index1 = head
      while (index1 !== fast) {
        fast = fast.next
        index1 = index1.next
      }
      return index1
    }
  }

  return null
}
