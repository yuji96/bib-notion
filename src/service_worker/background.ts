import { Client } from "@notionhq/client";
import { BibLatexParser } from "biblatex-csl-converter";

console.log("Hello from background.ts");

// TODO: url で action の enabled を切り替えたい
// TODO: 成功・失敗通知をしたい
// TODO: 重複登録を防ぎたい

chrome.action.onClicked.addListener(async (tab) => {
  console.log("clicked");

  if (tab.id === undefined) return;

  console.log("send message");
  const bibtex = await chrome.tabs.sendMessage(tab.id, { message: "hello" });
  console.log(bibtex);

  const parser = new BibLatexParser(bibtex);
  const parsed = parser.parse();
  const info: any = parsed.entries[1].fields;
  // "family, given" -> "given family"
  const author_reversed: string = info.author
    .map((name: any) => `${name.given[0].text} ${name.family[0].text}`)
    .join(", ");

  const [currentTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  console.log(
    info.title[0].text,
    author_reversed,
    info.booktitle[0].text,
    info.date,
    info.url,
    currentTab.url
  );

  const localStrage = await chrome.storage.local.get(["APIToken", "databaseID"]);
  const notion = new Client({ auth: localStrage.APIToken });
  notion.pages
    .create({
      parent: { database_id: localStrage.databaseID! },
      properties: {
        Title: { title: [{ text: { content: info.title[0].text } }] },
        "Author(s)": {
          rich_text: [{ type: "text", text: { content: author_reversed } }],
        },
        Booktitle: {
          rich_text: [{ type: "text", text: { content: info.booktitle[0].text } }],
        },
        Year: { number: parseInt(info.date) }, // year のみとは限らないかもしれない
        URL: { url: currentTab.url! },
        PDF: { url: info.url },
      },
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
});
