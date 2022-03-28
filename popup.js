// Initialize butotn with users's prefered color
//let clearMemo = document.getElementById("clearMemo");
$("#clearPageMemo").on("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.remove([tab.url]);
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: clearPageMemo,
    });
});

$("#clearAllMemo").on("click", async () => {
    chrome.storage.sync.clear();
});

function clearPageMemo() {
    $(".pagemo-memo").remove();
}
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
