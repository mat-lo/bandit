chrome.action.onClicked.addListener(async (tab) => {
  try {
    // 1. Manually inject content.js to ensure it's loaded
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    // 2. Send the message
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "readClipboard",
    });

    if (!response || !response.success) {
      throw new Error(response?.error || "No response from content script.");
    }

    await chrome.downloads.download({
      url: response.src,
      filename: "stolen_pixels.png",
    });
  } catch (err) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "slide bandit error",
      message: err.message,
    });
  }
});
