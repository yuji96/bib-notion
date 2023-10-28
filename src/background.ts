import { BibLatexParser } from "biblatex-csl-converter";

console.log("Hello from background.ts");

// TODO: url で action の enabled を切り替えたい

chrome.action.onClicked.addListener((tab) => {
  console.log("clicked");

  if (tab.id === undefined) return;

  console.log("send message");
  chrome.tabs.sendMessage(tab.id, { message: "hello" }).then((bibtex) => {
    console.log(bibtex);
    // let parser = new BibLatexParser(bibtex, {processUnexpected: true, processUnknown: true})
    const parser = new BibLatexParser(bibtex);
    const parsed = parser.parse();
    const info = parsed.entries[1].fields;

    // "family, given" -> "given family"
    const author_reversed = info.author.map(
      (name) => `${name.given[0].text} ${name.family[0].text}`
    );

    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
      console.log(
        info.title[0].text,
        author_reversed,
        info.booktitle[0].text,
        info.date,
        info.url,
        tabs[0].url
      );
    });
  });
});
