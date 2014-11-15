(function () {

    'use strict';

    var history = [],
        currentHistoryIndex = 0,
        textarea = document.querySelector('textarea');

    if (localStorage.getItem('content')) {

        textarea.value = localStorage.getItem('content');

    }

    history.push({
        value: textarea.value,
        selection: {
            start: textarea.value.length,
            end: textarea.value.length
        }
    });

    textarea.addEventListener('keydown', function (e) {

        var selection = {
                start: Math.min(this.selectionStart, this.selectionEnd),
                end: Math.max(this.selectionStart, this.selectionEnd)
            },
            value = this.value,
            selectedValue = this.value.substr(selection.start, selection.end),
            line;

        if (e.keyCode === 90 && e.metaKey && e.shiftKey) { // Redo

            e.preventDefault();

            if (history[++currentHistoryIndex]) {

                selection = history[currentHistoryIndex].selection;

                this.value = history[currentHistoryIndex].value;

            } else {

                currentHistoryIndex = history.length - 1;

            }

        } else if (e.keyCode === 90 && e.metaKey && !e.shiftKey) { // Undo

            e.preventDefault();

            if (history[--currentHistoryIndex]) {

                selection = history[currentHistoryIndex].selection;

                this.value = history[currentHistoryIndex].value;

            } else {

                currentHistoryIndex = 0

            }

        }

        if (e.keyCode === 9) {

            e.preventDefault();

            if (selection.start === selection.end) {

                this.value = value.substr(0, selection.start) + "\t" + value.substr(selection.end);

                selection.start = selection.start + 1;
                selection.end = selection.end + 1;

            }

        }

        this.setSelectionRange(selection.start, selection.end);

    });

    textarea.addEventListener('keyup', function (e) {

        if (!(e.keyCode === 90 && e.metaKey) && this.value !== history[currentHistoryIndex].value) {

            history.splice(currentHistoryIndex + 1);

            history.push({
                value: this.value,
                selection: {
                    start: Math.min(this.selectionStart, this.selectionEnd),
                    end: Math.max(this.selectionStart, this.selectionEnd)
                }
            });

            localStorage.setItem('content', this.value);

            currentHistoryIndex = history.length - 1;

        }

    });

}());
