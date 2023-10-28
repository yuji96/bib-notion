console.log("Hello from neurips.ts");

chrome.runtime.onMessage.addListener((request, _, respond) => {
  console.log(request.message);

  const bibtexBtn = document.querySelector(
    "body > div.container-fluid > div > div > a:nth-child(1)"
  );
  if (bibtexBtn instanceof HTMLAnchorElement) {
    console.log(bibtexBtn.href);
  }

  respond("pong");

  // 送信データの内容に応じて処理を分岐できる
  // switch (request.message) {
  //   case "getItems": {
  //     const items = ["Apple", "Orange", "Melon"];
  //     // 送信元へデータを返す
  //     respond(items);
  //     break;
  //   }
  //   default: {
  //     throw new Error(`no action: ${request.action}`);
  //   }
  // }
  return true;
});
