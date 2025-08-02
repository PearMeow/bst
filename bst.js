import mergeSort from "./mergeSort.js";

class Node {
    constructor(data = null, left = null, right = null) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
}

export default class Tree {
    constructor(arr = []) {
        this.root = buildTree(sortAndRemoveDupes(arr));
    }

    insert(value) {
        let currNode = this.root;
        while (currNode !== null) {
            if (currNode.data === value) {
                break;
            } else if (currNode.data < value) {
                if (currNode.right === null) {
                    currNode.right = new Node(value);
                }
                currNode = currNode.right;
            } else {
                if (currNode.left === null) {
                    currNode.left = new Node(value);
                }
                currNode = currNode.left;
            }
        }
    }

    deleteItem(value) {
        if (this.root === null) {
            return;
        }
        let prev = null;
        let currNode = this.root;
        let right = null;
        while (currNode !== null) {
            if (currNode.data === value) {
                break;
            } else if (currNode.data < value) {
                prev = currNode;
                currNode = currNode.right;
                right = true;
            } else {
                prev = currNode;
                currNode = currNode.left;
                right = false;
            }
        }
        if (currNode === null) {
            return;
        }
        let nextNode = null;
        if (currNode.left !== null && currNode.right !== null) {
            let prevSwap = null;
            let swap = currNode.left;
            if (swap.right === null) {
                swap.right = currNode.right;
                nextNode = swap;
                if (currNode === this.root) {
                    nextNode.right = this.root.right;
                    this.root = nextNode;
                }
            } else {
                while (swap.right !== null) {
                    prevSwap = swap;
                    swap = swap.right;
                }
                prevSwap.right = swap.left;
                swap.left = currNode.left;
                swap.right = currNode.right;
                nextNode = swap;
                if (currNode === this.root) {
                    this.root = nextNode;
                }
            }
            if (currNode === this.root) {
                this.root = nextNode;
            }
        } else if (currNode.left !== null) {
            nextNode = currNode.left;
            if (currNode === this.root) {
                this.root = nextNode;
            }
        } else if (currNode.right !== null) {
            nextNode = currNode.right;
            if (currNode === this.root) {
                this.root = nextNode;
            }
        } else {
            if (currNode === this.root) {
                this.root = null;
            }
        }
        if (right === true) {
            prev.right = nextNode;
        } else if (right === false) {
            prev.left = nextNode;
        }
    }

    find(value) {
        let currNode = this.root;
        while (currNode !== null) {
            if (currNode.data === value) {
                break;
            } else if (currNode.data < value) {
                currNode = currNode.right;
            } else {
                currNode = currNode.left;
            }
        }
        return currNode;
    }

    levelOrderForEach(callback) {
        if (callback === undefined) {
            throw Error("Callback is required");
        }
        let queue = [];
        queue.push(this.root);
        while (queue.length > 0) {
            let curr = queue.pop();
            if (curr !== null) {
                callback(curr);
                queue.push(curr.left);
                queue.push(curr.right);
            }
        }
    }

    inOrderForEach(callback, node = this.root) {
        if (callback === undefined) {
            throw Error("Callback is required");
        }
        if (node === null) {
            return;
        }
        this.inOrderForEach(callback, node.left);
        callback(node);
        this.inOrderForEach(callback, node.right);
    }

    preOrderForEach(callback, node = this.root) {
        if (callback === undefined) {
            throw Error("Callback is required");
        }
        if (node === null) {
            return;
        }
        callback(node);
        this.preOrderForEach(callback, node.left);
        this.preOrderForEach(callback, node.right);
    }

    postOrderForEach(callback, node = this.root) {
        if (callback === undefined) {
            throw Error("Callback is required");
        }
        if (node === null) {
            return;
        }
        this.postOrderForEach(callback, node.left);
        this.postOrderForEach(callback, node.right);
        callback(node);
    }

    height(value) {
        let node = this.find(value);
        if (node === null) {
            return null;
        }
        return (
            (function dfs(node) {
                if (node === null) {
                    return 0;
                }
                let height = 1;
                let left = dfs(node.left);
                let right = dfs(node.right);
                return height + left > right ? left : right;
            })(node) - 1
        );
    }

    depth(value) {
        let currNode = this.root;
        let res = 0;
        while (currNode !== null) {
            if (currNode.data === value) {
                break;
            } else if (currNode.data < value) {
                currNode = currNode.right;
            } else {
                currNode = currNode.left;
            }
            ++res;
        }
        if (currNode === null) {
            return null;
        }
        return res;
    }

    isBalanced() {
        function helper(node) {
            // return [isBalanced, height]
            if (node === null) {
                return [true, 0];
            }
            let left = helper(node.left);
            let right = helper(node.right);
            let theHeight = left[1];
            if (right[1] > left[1]) {
                theHeight = right[1];
            }
            let balance = left[0] === true && right[0] === true;
            if (Math.abs(right[1] - left[1]) > 1) {
                balance = false;
            }
            return [balance, theHeight + 1];
        }
        return helper(this.root)[0];
    }

    rebalance() {
        let newArr = [];
        this.levelOrderForEach((node) => {
            newArr.push(node.data);
        });
        this.root = buildTree(newArr);
    }

    log() {
        prettyPrint(this.root);
    }
}

function sortAndRemoveDupes(arr) {
    let sorted = mergeSort(arr);
    let sortedUniques = [];
    for (let i = 0; i < sorted.length; ++i) {
        if (sortedUniques.length === 0) {
            sortedUniques.push(sorted[i]);
        } else if (sortedUniques[sortedUniques.length - 1] !== sorted[i]) {
            sortedUniques.push(sorted[i]);
        }
    }
    return sortedUniques;
}

function buildTree(arr) {
    if (arr.length === 0) {
        return null;
    } else if (arr.length === 1) {
        return new Node(arr[0]);
    }
    let firstHalf = arr.slice(0, Math.floor(arr.length / 2));
    let mid = arr[Math.floor(arr.length / 2)];
    let secondHalf = arr.slice(Math.floor(arr.length / 2) + 1, arr.length);
    return new Node(mid, buildTree(firstHalf), buildTree(secondHalf));
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};
