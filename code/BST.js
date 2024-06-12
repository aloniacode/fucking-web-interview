class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  //插入，成功返回整棵树，失败返回undefined
  insert(value) {
    const node = new TreeNode(value);

    if (!this.root) {
      this.root = node;
      return this;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) {
        return undefined; // 相同节点值，插入失败
      }
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          return this;
        }
        current = current.right;
      }
    }
  }
  // 查找，如果成功则返回对应节点，否则返回false
  find(value) {
    if (!this.root) {
      return false;
    }
    let current = this.root;
    let found = false;
    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        found = true;
      }
    }
    if (!found) {
      return false;
    }
    return current;
  }
  // 删除
  remove(value) {
    const removeNode = (node, value) => {
      if (!node) {
        return null;
      }
      if (value === node.value) {
        if (!node.left && !node.right) {
          return null;
        }
        if (!node.left) {
          return node.right;
        }
        if (!node.right) {
          return node.left;
        }
        // 如果左右子树都存在，则找到右子树中序遍历的第一个子节点替换node
        let tempNode = node.right;
        while (tempNode.left) {
          tempNode = tempNode.left;
        }
        node.value = tempNode.value;
        node.right = removeNode(node.right, tempNode.value);
        return node;
      } else if (value < node.value) {
        node.left = removeNode(node.left, value);
        return node;
      } else {
        node.right = removeNode(node.right.value);
        return node;
      }
    };
    this.root = removeNode(this.node, value);
  }
}

const bst = new BST();

bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(13);
bst.insert(17);

console.log(bst.find(5));
bst.remove(15);
console.log(bst.find(15));
