import { Client } from "@notionhq/client";

console.log("Hello from background.ts");

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _updatedTab) => {
  chrome.action.setBadgeText({ text: "" });

  if (changeInfo.status !== "complete") return;
  console.log("updated", _tabId, changeInfo, _updatedTab);

  if (_updatedTab.url === undefined) {
    console.log("disable");
    chrome.action.setIcon({ path: "icons/leaf-gray-32.png" });
  } else {
    console.log("disable");
    chrome.action.setIcon({ path: "icons/leaf-green-32.png" });
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  console.log("activated");
  chrome.action.setBadgeText({ text: "" });

  chrome.tabs.get(tabId).then((tab) => {
    console.log(tab);
    if (tab.url === undefined && tab.pendingUrl === undefined) {
      chrome.action.setIcon({ path: "icons/leaf-gray-32.png" });
      console.log("disable");
    } else {
      console.log("enable");
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
          rich_text: [
            { type: "text", text: { content: info.author.replace(/\n/g, "") } },
          ],
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
