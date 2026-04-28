import { DEFAULT_LOCALE, localizePath, normalizeLocale, withLocaleUrl } from './locales.js';

const headerData = {
  "en": {
    "brand": {
      "href": "/",
      "logoAlt": "Agent Analytics",
      "logoSrc": "/logo-v2-96.png",
      "logoWidth": 96,
      "logoHeight": 76,
      "subtitle": "Agent-ready analytics",
      "title": "AgentAnalytics"
    },
    "links": [
      {
        "href": "https://blog.agentanalytics.sh/",
        "label": "Blog",
        "trackingId": "nav_blog"
      },
      {
        "href": "https://docs.agentanalytics.sh/",
        "label": "Docs",
        "trackingId": "nav_docs"
      },
      {
        "href": "/#pricing",
        "label": "Pricing",
        "trackingId": "nav_pricing"
      }
    ],
    "cta": {
      "href": "https://app.agentanalytics.sh",
      "label": "Start free",
      "trackingId": "nav_start_free"
    },
    "switcher": {
      "label": "Language",
      "activeLabel": "En",
      "ariaLabel": "English, Language",
      "options": [
        {
          "id": "en",
          "label": "English",
          "nativeLabel": "English",
          "active": true
        },
        {
          "id": "he",
          "label": "Hebrew",
          "nativeLabel": "עברית",
          "active": false
        },
        {
          "id": "zh",
          "label": "Chinese",
          "nativeLabel": "简体中文",
          "active": false
        }
      ]
    }
  },
  "he": {
    "brand": {
      "href": "/he/",
      "logoAlt": "Agent Analytics",
      "logoSrc": "/logo-v2-96.png",
      "logoWidth": 96,
      "logoHeight": 76,
      "subtitle": "אנליטיקה שסוכני AI יכולים לקרוא",
      "title": "AgentAnalytics"
    },
    "links": [
      {
        "href": "https://blog.agentanalytics.sh/he/",
        "label": "בלוג",
        "trackingId": "nav_blog"
      },
      {
        "href": "https://docs.agentanalytics.sh/he/",
        "label": "תיעוד",
        "trackingId": "nav_docs"
      },
      {
        "href": "/he/#pricing",
        "label": "מחירים",
        "trackingId": "nav_pricing"
      }
    ],
    "cta": {
      "href": "https://app.agentanalytics.sh",
      "label": "התחילו בחינם",
      "trackingId": "nav_start_free"
    },
    "switcher": {
      "label": "שפה",
      "activeLabel": "עברית",
      "ariaLabel": "עברית, שפה",
      "options": [
        {
          "id": "en",
          "label": "English",
          "nativeLabel": "English",
          "active": false
        },
        {
          "id": "he",
          "label": "Hebrew",
          "nativeLabel": "עברית",
          "active": true
        },
        {
          "id": "zh",
          "label": "Chinese",
          "nativeLabel": "简体中文",
          "active": false
        }
      ]
    }
  },
  "zh": {
    "brand": {
      "href": "/zh/",
      "logoAlt": "Agent Analytics",
      "logoSrc": "/logo-v2-96.png",
      "logoWidth": 96,
      "logoHeight": 76,
      "subtitle": "面向智能代理的分析",
      "title": "AgentAnalytics"
    },
    "links": [
      {
        "href": "https://blog.agentanalytics.sh/zh/",
        "label": "博客",
        "trackingId": "nav_blog"
      },
      {
        "href": "https://docs.agentanalytics.sh/zh/",
        "label": "文档",
        "trackingId": "nav_docs"
      },
      {
        "href": "/zh/#pricing",
        "label": "价格",
        "trackingId": "nav_pricing"
      }
    ],
    "cta": {
      "href": "https://app.agentanalytics.sh",
      "label": "免费开始",
      "trackingId": "nav_start_free"
    },
    "switcher": {
      "label": "语言",
      "activeLabel": "简体中文",
      "ariaLabel": "简体中文, 语言",
      "options": [
        {
          "id": "en",
          "label": "English",
          "nativeLabel": "English",
          "active": false
        },
        {
          "id": "he",
          "label": "Hebrew",
          "nativeLabel": "עברית",
          "active": false
        },
        {
          "id": "zh",
          "label": "Chinese",
          "nativeLabel": "简体中文",
          "active": true
        }
      ]
    }
  }
};

export const headerLocales = headerData;
export const headerBrand = headerData[DEFAULT_LOCALE].brand;
export const headerLinks = headerData[DEFAULT_LOCALE].links;
export const headerCta = headerData[DEFAULT_LOCALE].cta;
export const headerSwitcher = headerData[DEFAULT_LOCALE].switcher;

export function getHeader(locale = DEFAULT_LOCALE) {
  return headerData[normalizeLocale(locale)] ?? headerData[DEFAULT_LOCALE];
}

export { DEFAULT_LOCALE, localizePath, normalizeLocale, withLocaleUrl };
export default getHeader(DEFAULT_LOCALE);
