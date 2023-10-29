console.log("arxiv.ts");

chrome.runtime.onMessage.addListener((_request, _sender, respond) => {
  const title = document
    .querySelector("meta[name='citation_title']")
    ?.getAttribute("content");
  const author = document
    .querySelector("#abs > div.authors")
    ?.textContent!.substring(8); // remove "Authors:"
  const booktitle = "arXiv";
  const year = parseInt(
    document
      .querySelector("meta[name='citation_online_date']")
      ?.getAttribute("content")!
      .split("/")[0]!
  );
  const pdf = document
    .querySelector("meta[name='citation_pdf_url']")
    ?.getAttribute("content");
  const url = window.location.href;

  console.log({ title, author, booktitle, year, pdf, url });
  respond({ title, author, booktitle, year, pdf, url });

  return true;
});
