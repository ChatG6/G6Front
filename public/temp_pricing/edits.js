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
(function () { //console.log("Ban-content 🚫 script loaded"); 
function clearContainers() 
{ document.querySelectorAll("div.framer-9lalpx-container").forEach((el) => 
  { if (el.innerHTML !== "") { el.innerHTML = ""; 
    //console.log("Ban-content 🚫 cleared content in:", el); 
    } }); 
    }
     document.addEventListener("DOMContentLoaded", () => { clearContainers(); const observer = new MutationObserver((mutations) => { clearContainers(); for (let m of mutations) { for (let node of m.addedNodes) { if (node.nodeType === 1) { if (node.matches && node.matches("div.framer‑fchehk‑container")) { node.innerHTML = ""; } node.querySelectorAll && node .querySelectorAll("div.framer‑fchehk‑container") .forEach((el) => { el.innerHTML = ""; }); } } } }); observer.observe(document.body, { childList: true, subtree: true, characterData: false, }); }); })();

/*
(function () {
  const EPSILON = window.innerWidth <= 768 ? 2 : 2;
  let lastHeight = 0;
  let stableCount = 0;

  function adjustAfterHeaderRemoval() {
    document.querySelectorAll("div.framer-9lalpx-container").forEach(el => el.remove());
     // Find the element and adjust its padding-top
    const target2 = document.querySelector(".framer-ILfcX.framer-t7dfbl");
    if (target2) {
      target2.style.paddingTop = window.innerWidth <= 768 ? "40px" : "40px"; // Or set to a smaller value if not 0
    }
   
  }
 // Computes true page height, accounting for transforms/absolute elements
  function computeTrueHeight() {
    const body = document.body;
    const html = document.documentElement;

    const basic = Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );

    let maxBottom = 0;
    // Walk all elements once; cheap enough for one-shot measure
    const all = body.getElementsByTagName("*");
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      // Skip fully hidden
      const cs = window.getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      const bottom = rect.bottom + window.scrollY;
      if (bottom > maxBottom) maxBottom = bottom;
    }

    return Math.ceil(Math.max(basic, maxBottom)) + EPSILON;
  }

  async function setHeightOnce() {
    adjustAfterHeaderRemoval();

    // Wait for fonts to settle + a couple frames so layout is final
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch {}
    }
    await new Promise(r => requestAnimationFrame(() => r()));
    await new Promise(r => requestAnimationFrame(() => r()));

    const height = computeTrueHeight();

    // Send height to parent (once)
    window.parent.postMessage({ iframeHeight: height }, "*");

    // Hide iframe's own scroll so parent scrolls the whole page
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  // Run once after all resources load (images, etc.)
  window.addEventListener("load", () => { setHeightOnce(); });
})();
*/
// Links Replacer

(function () {
  //console.log("Href Rewriter 🔗 script loaded");

  const rules = [
    {
      textRegex: /Start writing/i,
      newHref: "https://chatg6.ai/editor",
    },
    {
      textRegex: /Enquire Now/i,
      newHref: "#",
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
 // const PAID_BASE_URL = "http://localhost:3000/paid";
 const PAID_BASE_URL = "https://chatg6.ai/paid";
 //const FREE_URL = "http://localhost:3000/editor";
 const FREE_URL = "https://chatg6.ai/editor";
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

// Price Replacer
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

// Video replacer
(function () {
  const OLD_SRC =
    "https://framerusercontent.com/assets/3Z8TdWTQLS7koF7wbRazOUcKHU.mp4";
  // Path relative to your Next.js `public/` folder:
  const NEW_SRC = "/temp_pricing/rep.mp4";

  function replaceVideoSrc(video) {
    if (video.getAttribute("src") === OLD_SRC) {
      video.setAttribute("src", NEW_SRC);
      // reload video to pick up new source
      video.load();
    }
  }

  function scanAndReplace(root = document) {
    root.querySelectorAll(`video[src="${OLD_SRC}"]`).forEach(replaceVideoSrc);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // initial pass
    scanAndReplace();

    // observe for dynamically-inserted <video> elements
    const observer = new MutationObserver((mutations) => {
      for (let m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // if the node itself is our target <video>
              if (node.matches && node.matches(`video[src="${OLD_SRC}"]`)) {
                replaceVideoSrc(node);
              }
              // or any <video> descendants
              node.querySelectorAll &&
                node
                  .querySelectorAll(`video[src="${OLD_SRC}"]`)
                  .forEach(replaceVideoSrc);
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

// Replace Name under Video

(function () {
  // 1) List of sample Chinese male names
  const CHINESE_NAMES = ["Wei Zhang"];

  // 2) Selector and target text
  const TARGET_SELECTOR = "p.framer-text";
  const ORIGINAL_TEXT = "Nurul Jawahir Md Ali";

  // 3) Replace function
  function replaceName(el) {
    if (el.textContent.trim() === ORIGINAL_TEXT) {
      const randomName =
        CHINESE_NAMES[Math.floor(Math.random() * CHINESE_NAMES.length)];
      el.textContent = randomName;
    }
  }

  // 4) Scan a root (document or subtree) for matches
  function scanAndReplace(root = document) {
    root.querySelectorAll(TARGET_SELECTOR).forEach(replaceName);
  }

  // 5) Kick off on load + observe dynamic additions
  document.addEventListener("DOMContentLoaded", () => {
    // initial pass
    scanAndReplace();

    // watch for newly added <p class="framer-text"> nodes
    const observer = new MutationObserver((mutations) => {
      for (let m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // if the node itself matches
              if (node.matches && node.matches(TARGET_SELECTOR)) {
                replaceName(node);
              }
              // or any matching descendants
              node.querySelectorAll &&
                node.querySelectorAll(TARGET_SELECTOR).forEach(replaceName);
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
