// get message from background
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.exeFun) {
            if (request.exeFun === "newMemo") {
                sendResponse({ result: "success" });
                newMemo();
            }

            if (request.exeFun === "initMemo") {
                sendResponse({ result: "success" });
                initMemo();
            }

            if (request.exeFun === "clearPageMemo") {
                sendResponse({ result: "success" });
                initMemo();
            }
        }
    }
);

function newMemo() {
    showEditor(-1);
}

function showEditor(memoIndex) {

    var closeBtn = function (context) {
        var ui = $.summernote.ui;

        // create button
        var button = ui.button({
            contents: '<i class="fa-solid fa-xmark"></i>',
            tooltip: 'Close editor',
            click: function () {
                $(".pagemo-editor-container").summernote('destroy');
                $(".pagemo-editor-container").remove();
            }
        });
        return button.render();   // return button as jquery object
    }

    var textColorBtn = function (context) {
        var ui = $.summernote.ui;
        // create button
        var button = ui.button({
            contents: '<i id="text_color_icon" class="fa-solid fa-palette"></i>',
            tooltip: 'Text color',
            click: function () {
            }
        });

        return button.render();   // return button as jquery object
    }
    var textBgColorBtn = function (context) {
        var ui = $.summernote.ui;
        // create button
        var button = ui.button({
            contents: '<i id="text_bgcolor_icon" class="fa-solid fa-highlighter"></i>',
            tooltip: 'Text background color',
            click: function () {
                // $(".pagemo-editor-container").summernote('destroy');
            }
        });

        return button.render();   // return button as jquery object
    }

    var bgcolorBtn = function (context) {
        var ui = $.summernote.ui;
        // create button
        var button = ui.button({
            contents: '<i id="bgcolor_icon" class="fa-solid fa-paint-roller"></i>',
            tooltip: 'Background color',
            click: function () {
                // $(".pagemo-editor-container").summernote('destroy');
            }
        });

        return button.render();   // return button as jquery object
    }

    let editorDiv = $(".pagemo-editor-container");
    if (editorDiv == null || editorDiv.length == 0) {
        editorDiv = $("<div class='pagemo-editor-container'></div>");
    }
    editorDiv.appendTo($("body"));
    editorDiv.summernote({
        toolbar: [
            ['font', ['bold', 'italic', 'underline', 'strikethrough', 'fontsize']],
            ['color', ['textColor', 'textBgColor', 'bgcolor']],
            ['close', ['close']],
        ],
        buttons: {
            close: closeBtn,
            textColor: textColorBtn,
            textBgColor: textBgColorBtn,
            bgcolor: bgcolorBtn
        },
        height: 700,
        focus: true,
        disableResizeEditor: true,
        disableDragAndDrop: true
    });

    // set custom class name 
    editorDiv.next().addClass("pagemo-editor");
    let pagemoEditor = $(".pagemo-editor");
    pagemoEditor.data("memoIndex", memoIndex);

    // add button
    let btnBar = $("<div class='pagemo-btn-container'></div>");
    let okBtn = $("<button class='pagemo-btn pagemo-btn-ok'>OK</button>");
    //let moveBtn = $("<button class='pagemo-btn pagemo-btn-move'>Move</button>");
    //btnBar.append(moveBtn);
    okBtn.on("click", okBtnClick)
    btnBar.append(okBtn);
    pagemoEditor.append(btnBar);

    $(".note-toolbar", pagemoEditor)[0].addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    let mouseOffset = {}
    function mouseUp() {
        window.removeEventListener('mousemove', divMove, true);
    }
    function mouseDown(e) {
        let div = $(".note-frame");
        mouseOffset = { h: e.clientY - div.position().top, w: e.clientX - div.position().left };
        // set move listener when mouse not be to resize window
        if (mouseOffset.h < div.height() - 20 || mouseOffset.w < div.width() - 20) {
            window.addEventListener('mousemove', divMove, true);
        }
    }
    function divMove(e) {
        var div = $(".note-frame");
        // console.log(mouseOffset, div.height(), div.width())
        div.css({ top: e.clientY - mouseOffset.h, left: e.clientX - mouseOffset.w });
    }

    // init editor position, size, text, background color when memo index is not -1
    if (memoIndex >= 0) {
        const hrefKey = location.href;
        chrome.storage.sync.get([hrefKey], function (result) {
            if (memoIndex >= result[hrefKey].length) {
                return;
            }
            const storageData = result[hrefKey][memoIndex];
            const toolbarHeight = $(".note-toolbar", pagemoEditor)[0].clientHeight;
            $('.note-editable', pagemoEditor).css('background-color', storageData.bgColor);

            pagemoEditor.width(storageData.size.w);
            pagemoEditor.height(storageData.size.h + toolbarHeight);
            pagemoEditor.css("top", storageData.position.top - toolbarHeight);
            pagemoEditor.css("left", storageData.position.left);
            editorDiv.summernote('pasteHTML', storageData.textHtml);

            $(".note-editable", pagemoEditor).children().first().remove();

        });
    }

    // replace icon
    $(".note-icon-bold", pagemoEditor).addClass("fa-solid fa-bold").removeClass("note-icon-bold").css("bold",);
    $(".note-icon-italic", pagemoEditor).addClass("fa-solid fa-italic").removeClass("note-icon-italic");
    $(".note-icon-underline", pagemoEditor).addClass("fa-solid fa-underline").removeClass("note-icon-underline");
    $(".note-icon-strikethrough", pagemoEditor).addClass("fa-solid fa-strikethrough").removeClass("note-icon-strikethrough");

    // setup color picker
    $('#text_color_icon', pagemoEditor).parent().spectrum({
        type: "color",
        showAlpha: false,
        change: function (color) {
            $(".pagemo-editor-container").summernote('foreColor', color);
            $('#text_color_icon').css("color", color);
        }
    });

    $('#text_bgcolor_icon', pagemoEditor).parent().spectrum({
        type: "color",
        showAlpha: false,
        change: function (color) {
            $(".pagemo-editor-container").summernote('backColor', color);
            $('#text_bgcolor_icon').css("color", color);
        }
    });

    $('#bgcolor_icon', pagemoEditor).parent().spectrum({
        type: "color",
        showAlpha: true,
        change: function (color) {
            $('.note-editable').css("background-color", color);
            $('#bgcolor_icon').css("color", color);
        }
    });
}

