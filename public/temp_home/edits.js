// Replace all "Jennie AI" words with "ChatG6"

(function () {
  // console.log("Overrides 🎯 text-node version loaded");

  const TEXT_SELECTOR = [
    "p",
    "a",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "li",
    "label",
    "button",
    "td",
    "th",
  ].join(",");

  const regex = /\b[\w.-]*jenni(?:[\s.-]*ai)?[\w.-]*\b/gi;
  const replacement = "ChatG6";

  // Skip anything inside Testimonials Section _or_ the framer-16x0ahw-container
  const SKIP_SELECTOR = [".framer-16x0ahw-container"].join(",");

  function replaceTextNodes(el) {
    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim()) continue;
      const newValue = node.nodeValue.replace(regex, replacement);
      if (newValue !== node.nodeValue) {
        node.nodeValue = newValue;
      }
    }
  }

  function shouldSkip(el) {
    return el.closest && el.closest(SKIP_SELECTOR);
  }

  function applyToElement(el) {
    if (shouldSkip(el)) return;
    replaceTextNodes(el);
  }

  function scanAll() {
    document.querySelectorAll(TEXT_SELECTOR).forEach(applyToElement);
  }

  document.addEventListener("DOMContentLoaded", () => {
    scanAll();
    setInterval(scanAll, 500);

    const obs = new MutationObserver((muts) => {
      for (let m of muts) {
        if (m.type === "characterData") {
          const parent = m.target.parentElement;
          if (parent && parent.matches(TEXT_SELECTOR)) {
            applyToElement(parent);
          }
        }
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.matches(TEXT_SELECTOR)) applyToElement(node);
            node.querySelectorAll(TEXT_SELECTOR).forEach(applyToElement);
          }
        });
      }
    });
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
})();

