// content.js

// Debug logger
const DEBUG = false;
function debugLog(...args) {
  if (DEBUG) {
    console.log("[DEBUG]", ...args);
  }
}

let userPreferences = {
  replySort: "relevance",
};

function loadUserPreferences() {
  browser.storage.local.get("userPreferences").then((result) => {
    if (result.userPreferences) {
      userPreferences = result.userPreferences;
      debugLog("Loaded user preferences:", userPreferences);
      updateSelectorValue();
    }
  });
}

function saveUserPreferences() {
  browser.storage.local.set({ userPreferences }).then(() => {
    debugLog("Saved user preferences:", userPreferences);
    browser.runtime.sendMessage({
      action: "updatePreferences",
      preferences: userPreferences,
    });
  });
}

function addReplySortSelectorToNav() {
  function findPrimaryNav() {
    const navs = document.querySelectorAll("nav");
    for (let nav of navs) {
      if (
        nav.querySelector('a[href="/home"]') &&
        nav.querySelector('a[href="/explore"]')
      ) {
        return nav;
      }
    }
    return null;
  }

  function insertSelector($nav) {
    if (!$nav || $nav.querySelector("#reply-sort-selector")) return;

    const $selectorWrapper = createSelectorWrapper();
    const $innerWrapper = createInnerWrapper();
    const $iconWrapper = createIconWrapper();
    const $selectWrapper = createSelectWrapper();
    const $select = createSelect();

    $iconWrapper.appendChild(createSvgIcon());
    $innerWrapper.appendChild($iconWrapper);
    $selectWrapper.appendChild($select);
    $innerWrapper.appendChild($selectWrapper);
    $selectorWrapper.appendChild($innerWrapper);

    insertSelectorIntoNav($nav, $selectorWrapper);
    adjustColors();
    debugLog("Reply sort selector added to nav");
  }

  waitForElement(findPrimaryNav).then(insertSelector);
  observeNavChanges(insertSelector);
}

function createSelectorWrapper() {
  const $wrapper = document.createElement("div");
  $wrapper.classList.add(
    "css-175oi2r",
    "r-6koalj",
    "r-eqz5dr",
    "r-16y2uox",
    "r-1habvwh",
    "r-13qz1uu",
    "r-1ny4l3l",
    "r-1loqt21"
  );
  return $wrapper;
}

function createInnerWrapper() {
  const $wrapper = document.createElement("div");
  $wrapper.classList.add(
    "css-175oi2r",
    "r-sdzlij",
    "r-dnmrzs",
    "r-1awozwy",
    "r-18u37iz",
    "r-1777fci",
    "r-xyw6el",
    "r-o7ynqc",
    "r-6416eg"
  );
  return $wrapper;
}

function createIconWrapper() {
  return document.createElement("div");
}

function createSvgIcon() {
  const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  $svg.setAttribute("viewBox", "0 0 24 24");
  $svg.setAttribute("aria-hidden", "true");
  $svg.setAttribute("fill", "currentColor");
  $svg.classList.add(
    "r-4qtqp9",
    "r-yyyyoo",
    "r-dnmrzs",
    "r-bnwqim",
    "r-1plcrui",
    "r-lrvibr",
    "r-1nao33i",
    "r-lwhw9o",
    "r-cnnz9e"
  );

  const $path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  $path.setAttribute(
    "d",
    "M12 2C5.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.05-1.37l4.24 1.12c.49.13.99-.26.87-.75l-1.12-4.24C21.5 15.58 22 13.85 22 12c0-5.52-4.48-10-10-10z"
  );
  $svg.appendChild($path);

  return $svg;
}

function createSelectWrapper() {
  const $wrapper = document.createElement("div");
  $wrapper.setAttribute("dir", "ltr");
  $wrapper.classList.add(
    "css-146c3p1",
    "r-dnmrzs",
    "r-1udh08x",
    "r-3s2u2q",
    "r-bcqeeo",
    "r-qvutc0",
    "r-37j5jr",
    "r-adyw6z",
    "r-135wba7",
    "r-16dba41",
    "r-dlybji",
    "r-nazi8o"
  );
  return $wrapper;
}