function okBtnClick() {

    const whOffset = 20;
    const editor = $(".pagemo-editor");
    const bgColor = $('.note-editable', editor).css('background-color');
    const toolbarHeight = $(".note-toolbar", editor)[0].clientHeight;
    const size = {
        w: editor[0].offsetWidth,
        h: editor[0].offsetHeight - toolbarHeight
    };
    const position = { top: editor.position().top + toolbarHeight, left: editor.position().left };
    const textHtml = $(".pagemo-editor-container").summernote('code');

    const hrefKey = location.href;
    chrome.storage.sync.get([hrefKey], function (result) {

        // add new memo when editor's data memoIndex is -1
        let memoIndex = parseInt(editor.data("memoIndex"));
        if (memoIndex == -1) {
            if (!result[hrefKey]) {
                chrome.storage.sync.set({ [hrefKey]: [{ bgColor: bgColor, size: size, position: position, textHtml: textHtml }] });
            } else {
                memoIndex = result[hrefKey].length;
                result[hrefKey].push({ bgColor: bgColor, size: size, position: position, textHtml: textHtml });
                chrome.storage.sync.set({ [hrefKey]: result[hrefKey] });
            }
        } else {
            // edit memoIndex memo when editor's data memoIndex is not -1
            result[hrefKey][memoIndex] = { bgColor: bgColor, size: size, position: position, textHtml: textHtml };
            chrome.storage.sync.set({ [hrefKey]: result[hrefKey] });
        }

        $(".pagemo-editor-container").summernote('destroy');
        $(".pagemo-editor-container").remove();

        // make memo display div
        let memoContainer = $("<div class='pagemo-memo' id='pagemoMemo" + memoIndex + "'></div>");
        memoContainer.appendTo($("body"));

        let memoDiv = $("<div class='pagemo-memo-style'></div>");
        memoDiv.html(textHtml);
        memoDiv.css({
            backgroundColor: bgColor
        });
        memoDiv.appendTo(memoContainer);
        memoContainer.css({
            top: position.top,
            left: position.left,
            width: size.w,
            height: size.h
        });

        memoContainer.on('mousedown', pageMemoMouseDown);
        memoContainer.on('mouseup', pageMemoMouseUp);
        memoContainer.on('dblclick', pageMemoEdit);


    });

}

