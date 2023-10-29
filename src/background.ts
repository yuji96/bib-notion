import { BibLatexParser } from "biblatex-csl-converter";

console.log("Hello from background.ts");

// TODO: url で action の enabled を切り替えたい
// TODO: async/await にしたい

chrome.action.onClicked.addListener((tab) => {
  console.log("clicked");

  if (tab.id === undefined) return;

  console.log("send message");
  chrome.tabs.sendMessage(tab.id, { message: "hello" }).then((bibtex) => {
    console.log(bibtex);
    const parser = new BibLatexParser(bibtex);
    const parsed = parser.parse();
    const info: any = parsed.entries[1].fields;

    // "family, given" -> "given family"
    const author_reversed: string = info.author
      .map((name: any) => `${name.given[0].text} ${name.family[0].text}`)
      .join(", ");

    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
      console.log(
        info.title[0].text,
        author_reversed,
        info.booktitle[0].text,
        info.date,
        info.url,
        tabs[0].url
      );

      const options = {
        method: "POST",
        mode: "cors" as RequestMode,
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          accept: "application/json",
          "Notion-Version": "2022-06-28",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          parent: { database_id: DATABASE_ID! },
          properties: {
            Title: { title: [{ text: { content: info.title[0].text } }] },
            "Author(s)": {
              rich_text: [{ type: "text", text: { content: author_reversed } }],
            },
            Booktitle: {
              rich_text: [
                { type: "text", text: { content: info.booktitle[0].text } },
              ],
            },
            Year: { number: parseInt(info.date) }, // year のみとは限らないかもしれない
            PDF: { url: info.url },
            URL: { url: tabs[0].url },
          },
        }),
      };

      fetch("https://api.notion.com/v1/pages", options)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => console.error(err));
    });
  });
});
