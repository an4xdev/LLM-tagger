const textarea = document.querySelector("textarea");
const copyButton = document.querySelector(".copy-button");

function handleInput(event) {
    const lastChar = event.data;
    const text = event.target.value;
    const cursorPos = textarea.selectionStart;

    if (
        lastChar === null &&
        cursorPos > 0 &&
        text.charAt(cursorPos - 1) === "\n"
    ) {
        const prevLineStart = text.lastIndexOf("\n", cursorPos - 2) + 1;
        const prevLineEnd = cursorPos - 1;
        const prevLine = text.substring(prevLineStart, prevLineEnd).trim();

        const isCodeBlock = prevLine.startsWith("```") && prevLine.length > 3;

        if (isCodeBlock) {
            const textBefore = text.substring(0, cursorPos);
            const textAfter = text.substring(cursorPos);
            textarea.value = textBefore + "\n" + "```" + textAfter;

            textarea.setSelectionRange(cursorPos, cursorPos);
        }
    }

    if (lastChar === ">") {
        const openingBracketPos = text.lastIndexOf("<", cursorPos - 2);

        if (openingBracketPos !== -1) {
            const tag = text.substring(openingBracketPos + 1, cursorPos - 1);

            if (!tag.startsWith("/") && !tag.includes(" ")) {
                let lineStart = text.lastIndexOf("\n", openingBracketPos);
                if (lineStart === -1) lineStart = 0;
                else lineStart++;

                let tabCount = 0;
                for (let i = lineStart; i < openingBracketPos; i++) {
                    if (text[i] === "\t") tabCount++;
                    else if (text[i] !== " ") break;
                }

                const closingIndent = "\t".repeat(tabCount + 1);

                const textBefore = text.substring(0, cursorPos);
                const textAfter = text.substring(cursorPos);
                textarea.value =
                    textBefore +
                    `\n${closingIndent}\n${"\t".repeat(tabCount)}</${tag}>` +
                    textAfter;

                const newCursorPos = cursorPos + 1 + closingIndent.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }
        }
    }
}

function handleKeyDown(event) {
    if (event.key === "Tab") {
        event.preventDefault();

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.value =
            textarea.value.substring(0, start) +
            "\t" +
            textarea.value.substring(end);

        textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
}

copyButton.addEventListener("click", function () {
    textarea.select();
    document.execCommand("copy");

    copyButton.textContent = "Copied!";
    copyButton.classList.add("copied");

    setTimeout(function () {
        copyButton.textContent = "Copy";
        copyButton.classList.remove("copied");
    }, 2000);
});

textarea.addEventListener("input", handleInput);
textarea.addEventListener("keydown", handleKeyDown);
