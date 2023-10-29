console.log("Hello from aclanthology.ts");

chrome.runtime.onMessage.addListener((_request, _sender, respond) => {
  const title = document
    .querySelector("meta[name='citation_title']")
    ?.getAttribute("content");
  console.log(title);
  const author = document.querySelector(".lead")?.textContent;
  const booktitle = document.querySelector("a[href^='/venues']")?.textContent;
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
