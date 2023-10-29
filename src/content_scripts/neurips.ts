console.log("Hello from neurips.ts");

chrome.runtime.onMessage.addListener((request, _, respond) => {
  console.log(request.message);

  const bibtexBtn = document.querySelector(
    "body > div.container-fluid > div > div > a:nth-child(1)"
  );
  if (bibtexBtn instanceof HTMLAnchorElement) {
    fetch(bibtexBtn.href).then((res) => {
      res.text().then((bibtex) => {
        console.log(bibtex);
        respond(bibtex);
      });
    });
  }

  return true;
});
