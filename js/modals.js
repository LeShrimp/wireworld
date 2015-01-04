/**
 *
 * Created by maxime on 04.01.2015
 *
 * @requires modals.css
 * @requires utils.js
 */

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

//var fragment = create('<div>Hello!</div><p>...</p>');
//// You can use native DOM methods to insert the fragment:
//document.body.insertBefore(fragment, document.body.childNodes[0]);

/**
 * Shows a modal dialog. Style is in modals.css. Modal can have one or two
 * buttons. If no button text is specified defaults to one button with
 * text 'Ok'.
 *
 * Returns 1 if button 1 was clicked, 2 if button 2 was clicked.
 *
 * Example:
 *      showModal({
 *          title: 'Please confirm!',
 *          message: 'Do you really wnat to close this window?',
 *          bt1Text: 'Ok',
 *          bt1Callback: function () { closeWindow(); },
 *          bt2Text: 'Cancel',
 *          bt2Callback: function () { cancel(); }
 *      });
 *
 */
function showModal(paramObj) {
    var bt1Html, bt2Html;

    if (paramObj.hasOwnProperty('bt2Text')) {
        bt1Html = '<span id="button1">' + paramObj.bt1Text + '</span>';
        bt2Html = '<span id="button2">' + paramObj.bt2Text + '</span>';
    } else {
        bt1Html = '<span id="button1" class="centerButton">' + paramObj.bt1Text + '</span>';
        bt2Html = '';
    }

    var fragment = create(
        '<div id="modalDialog">' +
            '<div>' +
                '<h2>' + paramObj.title + '</h2>' +
                paramObj.message +
                '<div id="buttonContainer">' +
                    bt1Html +
                    bt2Html +
                '</div>' +
            '</div>' +
        '</div>'
    );
    document.body.insertBefore(fragment, document.body.nextSibling);

    document.getElementById("button1").addEventListener('click', paramObj.bt1Callback);
    document.getElementById("button2").addEventListener('click', paramObj.bt2Callback);
}

function closeModal() {
    modalEl = document.getElementById('modalDialog');
    modalEl.parentNode.removeChild(modalEl);
}

