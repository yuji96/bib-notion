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

      const notion = new Client({ auth: NOTION_TOKEN });
      (async () =>
        await notion.pages.create({
          parent: { database_id: DATABASE_ID! },
          properties: {
            Title: { title: [{ text: { content: "title" } }] },
            "Author(s)": {
              rich_text: [{ type: "text", text: { content: "authors" } }],
            },
            Booktitle: { rich_text: [{ type: "text", text: { content: "book" } }] },
            Year: { number: 2021 },
            URL: { url: "url" },
            PDF: { url: "pdf" },
          },
        }))();
    });
  });
});
