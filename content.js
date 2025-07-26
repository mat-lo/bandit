chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readClipboard") {
    (async () => {
      try {
        const clipboardItems = await navigator.clipboard.read();

        for (const item of clipboardItems) {
          if (item.types.includes("text/html")) {
            const blob = await item.getType("text/html");
            const htmlText = await blob.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const img = doc.querySelector("img");

            if (!img) {
              sendResponse({ success: false, error: "No <img> found." });
              return;
            }

            const src = img.getAttribute("src");
            if (!src) {
              sendResponse({ success: false, error: "No src attribute." });
              return;
            }

            if (src) {
              sendResponse({ success: true, src });
              return;
            }
          }
        }

        sendResponse({
          success: false,
          error: "No HTML content in clipboard.",
        });
      } catch (err) {
        sendResponse({
          success: false,
          error: "Clipboard error: " + err.message,
        });
      }
    })();

    return true; // Keep message channel open for async response
  }
});
