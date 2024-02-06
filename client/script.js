// @ts-check

document.addEventListener('DOMContentLoaded', () => {
    let lastInput = 0;
    let inputTimer = 0;
    const inputDelay = 500;

    const elements = {
        body: document.querySelector('body'),
        search: document.querySelector('#search'),
        result: document.querySelector('#result'),
        /** @type {HTMLDivElement} */
        // @ts-ignore
        suggestion: document.querySelector('#suggestion'),
        /** @type {HTMLInputElement} */
        // @ts-ignore
        searchInput: document.querySelector('#search input'),
    };

    const fetchSuggestions = () => {
        const value = elements.searchInput.value;
        fetch(`/guess?q=${value}`, {
            method: "GET"
        }).then(r => r.json())
            .then(res => {
                if (Array.isArray(res)) {
                    showSuggestions(value, res);
                }
            });
    };

    /**
     * @param {string} searchValue
     * @param {string[]} list
     */
    const showSuggestions = (searchValue, list) => {
        elements.suggestion.innerHTML = '';
        list.forEach(word => {
            const suggestedValue = `${searchValue} ${word}`;
            const row = document.createElement('div');
            row.classList.add('item');
            row.innerText = suggestedValue;
            row.onclick = () => {
                elements.searchInput.value = suggestedValue + ' ';
                elements.searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            };
            elements.suggestion.append(row);
        });
    };

    elements.searchInput.addEventListener('input', event => {
        if (inputTimer) window.clearTimeout(inputTimer);
        inputTimer = window.setTimeout(() => {
            window.clearTimeout(inputTimer);
            fetchSuggestions();
        }, inputDelay);
    });
});