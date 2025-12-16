/**
 * 使用dummy哨兵节点 + 头插法
 */
  function reverseList(head){
      //它的next 始终指向当前的反转链表的头节点
    const dummy=new ListNode(0)
    let cur=head
    while(cur){
      const next=cur.next
      // 头插法
      cur.next=dummy.next
    }
  }