// background.js

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
  return browser.storage.local.get("userPreferences").then((result) => {
    if (result.userPreferences) {
      userPreferences = result.userPreferences;
      debugLog("Loaded user preferences:", userPreferences);
    }
  });
}

function modifyQueryString(url) {
  try {
    let urlObj = new URL(url);
    let params = urlObj.searchParams;

    if (params.has("variables")) {
      let variables = JSON.parse(decodeURIComponent(params.get("variables")));

      debugLog(`Setting rankingMode to '${userPreferences.replySort}'`);
      variables.rankingMode =
        userPreferences.replySort.charAt(0).toUpperCase() +
        userPreferences.replySort.slice(1);

      params.set("variables", JSON.stringify(variables));
      debugLog(`Modified URL: ${urlObj.toString()}`);
      return urlObj.toString();
    }

    debugLog("No modifications needed.");
    return url;
  } catch (e) {
    console.error("Error modifying URL:", e);
    return url;
  }
}

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    debugLog(`Intercepted request: ${details.url}`);

    if (details.method !== "GET") {
      debugLog("Request method is not GET, ignoring.");
      return {};
    }

    const targetPattern = "https://x.com/i/api/graphql/QuBlQ6SxNAQCt6-kBiCXCQ/";

    if (details.url.startsWith(targetPattern)) {
      const modifiedUrl = modifyQueryString(details.url);
      if (modifiedUrl !== details.url) {
        debugLog(`Redirecting to modified URL: ${modifiedUrl}`);
        return { redirectUrl: modifiedUrl };
      }
    }

    return {};
  },
  { urls: ["*://x.com/i/api/graphql/QuBlQ6SxNAQCt6-kBiCXCQ/*"] },
  ["blocking"]
);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updatePreferences") {
    debugLog("Updating preferences:", message.preferences);
    userPreferences = message.preferences;
    browser.storage.local.set({ userPreferences: message.preferences });
  }
});

loadUserPreferences();
