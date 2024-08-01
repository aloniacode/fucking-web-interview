class ListNode {
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.nodeMap = new Map();
    this.dummy = new ListNode();
    this.dummy.prev = this.dummy;
    this.dummy.next = this.dummy;
    this.capacity = capacity;
  }

  getNode(key) {
    if (!this.nodeMap.has(key)) {
      return null;
    }
    const node = this.nodeMap.get(key);
    this.remove(node);
    this.pushFront(node);
    return node;
  }

  get(key) {
    const node = this.getNode(key);
    return node ? node.value : -1;
  }

  put(key, value) {
    let node = this.getNode(key);
    if (node) {
      node.value = value;
      return;
    }
    node = new ListNode(key, value);

    this.nodeMap.set(key, node);

    this.pushFront(node); // 放在链表最前面表示最近使用

    if (this.nodeMap.size > this.capacity) {
      this.nodeMap.delete(this.dummy.prev.key); // 删除最后一个节点
      this.remove(this.dummy.prev);
    }
  }

  // 从链表中移除某个节点
  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // 将一个节点放到链表头部
  pushFront(node) {
    node.prev = this.dummy;
    node.next = this.dummy.next;
    node.prev.next = node;
    node.next.prev = node;
  }
}
