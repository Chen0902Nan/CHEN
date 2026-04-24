function remove(head,val){
  // 如果要删除的节点是头结点 ，对头结点进行特殊处理
  // 能不能单独返回？ 头结点没有前驱 尾结点没有后继节点
  // 给他一个虚拟头结点 dummy 哨兵节点
  if(head&&head.val===val){
    return head.next
  }
  let cur=head
  // 节点的遍历
  while(cur.next){
    if(cur.next.val===val){
      cur.next=cur.next.next
      break
    }
    cur=cur.next
  }
  return head
}