console.log("openreview.ts");

chrome.runtime.onMessage.addListener((_request, _sender, respond) => {
  const title = document
    .querySelector("meta[name='citation_title']")
    ?.getAttribute("content");
  const author = document.querySelector(
    ".note:nth-child(1) .signatures"
  )?.textContent;
  // accept/regect, main/workshop などが混ざりまくってる
  const booktitle = document.querySelector(
    ".note:nth-child(1) .pull-left .item:nth-child(2)"
  )?.textContent;
  const year = parseInt(
    document
      .querySelector("meta[name='citation_publication_date']")
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
