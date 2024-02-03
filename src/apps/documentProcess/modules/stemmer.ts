const whitelist =
    ['کامپیوتر', 'پارامتر', 'فدراسیون', 'میلیون', 'کیلومتر', 'نانومتر', 'میلیمتر',
        'همزمان', 'روزافزون', 'ناگهان', 'باستان', 'دوربین', 'نردبان', 'ریسمان', 'یخبندان', 'پیدایش', 'گوناگون'];

const pluralWhitelist = ['محاسبات', 'بنابراین', 'اطلاعات', 'ادبیات', 'سازمان', 'جایگزین', 'دبیرستان', 'سرزمین', 'میانگین', 'کهکشان'];

const pluralSpecial = ['مبادلات', 'مسابقات', 'مشاهدات', 'مطالعات', 'سیارات'];

const pronounWhitelist = ['افزایش', 'آزمایش', 'گرایش'];

const regex = {
    plural1: { from: /گان$/, to: 'ه' },
    plural2: { from: /(ها|ان|ون|ین|ات)$/, to: '', special: 'ه' },
    comparative1: { from: /تر$/, to: '' },
    pronoun: { from: /(یم|یت|یش|یمان|یتان|یشان)$/, to: '', endsWith: ['ا', 'و'] },

    spec1: { from: /ییان$/, to: '' },
    spec2: { from: /یون$/, to: '', endsWith: ['ی'] },
    spec3: { from: /یی$/, to: '', endsWith: ['ا', 'و'] }
} as const;

const directMap = (word: string) => {
    switch (word) {
        case 'همچنان': return 'همچنین';
        case 'کشفیات': return 'کشف';
        case 'میانشان': return 'میان';
        case 'اختیارمان': return 'اختیار';
        case 'خصوصیات': return 'ویژگی';
        case 'پیرامون': return 'اطراف';
    }
    return null;
};

export default function stemmer(word: string) {
    const hasDirect = directMap(word);
    if (hasDirect)
        return hasDirect;

    if (whitelist.includes(word))
        return word;

    if (regex.plural1.from.test(word))
        return word.replace(regex.plural1.from, regex.plural1.to);

    if (regex.comparative1.from.test(word))
        return word.replace(regex.comparative1.from, regex.comparative1.to);

    if (regex.plural2.from.test(word) && !pluralWhitelist.includes(word)) {
        if (pluralSpecial.includes(word))
            return word.replace(regex.plural2.from, regex.plural2.special);
        return word.replace(regex.plural2.from, regex.plural2.to);
    }

    if (regex.pronoun.from.test(word) && !pronounWhitelist.includes(word)) {
        const newWord = word.replace(regex.pronoun.from, regex.pronoun.to);
        if (regex.pronoun.endsWith.some(chars => newWord.endsWith(chars)))
            return newWord;
    }

    if (regex.spec1.from.test(word))
        return word.replace(regex.spec1.from, regex.spec1.to);

    if (regex.spec2.from.test(word)) {
        const newWord = word.replace(regex.spec2.from, regex.spec2.to);
        if (regex.spec2.endsWith.some(chars => newWord.endsWith(chars)))
            return newWord;
    }

    if (regex.spec3.from.test(word)) {
        const newWord = word.replace(regex.spec3.from, regex.spec3.to);
        if (regex.spec3.endsWith.some(chars => newWord.endsWith(chars)))
            return newWord;
    }

    return word;
}
