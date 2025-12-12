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

var  getLen= function(head){
  let cur=head
  let len=1
  while(cur.next){
    cur=cur.next
    len++
  }
  return len
}
var getIntersectionNode = function(headA, headB) {
    let lenA=getLen(headA)
    let lenB=getLen(headB)
        if(lenA<lenB){
          [lenA,lenB]=[lenB,lenA]
          ;[headA,headB]=[headB,headA]
        }
    const x=lenA-lenB
    let curA=headA
    for(let i=0;i<x;i++){
      curA=curA.next
    }
    let curB=headB
    while(curA&&curB){
      if(curA==curB) return curA
      curA=curA.next
      curB=curB.next
    }
return null
};
