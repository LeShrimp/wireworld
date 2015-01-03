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
 */
function showModal(title, text, button1, button2) {
    button1 = (typeof button1 === 'undefined') ? 'Ok' : button1;
    button2 = (typeof button2 === 'undefined') ? false : button2;

    var fragment = create(
        '<div id="openModal" class="modalDialog">' +
            '<div>' +
                '<a href="#close" title="Close" class="close">X</a>' +
                '<h2>' + title + '</h2>' +
                text +
            '</div>' +
        '</div>'
    );
    document.body.insertBefore(fragment, document.body.nextSibling);
}

