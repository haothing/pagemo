import en from 'src/i18n/en'
import ja from 'src/i18n/ja'
import zh from 'src/i18n/zh'

const language = {
    'en': en,
    'ja': ja,
    'zh': zh
}
function getLocale() {
    let msg = ja;
    if (chrome != null && chrome.i18n != null) {
        let locale = chrome.i18n.getUILanguage();
        if (locale.startsWith('en-')) {
            locale = 'en';
        } else if (locale.startsWith('zh-')) {
            locale = 'zh';
        }
        msg = language[locale];
    }
    return msg;
}

export default {
    language: language,
    locale: getLocale()
}