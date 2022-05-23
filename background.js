chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled');
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    chrome.tabs.sendMessage(details.tabId,
        { "exeFun": "initMemo" },
        function (response) { })
});

// chrome.webNavigation.onCompleted.addListener(function (details) {
//     chrome.tabs.sendMessage(details.tabId,
//         { "exeFun": "initMemo" },
//         function (response) { })
// });

chrome.contextMenus.create({
    title: chrome.i18n.getMessage("popup_menu_new_note"),
    type: 'normal',
    id: '0',
    contexts: ['all']
});
chrome.contextMenus.onClicked.addListener(function (itemData, tab) {
    if (tab && itemData.menuItemId === '0') {
        chrome.tabs.sendMessage(tab.id,
            { "exeFun": "newMemo" },
            function (response) {
                // console.log(response.farewell);
            })
    }
});
