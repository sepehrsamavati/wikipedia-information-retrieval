export const persianToEnglishDigits = (text: string) => text.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

export const removeWikiReferences = (text: string) => text.replaceAll(/.\[[0-9]+\]/g, '.');

export const halfSpaceToFullSpace = (text: string) => text.replaceAll(/\u200c/g, ' ');

export const extractPersianWords = (text: string) => [...(text.match(/[آ-ی]+/g,) ?? [])];
