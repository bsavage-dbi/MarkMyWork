// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        // alwaysOnTop: true,
        type: "popup"
    }, function(win) {
        // win represents the Window object from windows API
        // Do something after opening
    });
});
