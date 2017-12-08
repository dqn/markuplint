"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const stripJsonComments = require("strip-json-comments");
const readFile = util.promisify(fs.readFile);
async function default_1(locale, messageTmpl, ...keywords) {
    const localeId = locale.replace(/^([a-z]+).*/i, '$1').toLowerCase();
    const localeSet = await getLocaleSet(localeId);
    let message = messageTmpl;
    if (localeSet) {
        const t = localeSet[messageTmpl];
        if (typeof t === 'string') {
            messageTmpl = t;
        }
    }
    else if (localeId !== 'en') {
        console.warn(`⚠ [markuplint] Undefined "${messageTmpl}" in locale(${locale}) message file`);
    }
    message = messageTmpl.replace(/\{([0-9]+)\}/g, ($0, $1) => {
        const keyword = keywords[+$1] || '';
        if (localeSet) {
            return localeSet.keywords[keyword.toLowerCase()] || keyword;
        }
        return keyword;
    });
    return message;
}
exports.default = default_1;
async function getLocaleSet(localeId) {
    if (localeId === 'en') {
        return null;
    }
    let json;
    try {
        json = await readFile(`${__dirname}/${localeId}.json`, 'utf-8');
    }
    catch (err) {
        console.warn(`⚠ [markuplint] Missing locale message file ${localeId}.json`);
        return null;
    }
    const localeSet = await JSON.parse(stripJsonComments(json));
    return localeSet;
}