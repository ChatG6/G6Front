// Replace all "Jennie AI" words with "ChatG6"
//const URLS = require('../../app/config/urls')
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
  // console.log("Ban-content 🚫 script loaded");

  function clearContainers() {
    document.querySelectorAll("div.framer-9lalpx-container").forEach((el) => {
      if (el.innerHTML !== "") {
        el.innerHTML = "";
        // console.log("Ban-content 🚫 cleared content in:", el);
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
            if (node.matches && node.matches("div.framer-9lalpx-container")) {
              node.innerHTML = "";
            }
            node.querySelectorAll &&
              node
                .querySelectorAll("div.framer-9lalpx-container")
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
      textRegex: /Start writing/i,
      newHref: "https://chatg6.ai/editor",
    //  newHref: `${URLS.urls.main}/editor`
    },
    {
      textRegex: /Enquire Now/i,
      newHref: "https://chatg6.ai/pricing",
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

// Pricer

window.addEventListener("DOMContentLoaded", () => {
  // Framer switch classes
  const ANNUAL_SWITCH = "framer-v-kkql9l";
  const MONTHLY_SWITCH = "framer-v-isxkx6";

  // Plan container classes
  const PAID_CONTAINERS = [
    "framer-16whzeb-container",
    "framer-1g930m9-container",
  ];
  const FREE_CONTAINERS = [
    "framer-18bdtbf-container",
    "framer-1cqtgkm-container",
  ];

  // Your URLs
  //const PAID_BASE_URL = "http://localhost:3000/paid";
  //const FREE_URL = "http://localhost:3000/editor";
    const PAID_BASE_URL = "http://chatg6.ai/paid";
  const FREE_URL = "http://chatg6.ai/editor";
  // Determine current billing mode
  function getBillingMode() {
    const el = document.querySelector(`.${ANNUAL_SWITCH}`);
    return el && getComputedStyle(el).display !== "none" ? "annual" : "monthly";
  }

  // Force‑rewrite all matching links
  function forceUpdateLinks() {
    const mode = getBillingMode();
    const paidHref = `${PAID_BASE_URL}?billing=${mode}`;

    // Free‑plan buttons
    FREE_CONTAINERS.forEach((cls) =>
      document.querySelectorAll(`.${cls} a`).forEach((a) => {
        const txt = a.textContent.trim();
        if (txt === "Start for free" || txt === "Get started") {
          a.href = FREE_URL;
          a.target = "_top";
        }
      })
    );

    // Paid‑plan buttons
    PAID_CONTAINERS.forEach((cls) =>
      document.querySelectorAll(`.${cls} a`).forEach((a) => {
        const txt = a.textContent.trim();
        if (txt === "Start for free" || txt === "Get started") {
          a.href = paidHref;
          a.target = "_top";
        }
      })
    );
  }

  // 1) Initial fix
  forceUpdateLinks();

  // 2) Observe DOM changes (Framer re‑renders)
  const observer = new MutationObserver(forceUpdateLinks);
  observer.observe(document.body, { childList: true, subtree: true });

  // 3) Poll switch every 300ms (catches the CSS‐only toggle)
  setInterval(forceUpdateLinks, 300);
});

// Link Disable
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

  const regex = /12/i;
  const replacement = "22";

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
