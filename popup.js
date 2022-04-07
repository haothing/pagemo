// Initialize butotn with users's prefered color
//let clearMemo = document.getElementById("clearMemo");
$("#deletePageNotes").on("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.remove([tab.url]);
    chrome.tabs.sendMessage(tab.id,
        { "exeFun": "clearPageMemo" },
        function (response) {
            window.close();
        })
});

$("#addNewNotes").on("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id,
        { "exeFun": "newMemo" },
        function (response) {
            window.close();
        })
});

$("#showAllNotes").on("click", async () => {
    chrome.runtime.openOptionsPage();
    // chrome.tabs.create({ url: "options/dist/spa/index.html" });
});

// TODO change to buy me a coffee
$("#buyMeACoffee").on("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.get([tab.url], (data) => {
        console.log(data);
    });
});

// When the button is clicked, inject setPageBackgroundColor into current page
// clearMemo.addEventListener("click", async () => {

//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     chrome.storage.sync.remove([tab.url], function () { });
//     // console.log(tab);
//     // chrome.scripting.executeScript({
//     //     target: { tabId: tab.id },
//     //     function: setPageBackgroundColor,
//     // });
// });

// The body of this function will be execuetd as a content script inside the
// current page
// function setPageBackgroundColor() {
//     chrome.storage.sync.get("color", ({ color }) => {
//         document.body.style.backgroundColor = color;
//     });
// }
