(function () {

    'use strict';

    var editable = document.querySelector('.editor .editable');

    // Activate contenteditable
    editable.setAttribute('contenteditable', true);

    // Set event handler on keyup
    editable.addEventListener('keyup', function () {

        // Destroy any empty nodes within editable area when all text is removed.
        if (!editable.innerText.trim()) {

            editable.innerHTML = '';

        }

    });

}());
