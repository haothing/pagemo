// set language in popup html
$("#addNewNote").text(chrome.i18n.getMessage("popup_menu_new_note"));
$("#deletePageNotes").text(chrome.i18n.getMessage("popup_menu_delete_page_notes"));
$("#showOptions").text(chrome.i18n.getMessage("popup_menu_show_options"));
$("#buyMeACoffee").text(chrome.i18n.getMessage("popup_menu_buy_me_coffee"));

$("#deletePageNotes").on("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.remove([tab.url]);
    chrome.tabs.sendMessage(tab.id,
        { "exeFun": "clearPageMemo" },
        function (response) {
            window.close();
        })
});

$("#addNewNote").on("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id,
        { "exeFun": "newMemo" },
        function (response) {
            window.close();
        })
});

$("#showOptions").on("click", async () => {
    chrome.runtime.openOptionsPage();
    // chrome.tabs.create({ url: "options/dist/spa/index.html" });
});

// TODO change to buy me a coffee
$("#buyMeACoffee").on("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.get(null, (data) => {
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
