console.log("Hello from neurips.ts");

chrome.runtime.onMessage.addListener((_request, _sender, respond) => {
  const title = document.querySelector(
    "body > div.container-fluid > div > h4:nth-child(1)"
  )?.textContent;
  const author = document.querySelector(
    "body > div.container-fluid > div > p:nth-child(6) > i"
  )?.textContent;
  const booktitle = "NeurIPS";
  const year = parseInt(window.location.pathname.split("/")[3]);
  const pdf = (
    document.querySelector(
      "body > div.container-fluid > div > div > a:nth-child(3)"
    ) as HTMLAnchorElement
  ).href;
  const url = window.location.href;

  console.log({ title, author, booktitle, year, pdf, url });
  respond({ title, author, booktitle, year, pdf, url });

  return true;
});