function createSelect() {
  const $select = document.createElement("select");
  $select.id = "reply-sort-selector";
  $select.classList.add("css-1jxf684", "r-bcqeeo", "r-qvutc0", "r-poiln3");
  $select.setAttribute("aria-label", "Sort replies");

  const options = [
    { value: "relevance", text: "Relevance" },
    { value: "recency", text: "Recent" },
    { value: "likes", text: "Likes" },
  ];

  options.forEach(({ value, text }) => {
    const $option = document.createElement("option");
    $option.value = value;
    $option.textContent = text;
    $select.appendChild($option);
  });

  $select.value = userPreferences.replySort;
  $select.addEventListener("change", handleSortChange);

  return $select;
}

function handleSortChange(e) {
  userPreferences.replySort = e.target.value.toLowerCase();
  saveUserPreferences();

  const tweetPageRegex =
    /^https?:\/\/(www\.)?(twitter|x)\.com\/[^\/]+\/status\/\d+/;

  if (tweetPageRegex.test(window.location.href)) {
    debugLog("Reloading page due to sort change on tweet page");
    location.reload();
  } else {
    updateUIWithoutRefresh();
  }
}

function updateUIWithoutRefresh() {
  const $select = document.querySelector("#reply-sort-selector");
  if ($select) {
    $select.value = userPreferences.replySort;
  }

  debugLog("Sort preference updated without page refresh");
}

function insertSelectorIntoNav($nav, $selectorWrapper) {
  const children = Array.from($nav.children);
  const insertIndex = children.length - 2;
  if (insertIndex >= 0) {
    children[insertIndex].insertAdjacentElement(
      "beforebegin",
      $selectorWrapper
    );
  } else {
    $nav.appendChild($selectorWrapper);
  }
}

function observeNavChanges(insertSelector) {
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        const $nav = findPrimaryNav();
        if ($nav && !$nav.querySelector("#reply-sort-selector")) {
          insertSelector($nav);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function findPrimaryNav() {
  const navs = document.querySelectorAll("nav");
  for (let nav of navs) {
    if (
      nav.querySelector('a[href="/home"]') &&
      nav.querySelector('a[href="/explore"]')
    ) {
      return nav;
    }
  }
  return null;
}

function updateSelectorValue() {
  const $select = document.querySelector("#reply-sort-selector");
  if ($select) {
    $select.value = userPreferences.replySort;
  }
}

function waitForElement(selector, options = {}) {
  return new Promise((resolve) => {
    if (typeof selector === "function" && selector()) {
      return resolve(selector());
    }
    if (typeof selector === "string" && document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (typeof selector === "function" && selector()) {
        resolve(selector());
        observer.disconnect();
      } else if (
        typeof selector === "string" &&
        document.querySelector(selector)
      ) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function adjustColors() {
  const backgroundColor = getComputedStyle(document.body).backgroundColor;
  const $select = document.querySelector("#reply-sort-selector");

  if (!$select) return;

  const $svg = $select.closest("div").querySelector("svg");

  let textColor, svgColor;

  if (backgroundColor === "rgb(255, 255, 255)") {
    textColor = "rgb(15, 20, 25)";
    svgColor = "rgb(0, 0, 0)";
  } else if (backgroundColor === "rgb(21, 32, 43)") {
    textColor = "rgb(247, 249, 249)";
    svgColor = "rgb(139, 152, 165)";
  } else if (backgroundColor === "rgb(0, 0, 0)") {
    textColor = "rgb(231, 233, 234)";
    svgColor = "rgb(113, 118, 123)";
  }

  if ($select) {
    $select.style.color = textColor;
    $select.style.backgroundColor = backgroundColor;
  }

  if ($svg) {
    $svg.setAttribute("fill", svgColor);
  }

  const $options = $select.querySelectorAll("option");
  $options.forEach(($option) => {
    $option.style.color = textColor;
    $option.style.backgroundColor = backgroundColor;
  });
}

function initialize() {
  document.documentElement.setAttribute("dir", "ltr");
  loadUserPreferences();
  addReplySortSelectorToNav();

  const observer = new MutationObserver(() => {
    adjustColors();
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["style"],
  });
  debugLog("Initialization complete");
}

initialize();
