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


(function () { //console.log("Ban-content 🚫 script loaded"); 
function clearContainers() 
{ document.querySelectorAll("div.framer-fchehk-container").forEach((el) => 
  { if (el.innerHTML !== "") { el.innerHTML = ""; 
    //console.log("Ban-content 🚫 cleared content in:", el); 
    } }); 
    }
     document.addEventListener("DOMContentLoaded", () => { clearContainers(); const observer = new MutationObserver((mutations) => { clearContainers(); for (let m of mutations) { for (let node of m.addedNodes) { if (node.nodeType === 1) { if (node.matches && node.matches("div.framer‑fchehk‑container")) { node.innerHTML = ""; } node.querySelectorAll && node .querySelectorAll("div.framer‑fchehk‑container") .forEach((el) => { el.innerHTML = ""; }); } } } }); observer.observe(document.body, { childList: true, subtree: true, characterData: false, }); }); })();

     /*
(function () {
  function hideScroll() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }

  document.addEventListener("DOMContentLoaded", () => {
    hideScroll();

    const observer = new MutationObserver(() => {
      hideScroll(); // Re-apply if styles change
    });

    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true
    });
  });
})();*/
// Remove Jennie AI Header
/*
(function () {
  function removeContainers() {
    document.querySelectorAll("div.framer-fchehk-container").forEach((el) => {
      el.remove(); // This removes the element completely
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    removeContainers();

    const observer = new MutationObserver(() => {
      removeContainers();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();
*/

(function () {
  // EPSILON is now proportional to viewport width → no huge gap on small screens
  //const EPSILON = Math.min(2, Math.floor(window.innerWidth * 0.001));
  const EPSILON = 0; 
  let lastHeight = 0;

  function adjustAfterHeaderRemoval() {
    // 1) Remove Framer header if present
    document.querySelectorAll("div.framer-fchehk-container").forEach(el => el.remove());

    // 2) Let content determine height naturally
    document.querySelectorAll("div[data-framer-root]").forEach(el => {
      el.style.minHeight = "auto";
      el.style.height = "auto";
      el.style.maxHeight = "none";
    });

    // 3) Adjust padding-top for known targets
    const target1 = document.querySelector(".framer-HWVgC.framer-v-z2cvi2.framer-1in7hqk");
    if (target1) target1.style.paddingTop = "40px";

    const target2 = document.querySelector(".framer-HWVgC.framer-1in7hqk");
    if (target2) target2.style.paddingTop = window.innerWidth <= 768 ? "60px" : "80px";
  }

  // Computes true page height including footer
  function computeTrueHeight() {
    const body = document.body;
    const html = document.documentElement;

    let maxBottom = Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    );

    // Force include footer if exists
    const footer = document.querySelector("footer");
    if (footer) {
      const rect = footer.getBoundingClientRect();
      maxBottom = Math.max(maxBottom, rect.bottom + window.scrollY);
    }

    return Math.ceil(maxBottom) + EPSILON;
  }

  function sendHeight(height) {
    window.parent.postMessage({ iframeHeight: height }, "*");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  async function setHeightOnce() {
    adjustAfterHeaderRemoval();

    // Wait for fonts and 2 frames for layout stabilization
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch {}
    }
    await new Promise(r => requestAnimationFrame(() => r()));
    await new Promise(r => requestAnimationFrame(() => r()));

    const height = computeTrueHeight();
    lastHeight = height;
    sendHeight(height);

    // Schedule final re-checks (1s, 2s, 3s) in case footer or late images shift layout
    [1000, 2000, 3000].forEach(delay => {
      setTimeout(() => {
        const h = computeTrueHeight();
        if (h !== lastHeight) {
          lastHeight = h;
          sendHeight(h);
        }
      }, delay);
    });
  }

  window.addEventListener("load", () => { setHeightOnce(); });
})();

