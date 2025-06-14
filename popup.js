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
});

$("#buyMeACoffee").on("click", async () => {
    // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // chrome.storage.sync.get(null, (data) => {
    //     console.log(data);
    // });
    chrome.tabs.create({ url: "https://www.buymeacoffee.com/innomi" });
});
