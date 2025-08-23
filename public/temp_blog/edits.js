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
/*
(function () {
  function hideContainers() {
    document.querySelectorAll("div.framer-fchehk-container").forEach((el) => {
      el.style.display = "none"; // Hide instead of remove
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    hideContainers();

    const observer = new MutationObserver(() => {
      hideContainers();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();*/
/*
(function () { //console.log("Ban-content 🚫 script loaded"); 
function clearContainers() 
{ document.querySelectorAll("div.framer-fchehk-container").forEach((el) => 
  { if (el.innerHTML !== "") { el.innerHTML = ""; 
    //console.log("Ban-content 🚫 cleared content in:", el); 
    } }); 
    }
     document.addEventListener("DOMContentLoaded", () => { clearContainers(); const observer = new MutationObserver((mutations) => { clearContainers(); for (let m of mutations) { for (let node of m.addedNodes) { if (node.nodeType === 1) { if (node.matches && node.matches("div.framer‑fchehk‑container")) { node.innerHTML = ""; } node.querySelectorAll && node .querySelectorAll("div.framer‑fchehk‑container") .forEach((el) => { el.innerHTML = ""; }); } } } }); observer.observe(document.body, { childList: true, subtree: true, characterData: false, }); }); })();
*/
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
/*
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
*/
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
     // newHref: "https://chatg6.ai/editor",
       newHref: "http://localhost:3000/editor",
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
  //const NEW_URL = "https://chatg6.ai";
  const NEW_URL = "http://localhost:3000/authentication/login";
  // Replace on existing links
  function replaceLinks(root = document) {
    root.querySelectorAll(`a[href="${OLD_URL}"]`).forEach((a) => {
      a.href = NEW_URL;
       a.target = "_top";
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
  // List of mappings: [oldURL, newPath]
  const URL_MAPPINGS = [
    ["./pricing", "http://localhost:3000/pricing"],
    ["./about", "/"],
    ["./teams", "/"],
   //  ["./blog", "/blog"],
     ["./", "/"],
      ["https://app.jenni.ai/home", "/authentication/signup"],
  ];

  function replaceLinks(root = document) {
    URL_MAPPINGS.forEach(([OLD_URL, NEW_PATH]) => {
      root.querySelectorAll(`a[href="${OLD_URL}"]`).forEach((a) => {
        // Force only our behavior
        a.setAttribute("data-replaced", "true"); // prevent duplicate listeners
        a.href = NEW_PATH; // disable original navigation

        a.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopImmediatePropagation(); // stop other click handlers
          // Navigate top window via Next.js router
          window.top.history.pushState({}, "", NEW_PATH);
          window.top.dispatchEvent(new PopStateEvent("popstate"));
              // Navigate parent (Next.js) window
          window.top.location.href = NEW_PATH;
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    replaceLinks();

    const observer = new MutationObserver((mutations) => {
      for (let m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              replaceLinks(node);
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

(function () {
  let currentSession = { loggedIn: false, username: "", status: "free" };

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #header-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f4f4f5;
      color: #09090B;
      cursor: pointer;
      font-family: sans-serif;
      font-size: 16px;
      position: relative;
      z-index: 1000;
    }

    #header-avatar-dropdown {
      display: none;
      position: fixed;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 9px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 200px;
      font-family: sans-serif;
      overflow: hidden;
      z-index: 9999;
    }

    #header-avatar-dropdown .dropdown-header {
      font-weight: 600;
      padding: 10px 14px;
      font-size: 14px;
      color: #111827;
    }

    #header-avatar-dropdown hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 4px 0;
    }

    #header-avatar-dropdown .dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      text-align: left;
      padding: 10px 14px;
      border: none;
      background: none;
      cursor: pointer;
      text-decoration: none;
      color: #111827;
      font-size: 14px;
      transition: background 0.2s;
    }

    #header-avatar-dropdown .dropdown-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    #header-avatar-dropdown .dropdown-item:hover {
      background-color: #f3f4f6;
    }
    .diamond {
    color:"#545CEB";
    }
  
  `;
  document.head.appendChild(style);

  function getIcon(name) {
    if (name === "diamond") {
      return `<svg class ="diamond" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gem-icon lucide-gem"><path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/></svg>`
      //return `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 9l10 13 10-13-10-7z"/></svg>`;
    }
    if (name === "rocket") {
      // missile/rocket style
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rocket-icon lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`
    }
    if (name === "cancel") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`
      //return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`;
    }
    if (name === "logout") {
      return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-14V3" /></svg>`;
    }
    return "";
  }

  function updateHeader(session) {
    currentSession = session;

    const loginBtnContainer = document.querySelector('[data-framer-name="Login Button"]');
    const startWritingBtnContainer = document.querySelector('[data-framer-name="Navbar Button"]');

    if (!loginBtnContainer || !startWritingBtnContainer) return;

    if (session.loggedIn) {
      loginBtnContainer.remove();

      if (!document.querySelector("#header-avatar-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.id = "header-avatar-wrapper";
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "8px";

        startWritingBtnContainer.parentElement.insertBefore(wrapper, startWritingBtnContainer);
        wrapper.appendChild(startWritingBtnContainer);

        // Avatar
        const avatar = document.createElement("div");
        avatar.id = "header-avatar";
        avatar.textContent = session.username.charAt(0).toUpperCase();
        document.body.appendChild(avatar);

        // Dropdown
        const dropdown = document.createElement("div");
        dropdown.id = "header-avatar-dropdown";

        // Content
        const planLabel = session.status === "active" ? "Premium Plan" : "Free Plan";
        const planIcon = session.status === "active" ? getIcon("diamond") : "";
        const actionLabel = session.status === "active" ? "Cancel Subscription" :"Upgrade to Premium";
        const actionIcon = session.status === "active" ? getIcon("cancel") : getIcon("rocket");

        dropdown.innerHTML = `
          <div class="dropdown-header">${session.username}</div>
          <hr>
          <div class="dropdown-item">${planIcon} ${planLabel}</div>
          <button class="dropdown-item" id="plan-action">${actionIcon} ${actionLabel}</button>
          <button class="dropdown-item danger" id="sign-out">Sign Out</button>
        `;
        document.body.appendChild(dropdown);

        wrapper.appendChild(avatar);

        avatar.addEventListener("click", (e) => {
          e.stopPropagation();
          const rect = avatar.getBoundingClientRect();
          const dropdownWidth = 200;
          dropdown.style.top = rect.bottom + window.scrollY + 5 + "px";
          dropdown.style.left = (rect.right + window.scrollX - dropdownWidth) + 70 + "px";
          dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", () => {
          dropdown.style.display = "none";
        });

        // Handle upgrade/cancel
        dropdown.querySelector("#plan-action")?.addEventListener("click", (e) => {
          if (session.status === "active") {
             e.stopPropagation();
  // Send a message to the parent window/homepage
  window.top.postMessage(
    { type: "APP_SUB_CANCEL_REQUEST" },
    "*" // or restrict origin to your domain
  );

          } else {
            window.top.location.href = "/pricing";
          }
        });

        // Handle sign out
        dropdown.querySelector("#sign-out")?.addEventListener("click", (e) => {
           e.stopPropagation();
  // Send a message to the parent window/homepage
  window.top.postMessage(
    { type: "APP_SIGNOUT_REQUEST" },
    "*" // or restrict origin to your domain
  );
  // Optionally hide dropdown after click
  dropdown.style.display = "none";
        });
      } else {
        document.querySelector("#header-avatar").textContent =
          session.username.charAt(0).toUpperCase();
      }
    } else {
      const avatarWrapper = document.querySelector("#header-avatar-wrapper");
      if (avatarWrapper) {
        avatarWrapper.replaceWith(startWritingBtnContainer.parentElement);
      }
    }
  }

  window.addEventListener("message", (e) => {
    if (e.data?.type === "APP_SESSION_UPDATE") {
      updateHeader(e.data.payload);
    }
  });
})();
(function () {
 let currentSession = { loggedIn: false, username: "", status: "free" };

    // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #header-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f4f4f5;
      color: #09090B;
      cursor: pointer;
      font-family: sans-serif;
      font-size: 16px;
      position: relative;
      z-index: 1000;
    }

    #header-avatar-dropdown {
      display: none;
      position: fixed;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 9px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 200px;
      font-family: sans-serif;
      overflow: hidden;
      z-index: 9999;
    }

    #header-avatar-dropdown .dropdown-header {
      font-weight: 600;
      padding: 10px 14px;
      font-size: 14px;
      color: #111827;
    }

    #header-avatar-dropdown hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 4px 0;
    }

    #header-avatar-dropdown .dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      text-align: left;
      padding: 10px 14px;
      border: none;
      background: none;
      cursor: pointer;
      text-decoration: none;
      color: #111827;
      font-size: 14px;
      transition: background 0.2s;
    }

    #header-avatar-dropdown .dropdown-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    #header-avatar-dropdown .dropdown-item:hover {
      background-color: #f3f4f6;
    }
    .diamond {
    color:"#545CEB";
    }
  
  `;
  document.head.appendChild(style);
    function getIcon(name) {
    if (name === "diamond") {
      return `<svg class ="diamond" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gem-icon lucide-gem"><path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/></svg>`
      //return `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 9l10 13 10-13-10-7z"/></svg>`;
    }
    if (name === "rocket") {
      // missile/rocket style
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rocket-icon lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`
    }
    if (name === "cancel") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`
      //return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`;
    }
    if (name === "logout") {
      return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-14V3" /></svg>`;
    }
    return "";
  }
  function updateHamburgerMenu(session) {
    currentSession = session;

    const hamburgerContainer = document.querySelector('[data-framer-name="Burger"]');
    const signUpBtnContainer = document.querySelector('[data-framer-name="Navbar Button"]');
    const hamburgerContainer2 = document.querySelector('.framer-cev8a-container');
    if (!hamburgerContainer || !signUpBtnContainer || !hamburgerContainer2) return;

    if (session.loggedIn) {
      // Remove hamburger
      hamburgerContainer.remove();
      hamburgerContainer2.remove();
      //hamburgerContainer.parentElement.remove();

      // Replace Sign Up with Start Writing
      //const startWritingLink = signUpBtnContainer;
      const startWritingLink = signUpBtnContainer.cloneNode(true);
      //const startWritingLink = signUpBtnContainer;
startWritingLink.href = "/editor";
const h3 = startWritingLink.querySelector("h3");
if (h3) h3.textContent = "Start Writing";

startWritingLink.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  window.top.location.href = "/editor";
});

