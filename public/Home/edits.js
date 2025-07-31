// Replace all "Jennie AI" words with "ChatG6"

(function () {
  // console.log("Overrides 🎯 text‑node version loaded");

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

  const REVIEWS_SECTION = '[data-framer-name="Testimonials Section"]';

  // 4) Walk only text nodes under `el` and replace matches
  function replaceTextNodes(el) {
    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while ((node = walker.nextNode())) {
      // skip empty or whitespace‑only
      if (!node.nodeValue.trim()) continue;
      const newValue = node.nodeValue.replace(regex, replacement);
      if (newValue !== node.nodeValue) {
        //console.log("Overrides ▶", `"${node.nodeValue}" → "${newValue}"`);
        node.nodeValue = newValue;
      }
    }
  }

  // 5) Should we skip this node because it’s in reviews?
  function isInReviews(el) {
    return el.closest && el.closest(REVIEWS_SECTION);
  }

  // 6) Apply to one element (if it isn’t in reviews):
  function applyToElement(el) {
    if (isInReviews(el)) return;
    replaceTextNodes(el);
  }

  // 7) Scan entire document for TEXT_SELECTOR elements:
  function scanAll() {
    document.querySelectorAll(TEXT_SELECTOR).forEach(applyToElement);
  }

  // 8) Wire up on load + live updates:
  document.addEventListener("DOMContentLoaded", () => {
    // console.log("Overrides 🎯 initial scan");
    scanAll();

    // fallback in case something slips through:
    setInterval(scanAll, 500);

    // observe new or updated text nodes
    const obs = new MutationObserver((muts) => {
      for (let m of muts) {
        // if text changed somewhere
        if (m.type === "characterData") {
          const parent = m.target.parentElement;
          if (parent && parent.matches(TEXT_SELECTOR)) {
            applyToElement(parent);
          }
        }
        // if new elements added
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

// jenni-replacer.js
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
