# AutoSortXReplies

AutoSortXReplies is an add-on for Firefox and Chrome that automatically sorts replies in Twitter threads by relevance, likes, or recency, helping you easily navigate conversations.

## Features

- Automatically sort Twitter replies based on relevance.
- Saves preferences.
- Available for both Firefox and Chrome.
- Available for Android firefox browser

---

## 📥 Download

<p align="center">
  <a href="https://addons.mozilla.org/en-GB/firefox/addon/autosortxreplies/">
    <img src="https://img.shields.io/amo/v/autosortxreplies?label=Download%20Firefox&logo=Firefox-Browser&style=for-the-badge" alt="Get AutoSortXReplies for Firefox">
  </a>
  <br>
 <a href="https://github.com/RoyRiv3r/AutoSortXReplies/releases/download/1.1.0/AutoSortXRepliesChrome1.1.0.zip">
    <img src="https://img.shields.io/github/downloads/RoyRiv3r/AutoSortXReplies/latest/AutoSortXRepliesChrome.zip?style=for-the-badge&logo=GoogleChrome&label=DOWNLOAD%20CHROME&color=blue" alt="Get AutoSortXReplies for Chrome">
  </a>
  <p align="center"><b>⚠️ Fair warning</b> for Chrome users: The extension will not auto-update. Please check the repo for updates regularly.</p>
</p>

## 🖼️ Screenshots

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/d7362546-5987-4ccd-98fb-249856a63447" alt="Screenshot1" width="400"/></td>
    <td><img src="https://github.com/user-attachments/assets/9eaa9a17-ed1b-4828-9184-dbf3da8f87b2" alt="Screenshot2" width="400"/></td>
  </tr>
</table>

---

## 🚨 Why We Need Manifest V2

Chrome has deprecated support for **Manifest V2** by default, which limits certain functionalities necessary for **AutoSortXReplies** to work properly:

- **Network Request Interception**: In **Manifest V3**, the `webRequest API` has been significantly restricted, making it difficult to intercept and modify network requests. AutoSortXReplies relies on the ability to track and sort replies on platforms like X/Twitter, which requires full network request interception that only **Manifest V2** can provide.

### How to Enable Manifest V2 in Chrome

To ensure **AutoSortXReplies** works correctly, you can manually enable support for Manifest V2 in Chrome (or switch to a more serious browser):

For more details, refer to the full tutorial [here](https://gist.github.com/velzie/053ffedeaecea1a801a2769ab86ab376).

---

## Installation Instructions

### Firefox

1. Click the button above to install directly from the [Firefox Add-ons page](https://addons.mozilla.org/en-GB/firefox/addon/autosortxreplies/).

### Chrome

1. Download the extension from the link provided above.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** and select the extracted `folder`.

---

## Contributing

Feel free to submit issues or pull requests on the [GitHub repository](https://github.com/RoyRiv3r/AutoSortXReplies).

<div align="center">
  <a href="https://ko-fi.com/royriver" target="_blank">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="ko-fi" />
  </a>
</div>
