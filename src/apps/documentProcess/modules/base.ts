export const persianToEnglishDigits = (text: string) => text.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

export const removeWikiReferences = (text: string) => text.replaceAll(/.\[[0-9]+\]/g, '.');

export const halfSpaceToFullSpace = (text: string) => text.replaceAll(/\u200c/g, ' ');

const ignoreList = ["اگر", "اما", "پس", "تا", "چون", "چه", "خواه", "زیرا", "که", "لیکن", "نه", "نیز", "و", "ولی", "هم", "یا", "همچنین", 'تاکنون'];
export const removeIgnoredWords = (words: string[]) => words.filter(word => !ignoreList.includes(word));

export const extractPersianWords = (text: string) => [...(text.match(/[آ-ی]+/g,) ?? [])];
