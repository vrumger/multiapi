const fetch = require('node-fetch');

const apiUrl = new URL('https://api.itayki.com');

/**
 * @param {string} path
 * @param {Object} [params]
 */
const getUrl = (path, params) => {
    const url = new URL(path, apiUrl);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            }
        });
    }

    return url;
};

/**
 * Get the list of the supported languages to execute code using tio.run.
 */
const getExecLangs = async () => {
    const res = await fetch(getUrl('/execlangs'));
    const { langs } = await res.json();

    return langs;
};

/**
 * Execute code using tio.run.
 * @param {string} lang the language to execute
 * @param {string} code the code to execute
 */
const execCode = async (lang, code) => {
    if (!lang || !code) {
        return 'please specify the code or the language';
    }

    const res = await fetch(
        getUrl('/exec', {
            lang,
            code,
        }),
    );
    const data = await res.json();

    if ('Errors' in data) {
        return `Language: ${data.Language}\n\nCode: ${data.Code}\n\nResults: ${data.Results}\n\nErrors: ${data.Errors}`;
    } else if ('Stats' in data) {
        return `Language: ${data.Language}\n\nCode: ${data.Code}\n\nResults: ${data.Results}\n\nStats: ${data.Stats}`;
    }

    return data.langs;
};

/**
 * Get the text from the image.
 * @param {string} url the url of the image
 */
const ocr = async url => {
    if (!url) {
        return 'please specify the url';
    }

    const res = await fetch(getUrl('/ocr', { url }));
    const data = await res.json();

    if ('ocr' in data) {
        return `ocr: ${data.ocr}`;
    } else if ('error' in data) {
        return `Error: ${data.error}`;
    }
};

/**
 * Translate the specified text.
 * @param {string} text the text to translate
 * @param {string} [fromLang] the language code of the text to translate (default: auto detect)
 * @param {string} [toLang=en] the language code of the translated text (the output text) (default: english)
 */
const translate = async (text, fromLang, toLang = 'en') => {
    if (!text) {
        return 'please specify the text';
    }

    const res = await fetch(
        getUrl('/tr', {
            text,
            fromlang: fromLang,
            lang: toLang,
        }),
    );
    const data = await res.json();

    if ('error' in data) {
        return data;
    }

    return `Text: ${data.text}\n\nFrom language: ${data.from_language}\n\nTo language: ${data.to_language}`;
};

/**
 * Get the results from urban dictionary api.
 * @param {string} query the query to search
 */
const urban = async query => {
    if (!query) {
        return 'please specify the query';
    }

    const res = await fetch(getUrl('/ud', { query }));
    const data = await res.json();

    return data.results;
};

/**
 * Returns a screenshot of the specified site.
 * @param {string} url the url of the site to screenshot
 * @param {number} [width=1280] the width of the screenshot (default: 1280)
 * @param {number} [height=720] the height code of the screenshot (default: 720)
 */
const webshot = async (url, width = 1280, height = 720) => {
    if (!url) {
        return 'please specify the url';
    }

    const res = await fetch(
        getUrl('/print', {
            url,
            width,
            height,
        }),
    );

    try {
        const data = await res.clone().json();

        if ('error' in data) {
            return `Error: ${data.error}`;
        }
    } catch (error) {
        return await res.buffer();
    }
};

/**
 * Returns a random number from the min parameter to the max parameter.
 * @param {number} [min=1] the minimum number (default: 1)
 * @param {number} [max=100] the maximum number (default: 100)
 */
const randomNumber = async (min = 1, max = 100) => {
    if (!min || !max) {
        return 'please specify the min and max';
    }

    const res = await fetch(getUrl('/random', { min, max }));
    const data = await res.json();

    return data.number;
};

/**
 * Search python packages on pypi.
 * @param {string} packageName the name of the package
 */
const pypiSearch = async packageName => {
    if (!packageName) {
        return 'please specify the package name';
    }

    const res = await fetch(getUrl('/pypi', { package: packageName }));
    const data = await res.json();

    return data;
};

/**
 * Paste the text in nekobin.com.
 * @param {string} content the text to paste
 * @param {string} [title] the title
 * @param {string} [author] the author
 */
const paste = async (content, title, author) => {
    if (!content) {
        return 'please specify the content';
    }

    const res = await fetch(getUrl('/paste', { content, title, author }));
    const data = await res.json();

    return data;
};

/**
 * Get the paste data from nekobin.com.
 * @param {string} paste the paste
 */
const getPaste = async paste => {
    if (!paste) {
        return 'please specify the paste';
    }

    const res = await fetch(getUrl('/get_paste', { paste }));
    const data = await res.json();

    return data;
};

module.exports = {
    getExecLangs,
    execCode,
    ocr,
    translate,
    urban,
    webshot,
    randomNumber,
    pypiSearch,
    paste,
    getPaste,
};
