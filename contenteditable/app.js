(function () {

    'use strict';

    var editable = document.querySelector('.editor .editable');

    // Activate contenteditable
    editable.setAttribute('contenteditable', true);

    if (localStorage.getItem('content')) {

        editable.innerHTML = localStorage.getItem('content');

    }

    // Set event handler on keyup
    editable.addEventListener('keyup', function () {

        localStorage.setItem('content', editable.innerHTML);

        // Destroy any empty nodes within editable area when all text is removed.
        if (editable.childNodes.length === 1 && editable.childNodes[0].nodeName === 'BR') {

            editable.innerHTML = '';

        }

    });

}());
