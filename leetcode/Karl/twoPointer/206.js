// var removeNthFromEnd = function(head, n) {
//     // 1. 计算链表长度
//     let len = 0;
//     let cur = head;
//     while (cur) {
//         len++;
//         cur = cur.next;
//     }

//     // 2. 使用 dummy 节点统一处理
//     let dummy = new ListNode(0, head);
//     let cur1 = dummy;

//     // 3. 移动到要删除节点的前一个节点
//     // 需要走 (len - n) 步（从 dummy 开始）
//     let steps = len - n;
//     while (steps > 0) {
//         cur1 = cur1.next;
//         steps--;
//     }

//     // 4. 删除节点
//     cur1.next = cur1.next.next;

//     return dummy.next;
// };
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
  let dummy=new ListNode(0,head)
  let left=dummy
  let right=dummy
  while(n--){
    right=right.next
  }
  while(right.next){
    left=left.next
    right=right.next
  }
  left.next=left.next.next
  return dummy.next
};