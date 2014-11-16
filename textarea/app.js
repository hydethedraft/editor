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

    function getElementSelection (element) {

        return {
            start: Math.min(element.selectionStart, element.selectionEnd),
            end: Math.max(element.selectionStart, element.selectionEnd)
        };

    }

    function getCurrentLineNum (element) {

        var selection = getElementSelection(element),
            value = element.value,
            lines = value.split(/\n/),
            matches = value.substr(0, selection.start).match(/\n/g) || [];

        return matches.length;

    }

    function getCurrentLineType (line) {

        return line.match(/\s*([\-•])\s*/);

    }

    textarea.addEventListener('keydown', function (e) {

        var selection = getElementSelection(this),
            value = this.value,
            lines = value.split(/\n/),
            selectedValue = value.substr(selection.start, selection.end),
            line,
            currentLine,
            matches;

        if (e.keyCode === 90 && e.metaKey && e.shiftKey) { // Redo

            e.preventDefault();

            if (history[++currentHistoryIndex]) {

                selection = history[currentHistoryIndex].selection;

                value = history[currentHistoryIndex].value;

                localStorage.setItem('content', value);

            } else {

                currentHistoryIndex = history.length - 1;

            }

        } else if (e.keyCode === 90 && e.metaKey && !e.shiftKey) { // Undo

            e.preventDefault();

            if (history[--currentHistoryIndex]) {

                selection = history[currentHistoryIndex].selection;

                value = history[currentHistoryIndex].value;

                localStorage.setItem('content', value);

            } else {

                currentHistoryIndex = 0

            }

        }

        if (e.keyCode === 9) { // Tab

            if (selection.start === selection.end) {

                e.preventDefault();

                value = value.substr(0, selection.start) + "\t" + value.substr(selection.end);

                selection.start = selection.start + 1;
                selection.end = selection.end + 1;

            }

        } else if (e.keyCode === 13) { // Enter

            if (selection.start === selection.end) {

                e.preventDefault();

                currentLine = getCurrentLineNum(this);

                lines.splice(currentLine + 1, 0, getCurrentLineType(lines[currentLine])[0]);

                value = lines.join("\n");

                selection.start = selection.start + 3;
                selection.end = selection.end + 3;

            }

        } else if (e.keyCode === 8) { // Delete

            if (selection.start === selection.end) {

                currentLine = getCurrentLineNum(this);

                matches = lines[currentLine].match(/(\s*)[\-•]\s*/)

                if (matches) {

                    e.preventDefault();

                    lines[currentLine] = matches[1];

                    value = lines.join("\n");

                }

            }

        }

        this.value = value;

        this.setSelectionRange(selection.start, selection.end);

    });

    textarea.addEventListener('keyup', function (e) {

        if (!(e.keyCode === 90 && e.metaKey) && this.value !== history[currentHistoryIndex].value) {

            history.splice(currentHistoryIndex + 1);

            history.push({
                value: this.value,
                selection: getElementSelection(this)
            });

            localStorage.setItem('content', this.value);

            currentHistoryIndex = history.length - 1;

        }

    });

}());
