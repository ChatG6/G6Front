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
(function () {
  const NEW_LOGO_SRC = "/logo-chatg6-svg.svg"; // your custom logo
  let replaced = false;
  let observer;

  function replaceLogo() {
    if (replaced) return;

    const logoDiv = document.querySelector(".framer-1l6g8kh");
    if (!logoDiv) return;

    const oldSvg = logoDiv.querySelector("svg");
    if (oldSvg) {
      const newImg = document.createElement("img");
      newImg.src = NEW_LOGO_SRC;
      newImg.alt = "My Custom Logo";
      newImg.style.cssText = `
        max-height:50px;
        width:100px;
        display:block;
        position:relative;
        top:15%;
      `;

      oldSvg.parentNode.replaceChild(newImg, oldSvg);

      replaced = true;
      if (observer) observer.disconnect();
    }
  }

  // Preload the logo to avoid flicker
  const preload = new Image();
  preload.src = NEW_LOGO_SRC;

  // Try replacing immediately (before DOMContentLoaded if possible)
  if (document.readyState !== "loading") {
    requestAnimationFrame(replaceLogo);
  } else {
    document.addEventListener("DOMContentLoaded", replaceLogo);
  }

  // Observe dynamic changes as fallback
  observer = new MutationObserver(() => replaceLogo());
  observer.observe(document.body, { childList: true, subtree: true });
})();

// Link Replacer
(function () {
  const OLD_URL = "https://app.jenni.ai";
  //const NEW_URL = "https://chatg6.ai";
//  const NEW_URL = "http://localhost:3000/authentication/login";
   const NEW_URL = "https://chatg6.ai/authentication/login";
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
(function () {
  // List of mappings: [oldURL, newPath]
  const URL_MAPPINGS = [
    //["./pricing", "http://localhost:3000/pricing"],
    ["./pricing", "/pricing"],
   // ["./about", "/"],
     ["./about", "/"],
    //["./teams", "/"],
    ["./teams", "/"],
     //["./blog", "/blog"],
      ["./blog", "/blog"],
    // ["./", "/"],
     ["./", "/"],
      ["https://app.jenni.ai/home", "/authentication/signup"],
      ["https://jenni.ai/blog", "/blog"],
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
  function disableTestimonialLinks(root = document) {
    root.querySelectorAll('a[data-framer-name="Card/Testimonial"]').forEach((card) => {
      if (card.getAttribute("data-disabled") === "true") return; // prevent duplicate work

      card.removeAttribute("href");
      card.style.pointerEvents = "none";
      card.style.cursor = "default";
      card.setAttribute("data-disabled", "true");

      card.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        },
        true
      );
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    disableTestimonialLinks();

    const observer = new MutationObserver((mutations) => {
      for (let m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              disableTestimonialLinks(node);
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
      newHref: "https://chatg6.ai/editor",
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
            window.top.location.href = "https://chatg6.ai/pricing";
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
startWritingLink.href = "https://chatg6.ai/editor";
const h3 = startWritingLink.querySelector("h3");
if (h3) h3.textContent = "Start Writing";

startWritingLink.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  window.top.location.href = "https://chatg6.ai/editor";
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
            window.top.location.href = "https://chatg6.ai/pricing";
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