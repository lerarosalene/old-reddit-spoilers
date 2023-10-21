import isNil from "lodash/isNil";
import stylesheet from "@generated/index.css";

const BATCH_SIZE = 20;
const BATCH_DELAY = 100;
const TICK_DELAY = 200;

const processedNodes = new WeakMap<Element, Element>();

function isAnchor(node: Element): node is HTMLAnchorElement {
  return node.tagName === "A";
}

interface Spoiler {
  node: HTMLAnchorElement;
  description: string;
  content: string;
}

function parseSpoilerLink(node: Element): Spoiler | null {
  if (!isAnchor(node)) {
    return null;
  }

  const href = node.getAttribute("href");
  const title = node.getAttribute("title");

  if (!href || !href.startsWith("#")) {
    return null;
  }

  if (!isNil(title)) {
    return {
      node,
      description: node.textContent ?? "",
      content: node.title,
    };
  }

  const secondPartMatch = href.match(/^\S*\s+(.*)$/);
  if (isNil(secondPartMatch)) {
    return null;
  }

  const unquotedMatch = secondPartMatch[1].match(/^"(.*)"$/);
  const content = isNil(unquotedMatch) ? secondPartMatch[1] : unquotedMatch[1];

  return {
    node,
    content,
    description: node.textContent ?? "",
  };
}

function processSpoiler(spoiler: Spoiler) {
  const spoilerNode = document.createElement("span");
  spoilerNode.classList.add("old-reddit-spoilers__spoiler");
  spoilerNode.classList.add("old-reddit-spoilers__spoiler_hidden");
  spoilerNode.appendChild(document.createTextNode(spoiler.content));
  spoilerNode.addEventListener("click", () => {
    spoilerNode.classList.remove("old-reddit-spoilers__spoiler_hidden");
  });
  spoilerNode.setAttribute("title", spoiler.description);
  processedNodes.set(spoiler.node, spoilerNode);
  spoiler.node.parentElement?.insertBefore(spoilerNode, spoiler.node);
  spoiler.node.style.display = "none";
}

function batch<T>(items: T[], limit = 20): T[][] {
  let result: T[][] = [];
  let buffer: T[] = [];

  for (let item of items) {
    buffer.push(item);
    if (buffer.length >= limit) {
      result.push(buffer);
      buffer = [];
    }
  }

  result.push(buffer);
  return result;
}

async function runner() {
  while (true) {
    try {
      const links = [...document.querySelectorAll('a[href^="#"]')].filter(
        (link) => {
          const mounted = processedNodes.get(link);
          return !mounted || mounted.parentElement !== link.parentElement;
        },
      );

      const batches = batch(links, BATCH_SIZE);

      for (let i = 0; i < batches.length; ++i) {
        const batch = batches[i];
        for (const link of batch) {
          const mounted = processedNodes.get(link);
          if (mounted && mounted.parentElement === link.parentElement) {
            continue;
          }

          const spoiler = parseSpoilerLink(link);
          if (!spoiler) {
            continue;
          }

          processSpoiler(spoiler);
        }

        if (i < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
        }
      }

      await new Promise((resolve) => setTimeout(resolve, TICK_DELAY));
    } catch (error) {
      console.error(error);
    }
  }
}

function main() {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(stylesheet));
  document.head.appendChild(style);

  runner().catch((error) => {
    console.error(error);
  });
}

main();
