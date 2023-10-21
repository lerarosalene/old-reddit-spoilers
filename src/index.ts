import stylesheet from "./__generated/index.css";

const processedNodes = new WeakMap();

function isAnchor(node: Element): node is HTMLAnchorElement {
  return node.tagName === "A";
}

function processLink(node: Element) {
  if (!isAnchor(node)) {
    return;
  }

  const mountedSpoiler = processedNodes.get(node);
  if (mountedSpoiler && mountedSpoiler.parentElement === node.parentElement) {
    return;
  }

  const href = node.getAttribute('href');
  if (!href || !href.startsWith('#')) {
    return;
  }

  const spoiler = document.createElement('span');
  spoiler.classList.add('old-reddit-spoilers__spoiler');
  spoiler.classList.add('old-reddit-spoilers__spoiler_hidden');
  spoiler.appendChild(document.createTextNode(node.title));
  spoiler.addEventListener('click', () => {
    spoiler.classList.remove('old-reddit-spoilers__spoiler_hidden');
  });
  spoiler.setAttribute('title', node.textContent ?? "");
  processedNodes.set(node, spoiler);
  node.parentElement?.insertBefore(spoiler, node);
  node.style.display = "none";
}

function main() {
  const links = document.querySelectorAll('a[title]');
  links.forEach(processLink);
}

main();
setInterval(main, 200);

const style = document.createElement('style');
style.appendChild(document.createTextNode(stylesheet));
document.head.appendChild(style);
