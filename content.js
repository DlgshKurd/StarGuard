const badWordsAndEmails = [
    "anything you want to block",
    "@gmail.com",
    "@hotmail.com"
];

function applyStarsOverlay(text) {
    let filteredText = text;
    badWordsAndEmails.forEach(badWordOrEmail => {
        const regex = new RegExp(badWordOrEmail, 'gi');
        filteredText = filteredText.replace(regex, '****');
    });
    return filteredText;
}

function filterContent(element) {
    if (element.nodeType === Node.TEXT_NODE) {
        element.nodeValue = applyStarsOverlay(element.nodeValue);
    } else if (element.nodeType === Node.ELEMENT_NODE) {
        element.childNodes.forEach(filterContent);
    }
}


function observeDOMChanges() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                filterContent(addedNode);
            });
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

function liveFilterInput(event) {
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        target.value = applyStarsOverlay(target.value);
    }
}

function initializeLiveFiltering() {
    document.body.addEventListener('input', liveFilterInput);
    observeDOMChanges();
    filterContent(document.body);
}

window.addEventListener('load', initializeLiveFiltering);