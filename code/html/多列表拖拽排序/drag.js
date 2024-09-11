const leftList = document.querySelector("#leftList");
const rightList = document.querySelector("#rightList");

const left = [...leftList.children],
  right = [...rightList.children];

let sourceNode = null;

function dragStartHandler(e) {
  setTimeout(() => {
    e.target.classList.add("moving");
  }, 0);
  sourceNode = e.target;
  e.dataTransfer.dropEffect = "move";
}

function dragEnterHandler(e, fromList, toList) {
  e.preventDefault();
  if (sourceNode === e.target || e.target === fromList) {
    return;
  }
  if (e.target === toList) {
    toList.appendChild(sourceNode);
    fromList.removeChild(sourceNode);
    return;
  }
  const children = [...e.target.parentNode.children];
  const sourceIndex = children.indexOf(sourceNode);
  const targetIndex = children.indexOf(e.target);

  if (sourceIndex < targetIndex) {
    fromList.insertBefore(sourceNode, e.target.nextElementSibling);
  } else {
    fromList.insertBefore(sourceNode, e.target);
  }
}

function dragEndHandler(e) {
  e.preventDefault();
  e.target.classList.remove("moving");
}

function dropHandler(e) {
  e.preventDefault();
  if (e.target.tagName === "LI") return;
  sourceNode.parentNode.removeChild(sourceNode);
  e.target.appendChild(sourceNode);
}

leftList.ondragstart = dragStartHandler;
rightList.ondragstart = dragStartHandler;

leftList.ondragenter = (e) => dragEnterHandler(e, leftList, rightList);
rightList.ondragenter = (e) => dragEnterHandler(e, rightList, leftList);

leftList.ondragover = (e) => e.preventDefault();
rightList.ondragover = (e) => e.preventDefault();

leftList.ondragend = dragEndHandler;
rightList.ondragend = dragEndHandler;

leftList.ondrop = dropHandler;
rightList.ondrop = dropHandler;
