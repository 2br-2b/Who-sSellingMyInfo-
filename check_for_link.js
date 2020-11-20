/**
 * Content script to detect CCPA opt-out links.  Searches the page for
 * such a link, then displays a notification if found.
 */

// Add compatibility for Chromuim-based browsers
var browser = browser || chrome;

/**
 * Function to display notification
 */
function displayPopup() {

    // Create popup
    var popup = document.createElement('div');
    popup.innerHTML = '<b>This website sells your personal information.  Opt out below. </b>';
    popup.setAttribute('id', 'CCPAPopup');

    // Create 'X' button
    var close = document.createElement('span');
    close.innerHTML = 'x';
    close.setAttribute('id', 'CCPAClose');
    popup.appendChild(close);

    // Create more info link
    var moreInfo = document.createElement('a');
    moreInfo.setAttribute('id', 'CCPAMoreInfo');
    moreInfo.setAttribute('href', browser.runtime.getManifest().homepage_url);
    moreInfo.setAttribute('target', '_blank');
    moreInfo.innerHTML = 'More Info';
    popup.appendChild(moreInfo);

    var newline = document.createElement('br');
    popup.appendChild(newline);

    // Create hide on this website checkbox
    var checkbox = document.createElement('input');
    checkbox.setAttribute('id', 'CCPAPersistentHidingCheckbox');
    checkbox.setAttribute('type', 'checkbox');
    popup.appendChild(checkbox);

    // Add a checkbox label
    var checkbox_label = document.createElement('label');
    checkbox_label.setAttribute('for', 'CCPAPersistentHidingCheckbox');
    checkbox_label.setAttribute('id', 'CCPAPersistentHidingCheckboxLabel');
    checkbox_label.innerHTML = ' Don\'t show again on this page';
    popup.appendChild(checkbox_label);

    // Create button
    var button = document.createElement('button');
    button.setAttribute('id', 'CCPAButton');
    button.innerHTML = "Don't Sell My Personal Information";
    popup.appendChild(button);

    // Add popup to document
    document.getElementsByTagName('BODY')[0].appendChild(popup);


}

/**
 * Main script code: searches page for link, displays notification, sends
 * results back to background script.
 */

// Search page elements for CCPA opt-out link
var pageElements = document.getElementsByTagName('*');
var linkDetected = false;
var linkReference = null;
for (var i = 0; i < pageElements.length; i++) {

    // If opt-out link is found, display notification
    if (pageElements[i].innerHTML.toLowerCase().search('do not sell') != -1
        || pageElements[i].innerHTML.toLowerCase().search('don\'t sell') != -1) {
        linkReference = pageElements[i];
        linkDetected = true;
    }
}


browser.storage.local.get(["x_out_urls"], function (result) {
    var closed = result.x_out_urls == null ? [] : result.x_out_urls;

    // Send search result to background script
    if (linkDetected && closed.indexOf(window.location.hostname) < 0) {
        displayPopup();
        browser.runtime.sendMessage({linkDetected: "yes"});
    }
    else {
        browser.runtime.sendMessage({linkDetected: "no"});
    }
});
