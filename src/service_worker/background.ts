import { Client } from "@notionhq/client";

console.log("Hello from background.ts");

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.action.setBadgeText({ text: "" });
  chrome.tabs.get(tabId).then((tab) => {
    if (tab.url === undefined) {
      chrome.action.setIcon({ path: "icons/leaf-gray-32.png" });
    } else {
      chrome.action.setIcon({ path: "icons/leaf-green-32.png" });
    }
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log("clicked");

  if (tab.id === undefined) return;

  console.log("send message");
  // TODO: catch error
  const info = await chrome.tabs.sendMessage(tab.id, {});
  if (info === undefined) {
    chrome.action.setBadgeBackgroundColor({ color: "#FF7F7F" });
    chrome.action.setBadgeText({ text: "ERR" });
    console.error("content script failed");
    return;
  }
  console.log(info);

  const localStrage = await chrome.storage.local.get(["APIToken", "databaseID"]);
  const notion = new Client({ auth: localStrage.APIToken });
  notion.pages
    .create({
      parent: { database_id: localStrage.databaseID! },
      properties: {
        Title: { title: [{ text: { content: info.title } }] },
        "Author(s)": {
          rich_text: [{ type: "text", text: { content: info.author } }],
        },
        Booktitle: {
          rich_text: [{ type: "text", text: { content: info.booktitle } }],
        },
        Year: { number: info.year },
        URL: { url: info.url },
        PDF: { url: info.pdf },
      },
    })
    .then(() => {
      chrome.action.setBadgeBackgroundColor({ color: "#99FF99" });
      chrome.action.setBadgeText({ text: "OK" });
    })
    .catch((error) => {
      chrome.action.setBadgeBackgroundColor({ color: "#FF7F7F" });
      chrome.action.setBadgeText({ text: "ERR" });
      console.error("notion api failed");
      console.error(error);
    });
});
