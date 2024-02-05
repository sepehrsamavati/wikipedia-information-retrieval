export const persianToEnglishDigits = (text: string) => text.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

export const removeWikiReferences = (text: string) => text.replaceAll(/.\[[0-9]+\]/g, '.');

export const halfSpaceToFullSpace = (text: string) => text.replaceAll(/\u200c/g, ' ');

const ignoreList = ["اگر", "اما", "پس", "تا", "چون", "چه", "خواه", "زیرا", "که", "لیکن", "نه", "نیز", "و", "ولی", "هم", "یا", "همچنین", 'تاکنون', 'است'];
export const removeIgnoredWords = (words: string[]) => words.filter(word => !ignoreList.includes(word));

export const removeDiacritics = (text: string) => text.replaceAll(/(ّ|َ|ِ|ُ|ً|ٍ|ٌ|ْ|ء)/g, '').replaceAll(/(إ|أ)/g, 'ا').replaceAll(/(ي|ئ)/g, 'ی').replaceAll(/ؤ/g, 'و').replaceAll(/ك/g, 'ک').replaceAll(/(ۀ|ة)/g, 'ه');

export const extractPersianWords = (text: string) => [...(text.match(/[آ-ی]+/g,) ?? [])];
