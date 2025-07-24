import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

export function initializeI18n(lng = 'en') {
  // 同步初始化配置
  const options = {
    lng,
    fallbackLng: 'en',
    initImmediate: false,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  };

  // 开发环境使用后端加载，生产环境直接嵌入资源
  if (process.env.NODE_ENV === 'development') {
    i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        ...options,
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json'
        }
      });
  } else {
    // 生产环境预加载资源
    const resources = {
      en: { common: require('../public/locales/en/common.json') },
      zh: { common: require('../public/locales/zh/common.json') }
    };
    
    i18n
      .use(initReactI18next)
      .init({
        ...options,
        resources
      });
  }

  return i18n;
}
