chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled');
});
// chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ['content.js']
//     });
// });
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
    title: 'New memo',
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

// var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
//     'onCommitted', 'onCompleted', 'onDOMContentLoaded',
//     'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
//     'onHistoryStateUpdated'];

// eventList.forEach(function (e) {
//     chrome.webNavigation[e].addListener(function (data) {
//         if (typeof data)
//             console.log(e);
//         else
//             console.error(e);
//     });
// });