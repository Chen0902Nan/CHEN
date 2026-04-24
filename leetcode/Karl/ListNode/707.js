function ListNode (val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

var MyLinkedList = function () {
  this.head = new ListNode(0)
  this.size = 0
}

/**
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function (index) {
  if (index < 0 || index >= this.size) {
    return -1
  } else {
    let cur = this.head
    for (let i = 0; i < index; i++) {
      cur = cur.next
    }
    return cur.next.val
  }
}

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function (val) {
  const newHead = new ListNode(val, this.head.next)
  this.size++
  this.head.next = newHead
}

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function (val) {
  let cur = this.head
  while (cur.next) {
    cur = cur.next
  }
  cur.next = new ListNode(val)
  this.size++
}

/**
 * @param {number} index
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function (index, val) {
  if (index <= this.size) {
    let cur = this.head
    for (let i = 0; i < index; i++) {
      cur = cur.next
    }
    cur.next = new ListNode(val, cur.next)
    this.size++
  } else {
    return
  }
}

/**
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function (index) {
  if (index >= 0 && index < this.size) {
    let cur = this.head
    for (let i = 0; i < index; i++) {
      cur = cur.next
    }
    cur.next = cur.next.next
    this.size--
  }
}

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * var obj = new MyLinkedList()
 * var param_1 = obj.get(index)
 * obj.addAtHead(val)
 * obj.addAtTail(val)
 * obj.addAtIndex(index,val)
 * obj.deleteAtIndex(index)
 */
