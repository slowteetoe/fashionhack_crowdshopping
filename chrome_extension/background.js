
console.log("LOADED THIS SHTI");
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var image_url;

// The onClicked callback function.
function onClickHandler(info, tab) {
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
  chrome.extension.sendMessage(info.srcUrl);
  window.showModalDialog("popup.html");
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
      title: "Show us how to buy this!!!",
      contexts:["image"],
      "id": "somethingrandom"
  });
});

chrome.extension.onMessage.addListener(function(msg) { 

  console.log("Attempting to handle " + msg);
  image_url = msg;

}); 

function getPageInfo(){
  alert("Returning data from getPageInfo " + image_url);
  return image_url;
}