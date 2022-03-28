let color = '#0000ff';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

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