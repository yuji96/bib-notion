console.log("openreview.ts");

chrome.runtime.onMessage.addListener((_request, _sender, respond) => {
  const dataContent = JSON.parse(
    document.getElementById("__NEXT_DATA__")?.innerText as string
  ).props.pageProps.forumNote.content;
  // console.log(dataContent);

  let author, booktitle;
  const title = document
    .querySelector("meta[name='citation_title']")
    ?.getAttribute("content");
  if (dataContent.authors instanceof Array) {
    author = dataContent.authors.join(", ");
  } else {
    author = dataContent.authors.value.join(", ");
  }
  // accept/regect, main/workshop などが混ざりまくってる
  if (dataContent.authors instanceof String) {
    booktitle = dataContent.venue;
  } else {
    booktitle = dataContent.venue.value;
  }
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
