import { Client } from "@notionhq/client";

console.log("Hello from background.ts");

// TODO: url で action の enabled を切り替えたい
// TODO: 成功・失敗通知をしたい
// TODO: 重複登録を防ぎたい

chrome.action.onClicked.addListener(async (tab) => {
  console.log("clicked");

  if (tab.id === undefined) return;

  console.log("send message");
  // TODO: catch error
  const info = await chrome.tabs.sendMessage(tab.id, {});
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
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
});
