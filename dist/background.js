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

// Function to check if the request is the target operation
function isTargetRequest(url) {
  try {
    let urlObj = new URL(url);
    let pathname = urlObj.pathname;

    // Match URLs with pattern: /i/api/graphql/<22-character-code>/TweetDetail
    let match = pathname.match(
      /^\/i\/api\/graphql\/([A-Za-z0-9_-]{22})\/TweetDetail$/
    );

    if (match) {
      let params = urlObj.searchParams;
      if (params.has("variables")) {
        let variables = JSON.parse(decodeURIComponent(params.get("variables")));

        // Check if 'rankingMode' exists in variables
        if ("rankingMode" in variables) {
          return true;
        }
      }
    }
  } catch (e) {
    console.error("Error parsing URL:", e);
  }
  return false;
}

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    debugLog(`Intercepted request: ${details.url}`);

    if (details.method !== "GET") {
      debugLog("Request method is not GET, ignoring.");
      return {};
    }

    if (isTargetRequest(details.url)) {
      const modifiedUrl = modifyQueryString(details.url);
      if (modifiedUrl !== details.url) {
        debugLog(`Redirecting to modified URL: ${modifiedUrl}`);
        return { redirectUrl: modifiedUrl };
      }
    }

    return {};
  },
  {
    urls: [
      "*://x.com/i/api/graphql/*/TweetDetail*",
      "*://mobile.x.com/i/api/graphql/*/TweetDetail*",
    ],
  },
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