/*
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
*/
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
   // console.log("Disabled ▶", a);
  }

  // 3) Scan the container and disable all links except those with target="_top"
  function scanContainer() {
    const container = document.querySelector(CONTAINER_SELECTOR);
    if (!container) return;

    container.querySelectorAll("a[href]").forEach((a) => {
      // skip any link with target="_top"
      if (a.getAttribute("target") === "_top") {
       // console.log("Kept enabled ▶", a);
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
  const OLD_URL = "https://www.youtube.com/@whoisjenniai/videos";
  const NEW_URL = "https://youtu.be/XWbeDHJtMBs?si=amfoV62xZGc_2rWs";

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
    {
      oldUrl: "https://i.ytimg.com/vi_webp/nUKjEsBo0ho/sddefault.webp",
      newPath: "/temp_home/vid.jpg",
    },
    {
      oldUrl: "https://i.ytimg.com/vi_webp/LdYJgpzOvtI/sddefault.webp",
      newPath: "/temp_home/vid.jpg",
    },
    {
      oldUrl: "https://i.ytimg.com/vi_webp/E4WjguR2y94/sddefault.webp",
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
/*
(function () {
  // CSS selector to match YouTube iframes
  const YT_IFRAME_SELECTOR = 'iframe[src^="https://www.youtube.com/embed/"]';

  // Remove or disable one iframe:
  function disableIframe(iframe) {
    // Option A: fully remove from DOM
    //iframe.remove();

    // — or, Option B: neutralize it instead of removing:
    iframe.src = "https://www.youtube.com/embed/XWbeDHJtMBs?si=hzoCpDnXgca0lyX3?iv_load_policy=3&amp;rel=0&amp;modestbranding=1&amp;playsinline=1&amp;autoplay=1";                  // clear the src
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
*/
/*
(function () {
  const ORIGINAL_URL = "https://www.youtube.com/embed/BBI-WnfcC1U?iv_load_policy=3&amp;rel=0&amp;modestbranding=1&amp;playsinline=1&amp;autoplay=1";
  const NEW_URL = "https://www.youtube.com/embed/XWbeDHJtMBs?si=hzoCpDnXgca0lyX3?iv_load_policy=3&amp;rel=0&amp;modestbranding=1&amp;playsinline=1&amp;autoplay=1";
  function overrideButtonClick(button) {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // stop any other handlers
      e.preventDefault();  // block default action

      const iframe = button.parentElement.querySelector("iframe");
      if (iframe) {
        iframe.src = NEW_URL; // force new URL
        iframe.style.display = "block"; // show it
      }
      // Hide the button now that the video is playing
        button.style.display = "none";
    }, true); // <-- use capture to override before site scripts
  }

  function scanAndAttach(root = document) {
    root.querySelectorAll("article button").forEach(overrideButtonClick);
  }

  document.addEventListener("DOMContentLoaded", () => {
    scanAndAttach();

    // Watch for dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              node.querySelectorAll &&
                node.querySelectorAll("article button").forEach(overrideButtonClick);
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();

*/
// Global loading flag
// Utility to check if any iframe is still in "loading" state
function anyIframeLoading() {
  const iframes = document.querySelectorAll("iframe");
  for (let iframe of iframes) {
    if (iframe.dataset.loading === "true") return true;
  }
  return false;
}

(function() {
  // Video URLs for each container
  const VIDEO_CONTAINERS = [
    { className: "framer-aaw2r0-container", url: "https://www.youtube.com/embed/XWbeDHJtMBs?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1" },
    { className: "framer-15smsej-container", url: "https://www.youtube.com/embed/sn4uNFhZz3A?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1" },
    { className: "framer-ib5v53-container", url: "https://www.youtube.com/embed/9gJuv3f3mw0?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1" },
    { className: "framer-18vmk0g-container", url: "https://www.youtube.com/embed/SXpNBXBVYbk?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1" },
    { className: "framer-1o1v8sm-container", url: "https://www.youtube.com/embed/DWQqNju77W8?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1" },
    { className: "framer-wz03p2-container", url: "https://www.youtube.com/embed/JJ2JCV10CMU?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1" },
    { className: "framer-y3jgn4-container", url: "https://www.youtube.com/embed/XWbeDHJtMBs?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1" },
  ];

  // Attach click handler for a single container
  function attachHandler(containerClass, videoUrl) {
    const container = document.querySelector(`.${containerClass}`);
    if (!container) return;

    const article = container.querySelector("article");
    if (!article) return;

    const button = article.querySelector("button");
    const thumbnail = article.querySelector("div");
    const iframe = article.querySelector("iframe");
    if (!button || !iframe) return;

    iframe.dataset.loaded = "false";
    iframe.dataset.loading = "false";

    button.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      // Ignore click if this iframe is currently loading
      if (iframe.dataset.loading === "true") return;

      iframe.dataset.loading = "true"; // Lock this iframe
      if (thumbnail) thumbnail.style.display = "none";
      button.style.display = "none";

      // Reset iframe src and show it
      iframe.src = "";
      iframe.style.display = "block";
      setTimeout(() => {
        iframe.src = videoUrl;
      }, 80);

      iframe.onload = () => {
        iframe.dataset.loaded = "true";
        iframe.dataset.loading = "false"; // Unlock
      };
    });
  }

  // Initialize all containers
  function init() {
    VIDEO_CONTAINERS.forEach(vc => attachHandler(vc.className, vc.url));
  }

  document.addEventListener("DOMContentLoaded", () => {
    init();

    // MutationObserver for dynamically added containers
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.type === "childList") {
          m.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              VIDEO_CONTAINERS.forEach(vc => {
                if (node.classList.contains(vc.className) || node.querySelector(`.${vc.className}`)) {
                  attachHandler(vc.className, vc.url);
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();


/*
(function () {
  // List of allowed URLs for your 6 videos
  const ALLOWED_URLS = [
     "https://www.youtube.com/embed/XWbeDHJtMBs?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1",
    "https://www.youtube.com/embed/sn4uNFhZz3A?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1",
    "https://www.youtube.com/embed/9gJuv3f3mw0?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1",
    "https://www.youtube.com/embed/SXpNBXBVYbk?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1",
    "https://www.youtube.com/embed/DWQqNju77W8?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1",
    "https://www.youtube.com/embed/JJ2JCV10CMU?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1",
     "https://www.youtube.com/embed/XWbeDHJtMBs?autoplay=1&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1",
  ];

  function replaceAllIframes() {
    const articles = document.querySelectorAll("article");
    articles.forEach((article, index) => {
      let iframe = article.querySelector("iframe");
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.style.position = "absolute";
        iframe.style.top = 0;
        iframe.style.left = 0;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        article.appendChild(iframe);
      }
      // Assign the allowed URL for this index
      iframe.src = ALLOWED_URLS[index] || ALLOWED_URLS[0];
      iframe.style.display = "none"; // keep hidden until button click
    });
  }

  function handleButtonClick(button, index) {
    button.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Ensure all iframes have allowed URLs
        replaceAllIframes();

        const article = button.closest("article");
        if (!article) return;

        const iframe = article.querySelector("iframe");
        iframe.style.display = "block"; // show it
        // Hide the play button
        button.style.display = "none";
      },
      true
    );
  }

  function attachButtons(root = document) {
    const articles = Array.from(root.querySelectorAll("article"));
    articles.forEach((article, index) => {
      const button = article.querySelector("button");
      if (button) handleButtonClick(button, index);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    replaceAllIframes();
    attachButtons();

    // Observe dynamically added articles/buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              replaceAllIframes();
              attachButtons(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();*/
/*
(function () {
  // Define the link to replace
  const OLD_LINK = "https://www.youtube.com/embed/BBI-WnfcC1U?iv_load_policy=3&amp;rel=0&amp;modestbranding=1&amp;playsinline=1&amp;autoplay=1";
  const NEW_LINK = "https://youtu.be/XWbeDHJtMBs?si=hzoCpDnXgca0lyX3";

  // Replace in element attributes
  function replaceAttributes(el) {
    if (!el.getAttributeNames) return;
    el.getAttributeNames().forEach((attr) => {
      const val = el.getAttribute(attr);
      if (val && val.includes(OLD_LINK)) {
        el.setAttribute(attr, val.replaceAll(OLD_LINK, NEW_LINK));
      }
    });
  }

  // Replace in text nodes
  function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes(OLD_LINK)) {
      node.nodeValue = node.nodeValue.replaceAll(OLD_LINK, NEW_LINK);
    }
  }

  // Scan whole DOM subtree
  function scanAndReplace(root = document) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      replaceText(root);
    } else if (root.nodeType === Node.ELEMENT_NODE) {
      replaceAttributes(root);
      root.childNodes.forEach(scanAndReplace);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Initial pass
    scanAndReplace(document.body);

    // Watch for dynamically added content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          scanAndReplace(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
*/

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