// Remove Jennie AI Header
(function () {
  //console.log("Ban-content 🚫 script loaded");

  function clearContainers() {
    document.querySelectorAll("div.framer-fchehk-container").forEach((el) => {
      if (el.innerHTML !== "") {
        el.innerHTML = "";
        //console.log("Ban-content 🚫 cleared content in:", el);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    clearContainers();

    const observer = new MutationObserver((mutations) => {
      clearContainers();

      for (let m of mutations) {
        for (let node of m.addedNodes) {
          if (node.nodeType === 1) {
            if (node.matches && node.matches("div.framer‑fchehk‑container")) {
              node.innerHTML = "";
            }
            node.querySelectorAll &&
              node
                .querySelectorAll("div.framer‑fchehk‑container")
                .forEach((el) => {
                  el.innerHTML = "";
                });
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
    });
  });
})();

// Links Replacer

(function () {
  //console.log("Href Rewriter 🔗 script loaded");

  const rules = [
    {
      textRegex: /Get started/i,
      newHref: "https://chatg6.ai/editor",
    },
    {
      textRegex: /Start writing/i,
      newHref: "https://chatg6.ai/editor",
    },
    {
      textRegex: /Learn more/i,
      newHref: "https://chatg6.ai/",
    },
  ];

  // 2) Apply rule(s) to a single <a> element
  function applyRulesToLink(a) {
    const text = a.textContent.trim();
    for (let { textRegex, newHref } of rules) {
      if (textRegex.test(text)) {
        // console.log(`🔗 Rewriting link: "${text}" → ${newHref}`);
        a.href = newHref;
        a.target = "_top";
        break;
      }
    }
  }

  // 3) Scan all <a> elements
  function scanLinks() {
    document.querySelectorAll("a").forEach(applyRulesToLink);
  }

  // 4) Observe future DOM changes
  document.addEventListener("DOMContentLoaded", () => {
    scanLinks();

    const obs = new MutationObserver((muts) => {
      muts.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.tagName === "A") {
              applyRulesToLink(node);
            } else {
              node.querySelectorAll &&
                node.querySelectorAll("a").forEach(applyRulesToLink);
            }
          }
        });
      });
    });

    obs.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();

// Replace in Testimonials
(function () {
  //console.log("Jenni Replacer ▶ loaded");

  // 1) Only process <p> tags with both classes:
  const SELECTOR = "p.framer-text.framer-styles-preset-8jskgy";

  // 2) Your regex & replacement:
  const regex = /\b[\w.-]*jenni(?:[\s.-]*ai)?[\w.-]*\b/gi;
  const replacement = "ChatG6";

  // 3) Replace _only_ text nodes under `el`
  function replaceTextNodes(el) {
    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim()) continue;
      const newValue = node.nodeValue.replace(regex, replacement);
      if (newValue !== node.nodeValue) {
        node.nodeValue = newValue;
        // console.log("Jenni Replacer ▶", `"${node.nodeValue}"`);
      }
    }
  }

  // 4) Scan all matching <p> elements
  function scanAll() {
    document.querySelectorAll(SELECTOR).forEach(replaceTextNodes);
  }

  // 5) Set up on load + live updates
  document.addEventListener("DOMContentLoaded", () => {
    scanAll();
    const obs = new MutationObserver(scanAll);
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
})();

// Disable links
(function () {
  //console.log("Disable‑links ▶ script loaded");

  function disableAll() {
    document.querySelectorAll("a.framer-k0b1ji").forEach((a) => {
      a.removeAttribute("href");
      a.addEventListener("click", (e) => e.preventDefault());
      a.style.pointerEvents = "none";
      a.style.opacity = "0.6";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    disableAll();
    // if Framer remounts links dynamically, re‑disable on each mutation
    const obs = new MutationObserver(disableAll);
    obs.observe(document.body, { childList: true, subtree: true });
  });
})();

// disable-container-links.js
// disable-container-links.js
(function () {
  console.log("Disable Container Links ▶ loaded");

  // 1) Selector for your container with all eight classes together
  const CONTAINER_SELECTOR =
    ".framer-we5Ii.framer-LOFpe.framer-6rFQK.framer-KKUaI.framer-lQMaz.framer-9JsTA.framer-17ntcyi.framer-v-17ntcyi";

  // 2) Disable a link element
  function disableLink(a) {
    a.removeAttribute("href");
    a.addEventListener("click", (e) => e.preventDefault());
    a.style.pointerEvents = "none";
    a.style.opacity = "0.8";
    console.log("Disabled ▶", a);
  }

  // 3) Scan the container and disable all links except those with target="_top"
  function scanContainer() {
    const container = document.querySelector(CONTAINER_SELECTOR);
    if (!container) return;

    container.querySelectorAll("a[href]").forEach((a) => {
      // skip any link with target="_top"
      if (a.getAttribute("target") === "_top") {
        console.log("Kept enabled ▶", a);
        return;
      }
      disableLink(a);
    });
  }

  // 4) Run on load + watch for changes
  document.addEventListener("DOMContentLoaded", () => {
    scanContainer();
    const observer = new MutationObserver(scanContainer);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(scanContainer, 500);
  });
})();

// Link Replacer
(function () {
  const OLD_URL = "https://app.jenni.ai";
  const NEW_URL = "https://chatg6.ai";

  // Replace on existing links
  function replaceLinks(root = document) {
    root.querySelectorAll(`a[href="${OLD_URL}"]`).forEach((a) => {
      a.href = NEW_URL;
    });
  }

  // Initial pass
  document.addEventListener("DOMContentLoaded", () => {
    replaceLinks();

    // Watch for dynamically-inserted links
    const observer = new MutationObserver((mutations) => {
      for (let m of mutations) {
        // If new elements added, or attributes changed
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Check the node itself
              if (node.matches && node.matches(`a[href="${OLD_URL}"]`)) {
                node.href = NEW_URL;
              }
              // And any descendants
              replaceLinks(node);
            }
          });
        } else if (
          m.type === "attributes" &&
          m.target.matches &&
          m.attributeName === "href" &&
          m.target.matches(`a[href="${OLD_URL}"]`)
        ) {
          m.target.href = NEW_URL;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });
  });
})();

// Videos Replacer

(function () {
  // 1) Map each remote URL → local public/ path
  const bgReplacements = [
    {
      oldUrl: "https://i.ytimg.com/vi_webp/BBI-WnfcC1U/sddefault.webp",
      newPath: "/temp_home/vid.jpg",
    },
    {
      oldUrl: "https://i.ytimg.com/vi_webp/YF-YWypWbyc/sddefault.webp",
      newPath: "/temp_home/vid.jpg",
    },

    {
      oldUrl: "https://i.ytimg.com/vi_webp/EGgdGLYdoLg/sddefault.webp",
      newPath: "/temp_home/vid.jpg",
    },
  ];

  // 2) Replace on a single element if its inline bg contains any oldUrl
  function replaceBg(el) {
    if (!el.style || !el.style.background) return;
    bgReplacements.forEach(({ oldUrl, newPath }) => {
      if (el.style.background.includes(oldUrl)) {
        el.style.background = el.style.background.replace(oldUrl, newPath);
      }
    });
  }

  // 3) Scan a root (document or subtree) for all elements
  function scanAndReplace(root = document) {
    root.querySelectorAll("*").forEach(replaceBg);
  }

  // 4) Run on load + observe dynamic additions
  document.addEventListener("DOMContentLoaded", () => {
    scanAndReplace();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              replaceBg(node);
              node.querySelectorAll &&
                node.querySelectorAll("*").forEach(replaceBg);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();

// Video remover
(function () {
  // CSS selector to match YouTube iframes
  const YT_IFRAME_SELECTOR = 'iframe[src^="https://www.youtube.com/embed/"]';

  // Remove or disable one iframe:
  function disableIframe(iframe) {
    // Option A: fully remove from DOM
    iframe.remove();

    // — or, Option B: neutralize it instead of removing:
    // iframe.src = "";                  // clear the src
    // iframe.style.display = "none";    // hide it
    // iframe.allow = "";                // remove permissions
    // iframe.removeAttribute("title");  // strip title
  }

  // Scan a root node for matching iframes
  function scanAndDisable(root = document) {
    root.querySelectorAll(YT_IFRAME_SELECTOR).forEach(disableIframe);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // initial pass
    scanAndDisable();

    // watch for any new iframes added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.matches && node.matches(YT_IFRAME_SELECTOR)) {
                disableIframe(node);
              }
              node.querySelectorAll &&
                node
                  .querySelectorAll(YT_IFRAME_SELECTOR)
                  .forEach(disableIframe);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();

// Inline logo replacer

(function () {
  const OLD_SRC =
    "https://framerusercontent.com/images/pr1nUkkQPZIxfn2xlKRQAAkYTE.png";
  // Change this to the path of your replacement image in `public/`
  const NEW_SRC = "/temp_home/logo.png";

  function replaceImage(img) {
    if (img.src === OLD_SRC) {
      img.src = NEW_SRC;
    }
  }

  function scanAndReplace(root = document) {
    root.querySelectorAll(`img[src="${OLD_SRC}"]`).forEach(replaceImage);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // initial pass
    scanAndReplace();

    // watch for any new <img> added
    const observer = new MutationObserver((mutations) => {
      for (let m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // if the node itself is the target <img>
              if (node.matches && node.matches(`img[src="${OLD_SRC}"]`)) {
                replaceImage(node);
              }
              // or any descendants
              node.querySelectorAll &&
                node
                  .querySelectorAll(`img[src="${OLD_SRC}"]`)
                  .forEach(replaceImage);
            }
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();

