import Vue from 'vue'
import VueI18n from 'vue-i18n'
// element语言库
import ElementLocal from 'element-ui/lib/locale'
import elementEnLocale from 'element-ui/lib/locale/lang/en'     // 英文
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'  // 中文
import elementItLocale from 'element-ui/lib/locale/lang/it'     // 意大利语
import elementFrLocale from 'element-ui/lib/locale/lang/fr'     // 法语
import elementDeLocale from 'element-ui/lib/locale/lang/de'     // 德语
import elementEsLocale from 'element-ui/lib/locale/lang/es'     // 西班牙语
import elementCaLocale from 'element-ui/lib/locale/lang/ca'     // 加泰罗尼亚语
// 自定义语言库
import enLocale from './en'  // 英语
import zhLocale from './zh'  // 中文
import itLocale from './it'  // 意大利语
import frLocale from './fr'  // 法语
import deLocale from './de'  // 德语
import esLocale from './es'  // 西班牙语
import caLocale from './ca'  // 加泰罗尼亚语

Vue.use(VueI18n)

const messages = {
    'en': {
        ...enLocale,
        ...elementEnLocale
    },
    'zh': {
        ...zhLocale,
        ...elementZhLocale
    },
    'it': {
        ...itLocale,
        ...elementItLocale
    },
    'fr': {
        ...frLocale,
        ...elementFrLocale
    },
    'de': {
        ...deLocale,
        ...elementDeLocale
    },
    'es': {
        ...esLocale,
        ...elementEsLocale
    },
    'ca': {
        ...caLocale,
        ...elementCaLocale
    }
}

ElementLocal.i18n((key, value) => i18n.t(key, value))

// 获取语言
function getLanguage () {
    let userLanguage = navigator.language || navigator.userLanguage;//常规浏览器语言和IE浏览器
    if (!language) {
        return 'en'
    }
    let langStr = userLanguage.slice(0, 2);//截取lang前2位字符
    let defaultLang = ''
    switch (langStr) {
        case 'zh':
            defaultLang = 'zh'
            break;
        case 'en':
            defaultLang = 'en'
            break;
        case 'it':
            defaultLang = 'it'
            break;
        case 'fr':
            defaultLang = 'fr'
            break;
        case 'de':
            defaultLang = 'de'
            break;
        case 'es':
            defaultLang = 'es'
            break;
        case 'ca':
            defaultLang = 'ca'
            break;
        default:
            defaultLang = 'en'
    }
    return defaultLang
}

let language = localStorage.getItem('Language')
if (!language) {
    language = getLanguage()
    localStorage.setItem('Language', language)
}

const i18n = new VueI18n({
    locale: language,  // set locale
    messages // set locale messages
})

export default i18n

