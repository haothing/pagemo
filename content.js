function newMemo() {

    var closeBtn = function (context) {
        var ui = $.summernote.ui;

        // create button
        var button = ui.button({
            contents: '<i class="fa-solid fa-xmark"></i>',
            tooltip: 'Close editor',
            click: function () {
                $(".pagemo-editor-container").summernote('destroy');
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

    //var HTMLstring = '<div><p>Hello, world</p><p>Summernote can insert HTML string</p></div>';
    //editorDiv.summernote('pasteHTML', HTMLstring)

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

    const bgColor = $('.note-editable', $(".pagemo-editor")).css('background-color');
    const size = { w: $(".pagemo-editor").width(), h: $(".pagemo-editor").height() - $(".note-toolbar", $(".pagemo-editor")).height() };
    const position = { top: $(".pagemo-editor").position().top, left: $(".pagemo-editor").position().left };
    const textHtml = $(".pagemo-editor-container").summernote('code');

    const hrefKey = location.href;
    chrome.storage.sync.get([hrefKey], function (result) {

        let memoIndex = 0;
        if (!result[hrefKey]) {
            chrome.storage.sync.set({ [hrefKey]: [{ bgColor: bgColor, size: size, position: position, textHtml: textHtml }] });
        } else {
            memoIndex = result[hrefKey].length;
            result[hrefKey].push({ bgColor: bgColor, size: size, position: position, textHtml: textHtml });
            chrome.storage.sync.set({ [hrefKey]: result[hrefKey] });
        }

        $(".pagemo-editor-container").summernote('destroy');
        $(".pagemo-editor-container").remove();

        // make memo display div
        let memoContainer = $("<div class='pagemo-memo' id='pagemoMemo" + memoIndex + "'></div>");
        memoContainer.appendTo($("body"));
        memoContainer.on('mousedown', pageMemoMouseDown);
        window.addEventListener('mouseup', pageMemoMouseUp, false);

        memoContainer.css({
            top: position.top,
            left: position.left
        });

        let memoDiv = $("<div class='pagemo-memo-style'></div>");
        memoDiv.appendTo(memoContainer);
        memoDiv.html(textHtml);
        memoDiv.css({
            width: size.w,
            height: size.h,
            backgroundColor: bgColor
        });
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
            if (index >= result[hrefKey].length) {
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

// get message from background
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.exeFun && request.exeFun === "newMemo") {
            sendResponse({ result: "success" });
            newMemo();
        }
    }
);

// init memo div to page
chrome.storage.sync.get([location.href], function (result) {
    let memos = result[location.href];
    for (let i = 0; memos && i < memos.length; i++) {

        // make memo display div
        let memoContainer = $("<div class='pagemo-memo' id='pagemoMemo" + i + "'></div>");
        memoContainer.appendTo($("body"));
        memoContainer.on('mousedown', pageMemoMouseDown);
        window.addEventListener('mouseup', pageMemoMouseUp, false);

        memoContainer.css({
            top: memos[i].position.top,
            left: memos[i].position.left
        });

        let memoDiv = $("<div class='pagemo-memo-style'></div>");
        memoDiv.appendTo(memoContainer);
        memoDiv.html(memos[i].textHtml);
        memoDiv.css({
            width: memos[i].size.w,
            height: memos[i].size.h,
            backgroundColor: memos[i].bgColor
        });
    }
});