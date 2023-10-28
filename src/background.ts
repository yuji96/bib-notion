console.log("Hello from background.ts");

// TODO: url で action の enabled を切り替えたい

chrome.action.onClicked.addListener((tab) => {
  console.log("clicked");
  if (tab.id === undefined) return;

  console.log("send message");
  chrome.tabs
    .sendMessage(tab.id, { message: "hello" })
    .then((res) => console.log(res));
});
