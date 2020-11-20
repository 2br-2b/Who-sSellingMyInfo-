/**
 * Contains functions triggered by clicks, to be inserted into page.
 */

// Add compatibility for Chromuim-based browsers
var browser = browser || chrome;

setTimeout(() => {
    try {
        /**
         * Close notification when 'X' button is clicked.
         */

        document.getElementById('CCPAClose').onclick = function () {
            // console.log("closed")
            var popup = document.getElementById('CCPAPopup');
            var close = document.getElementById('CCPAClose');
            var moreInfo = document.getElementById('CCPAMoreInfo');
            var button = document.getElementById('CCPAButton');
            var checkbox = document.getElementById('CCPAPersistentHidingCheckbox');
            var checkbox_label = document.getElementById('CCPAPersistentHidingCheckboxLabel');
            popup.style.display = 'none';
            close.style.display = 'none';
            moreInfo.style.display = 'none';
            button.style.display = 'none';
            checkbox.style.display = 'none';
            checkbox_label.style.display = 'none';

            // If the checkbox is checked, add the item to the list of urls
            // not to display the popup on
            if (checkbox.checked) {
                browser.storage.local.get(["x_out_urls"], function (result) {
                    var new_list = result.x_out_urls;
                    new_list.push(window.location.hostname);
                    browser.storage.local.set({"x_out_urls": new_list}, function () { })
                });
            }

        }

        /**
         * Find and click CCPA opt-out link
         */
        document.getElementById('CCPAButton').onclick = function () {
            // console.log("stopped sale of personal info");

            var pageElements = document.getElementsByTagName('*');
            for (var i = 0; i < pageElements.length; i++) {

                // If opt-out link is found, click it.
                if (pageElements[i].innerHTML.toLowerCase().search('do not sell') != -1
                    || pageElements[i].innerHTML.toLowerCase().search('don\'t sell') != -1) {
                    pageElements[i].click();
                }
            }
        }
    } catch (err) {

        if (err.name != "TypeError") {
            console.error(err);
        }
    }
}, 500);
