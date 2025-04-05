class ListNode {
  constructor(key = 0, value = 0) {
    this.key = key; // 用于哈希表快速查找
    this.value = value;
    this.prev = null; // 前驱节点
    this.next = null; // 后继节点
  }
}

class LRUCache {
  constructor(capacity) {
    this.map = new Map(); // 哈希表，用于快速查找节点
    this.capacity = capacity; // 缓存容量
    this.head = new ListNode(); // 虚拟头节点
    this.tail = new ListNode(); // 虚拟尾节点
    // 初始化链表
    this.head.next = this.tail;
    this.tail.prev = this.head;
    
  }

  // 获取缓存值,访问后将节点移到链表头部
  get(key) {
    if(!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._moveToHead(node);
    return node.value;
  }
  // 设置缓存值,如果缓存已满,则淘汰最久未使用节点
  put(key, value) {
    if(this.map.has(key)){
      const node = this.map.get(key);
      node.value = value; // 更新节点值
      this._moveToHead(node); // 移动节点到头部
    }else {
      // 判断缓存是否已满
      if(this.map.size === this.capacity){
        this._removeTail(); // 缓存已满,淘汰最久未使用节点
      }
      const node = new ListNode(key, value); // 创建新节点
      this.map.set(key, node); // 加入哈希表
      this._addToHead(node); // 加入链表头部
    }

  }
  // 私有方法，将节点移动到链表头部
  _moveToHead(node) {
    this._removeNode(node);
    this._addToHead(node);
  }
  // 私有方法，将节点从链表中移除
  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  // 私有方法，将节点加入链表头部
  _addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }
  // 私有方法，移除链表尾部节点，淘汰最久未使用
  _removeTail(){
    const node = this.tail.prev;
    this._removeNode(node);
    this.map.delete(node.key);
  }
}


// 仅依赖Map实现的LRU,但是Map不严格保证顺序,所以不能保证LRU缓存的正确性
class SimpleLRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}

const lru = new LRUCache(2)

lru.put(1,1)
lru.put(2,2)
console.log(lru.get(1)); // 返回1，2变成最久未使用
lru.put(3,3) // 缓存容量为2，所以2被淘汰
console.log(lru.get(2)); // 返回-1（2已被淘汰）