// set memo to moveable
function pageMemoMouseUp(e) {
    window.removeEventListener('mousemove', pageMemoMove, true);
    $("body").data("pagemoMoveTargetMemo", null);

    // update chrom storage data when mouse up
    let div = $(e.target);
    if (div.hasClass("pagemo-memo-style")) {
        div = div.parent();
    }

    const index = parseInt(div.attr("id").replace("pagemoMemo", ""));
    if (isNaN(index)) {
        return;
    } else {
        const hrefKey = location.href;
        chrome.storage.sync.get([hrefKey], function (result) {
            if ($("#" + div.attr("id")).length === 0 || index >= result[hrefKey].length) {
                return;
            }
            result[hrefKey][index].size = { w: $(".pagemo-memo-style", div).width(), h: $(".pagemo-memo-style", div).height() };
            result[hrefKey][index].position = { top: div.position().top, left: div.position().left };
            chrome.storage.sync.set({ [hrefKey]: result[hrefKey] });
        });
    }

}
function pageMemoMouseDown(e) {
    let div = $(e.target);
    if (div.hasClass("pagemo-memo-style")) {
        div = div.parent();
    }
    let mouseOffset = { h: e.clientY - div.position().top, w: e.clientX - div.position().left };
    div.data("mouseOffset", mouseOffset)
    // set move listener when mouse not be to resize window
    if (mouseOffset.h < div.height() - 10 || mouseOffset.w < div.width() - 10) {
        window.addEventListener('mousemove', pageMemoMove, true);
        $("body").data("pagemoMoveTargetMemo", div);
    }
}
function pageMemoMove(e) {
    var div = $("body").data("pagemoMoveTargetMemo");
    // console.log(mouseOffset, div.height(), div.width())
    div.css({ top: e.clientY - div.data("mouseOffset").h, left: e.clientX - div.data("mouseOffset").w });
}

// set memo editable when double click
function pageMemoEdit(e) {

    let div = $(e.target);
    if (div.hasClass("pagemo-memo-style")) {
        div = div.parent();
    }
    const index = parseInt(div.attr("id").replace("pagemoMemo", ""));
    if (isNaN(index)) {
        return;
    } else {
        showEditor(index);
        div.remove();
    }
}
// init memo div to page
function initMemo() {
    clearPageMemo();
    chrome.storage.sync.get([location.href], function (result) {
        let memos = result[location.href];
        for (let i = 0; memos && i < memos.length; i++) {

            // make memo display div
            let memoContainer = $("<div class='pagemo-memo' id='pagemoMemo" + i + "'></div>");
            memoContainer.appendTo($("body"));
            memoContainer.on('mousedown', pageMemoMouseDown);
            memoContainer.on('mouseup', pageMemoMouseUp);
            memoContainer.on('dblclick', pageMemoEdit);

            memoContainer.css({
                top: memos[i].position.top,
                left: memos[i].position.left,
                width: memos[i].size.w,
                height: memos[i].size.h
            });

            let memoDiv = $("<div class='pagemo-memo-style'></div>");
            memoDiv.appendTo(memoContainer);
            memoDiv.html(memos[i].textHtml);
            memoDiv.css({
                backgroundColor: memos[i].bgColor
            });
        }
    });
}

function clearPageMemo() {
    $(".pagemo-memo").remove();
}

initMemo();