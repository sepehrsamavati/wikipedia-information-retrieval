// @ts-check

document.addEventListener('DOMContentLoaded', () => {
    let lastInput = 0;
    let inputTimer = 0;
    const inputDelay = 500;

    const elements = {
        body: document.querySelector('body'),
        search: document.querySelector('#search'),
        /** @type {HTMLDivElement} */
        // @ts-ignore
        result: document.querySelector('#result'),
        /** @type {HTMLDivElement} */
        // @ts-ignore
        suggestion: document.querySelector('#suggestion'),
        /** @type {HTMLInputElement} */
        // @ts-ignore
        searchInput: document.querySelector('#search input'),
        /** @type {HTMLButtonElement} */
        // @ts-ignore
        submitButton: document.querySelector('#submit-query')
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

    const fetchResult = () => new Promise(resolve => {
        const value = elements.searchInput.value;
        elements.suggestion.innerHTML = '';
        fetch(`/query`, {
            method: "POST",
            body: JSON.stringify({
                queryString: value,
                doPageRank: true
            }),
            headers: {
                'Content-Type': "application/json"
            }
        }).then(r => r.json())
            .then(res => {
                if (res.ok) {
                    showResult(value.split(' '), res);
                }
            }).finally(() => resolve(null));
    });

    /**
     * 
     * @param {string[]} queryWords
     * @param {{
     *  ok: boolean;
     *  retrieveTime: number;
     *  totalCount: number;
     *  result: { content: string; tfIdfScore: number; pageRank: number; score: number; title: string; url: string; }[];
     * }} result 
     */
    const showResult = (queryWords, result) => {
        elements.result.style.display = 'unset';
        elements.result.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');

        const resultInfo = document.createElement('section');
        resultInfo.classList.add('result-info');
        resultInfo.innerHTML = `<b>${result.totalCount}</b> سند در <b>${result.retrieveTime}</b> میلی ثانیه بازیابی شد.`;

        const resultList = document.createElement('div');
        resultInfo.classList.add('result-list');

        result.result.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            const title = document.createElement('div');
            title.classList.add('title');
            title.innerText = item.title;

            const link = document.createElement('a');
            link.classList.add('link');
            link.href = item.url;
            link.innerText = item.url;

            const body = document.createElement('div');
            body.classList.add('body');
            body.innerText = item.content;

            const info = document.createElement('div');
            info.classList.add('info');
            info.innerHTML = `<span>Score: ${item.score}</span>` + `<span>Page rank: ${item.pageRank}</span>` + `<span>TF-IDF Score: ${item.tfIdfScore}</span>`;

            [title, link, body, info].forEach(el => resultItem.append(el));

            resultList.append(resultItem);
        });


        wrapper.append(resultInfo);
        wrapper.append(resultList);

        elements.result.append(wrapper);
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

    elements.submitButton.addEventListener('click', async event => {
        elements.submitButton.disabled = true;
        await fetchResult();
        elements.submitButton.disabled = false;
    });
});