signUpBtnContainer.replaceWith(startWritingLink);

      //const h3 = startWritingLink.querySelector("h3");
      //if (h3) h3.textContent = "Start Writing";

      if (!document.querySelector("#header-avatar-wrapper")) {
        // Create wrapper for Start Writing + avatar
        const wrapper = document.createElement("div");
        wrapper.id = "header-avatar-wrapper";
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "8px";

        startWritingLink.parentElement.insertBefore(wrapper, startWritingLink);
        wrapper.appendChild(startWritingLink);

        // Create avatar
        const avatar = document.createElement("div");
        avatar.id = "header-avatar";
        avatar.textContent = session.username.charAt(0).toUpperCase();
        document.body.appendChild(avatar);
        wrapper.appendChild(avatar);

        // Create dropdown
        const dropdown = document.createElement("div");
        dropdown.id = "header-avatar-dropdown";
        // Content
        const planLabel = session.status === "active" ? "Premium Plan" : "Free Plan";
        const planIcon = session.status === "active" ? getIcon("diamond") : "";
        const actionLabel = session.status === "active" ? "Cancel Subscription" :"Upgrade to Premium";
        const actionIcon = session.status === "active" ? getIcon("cancel") : getIcon("rocket");

        dropdown.innerHTML = `
          <div class="dropdown-header">${session.username}</div>
          <hr>
          <div class="dropdown-item">${planIcon} ${planLabel}</div>
          <button class="dropdown-item" id="plan-action">${actionIcon} ${actionLabel}</button>
          <button class="dropdown-item danger" id="sign-out">Sign Out</button>
        `;
        document.body.appendChild(dropdown);



        avatar.addEventListener("click", (e) => {
          e.stopPropagation();
          const rect = avatar.getBoundingClientRect();
          const dropdownWidth = 200;
          dropdown.style.top = rect.bottom + window.scrollY + 5 + "px";
          dropdown.style.left = (rect.right + window.scrollX - dropdownWidth) + "px";
          dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", () => {
          dropdown.style.display = "none";
        });

             // Handle sign out
        dropdown.querySelector("#sign-out")?.addEventListener("click", (e) => {
           e.stopPropagation();
  // Send a message to the parent window/homepage
  window.top.postMessage(
    { type: "APP_SIGNOUT_REQUEST" },
    "*" // or restrict origin to your domain
  );
  // Optionally hide dropdown after click
  dropdown.style.display = "none";
  //window.top.location.reload();
        });

      // Handle upgrade/cancel
        dropdown.querySelector("#plan-action")?.addEventListener("click", (e) => {
          if (session.status === "active") {
             e.stopPropagation();
  // Send a message to the parent window/homepage
  window.top.postMessage(
    { type: "APP_SUB_CANCEL_REQUEST" },
    "*" // or restrict origin to your domain
  );

          } else {
            window.top.location.href = "/pricing";
          }
        });
      }
    } else {
      // Restore hamburger if logged out
      //hamburgerContainer.style.display = "";
      
      const avatarWrapper = document.querySelector("#header-avatar-wrapper");
      if (avatarWrapper) {
        avatarWrapper.replaceWith(signUpBtnContainer.parentElement);
      }
    
    }
  }

  // Listen for session updates
  window.addEventListener("message", (e) => {
    if (e.data?.type === "APP_SESSION_UPDATE") {
      updateHamburgerMenu(e.data.payload);
    }
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
    if (!button || !iframe || !thumbnail) return;

    iframe.dataset.loaded = "false";
    iframe.dataset.loading = "false";

    function playVideo() {
      // Ignore click if this iframe is currently loading
      if (iframe.dataset.loading === "true") return;

      iframe.dataset.loading = "true"; // Lock this iframe
      thumbnail.style.display = "none";
      button.style.display = "none";

      // Reset iframe src and show it
      iframe.src = "";
      iframe.style.display = "block";
      setTimeout(() => {
        iframe.src = videoUrl;
      }, 50);

      iframe.onload = () => {
        iframe.dataset.loaded = "true";
        iframe.dataset.loading = "false"; // Unlock
      };
    }

    // Handle both button and thumbnail clicks
    button.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      playVideo();
    });

    thumbnail.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      playVideo();
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
(function () {
  const NEW_LOGO_SRC = "/logo-chatg6-svg.svg"; // your custom logo

  function replaceLogo() {
    // Find the specific container
    const logoDiv = document.querySelector(".framer-1l6g8kh");
    if (!logoDiv) return;

    // Look for the svg inside
    const oldSvg = logoDiv.querySelector("svg");
    if (oldSvg) {
      // Create replacement <img>
      const newImg = document.createElement("img");
      newImg.src = NEW_LOGO_SRC;
      newImg.alt = "My Custom Logo";
      newImg.style.maxHeight = "50px";
      newImg.style.width = "100px";
      newImg.style.display = "block";
      newImg.style.position = "relative"
      newImg.style.top = "15%"
      // Replace svg with img
      oldSvg.parentNode.replaceChild(newImg, oldSvg);
    }
  }

  document.addEventListener("DOMContentLoaded", replaceLogo);

  // In case the logo is injected dynamically
  const observer = new MutationObserver(() => replaceLogo());
  observer.observe(document.body, { childList: true, subtree: true });
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

