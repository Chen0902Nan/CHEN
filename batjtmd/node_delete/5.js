/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
    let dummy = new ListNode(0, head)
    let left = dummy
    let right = dummy
    // 核心思想是保持一个n的间隔，尾指针到达后，前指针就是目标节点的前一个
    while (n--) {
        right = right.next
    }
    while (right.next) {
        left = left.next
        right = right.next
    }
    left.next = left.next.next
    return dummy.next
};