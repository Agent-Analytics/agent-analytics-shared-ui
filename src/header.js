import {
  DEFAULT_LOCALE,
  LOCALE_META,
  SUPPORTED_LOCALES,
  localizePath,
  normalizeLocale,
  withLocaleUrl,
} from './locales.js';

const copy = {
  en: {
    subtitle: 'Agent-ready analytics',
    blog: 'Blog',
    docs: 'Docs',
    pricing: 'Pricing',
    startFree: 'Start free',
    language: 'Language',
  },
  he: {
    subtitle: 'אנליטיקה שסוכני AI יכולים לקרוא',
    blog: 'בלוג',
    docs: 'תיעוד',
    pricing: 'מחירים',
    startFree: 'התחילו בחינם',
    language: 'שפה',
  },
  zh: {
    subtitle: '面向智能代理的分析',
    blog: '博客',
    docs: '文档',
    pricing: '价格',
    startFree: '免费开始',
    language: '语言',
  },
};

export const headerCopy = copy;

export function getHeader(locale = DEFAULT_LOCALE) {
  const normalized = normalizeLocale(locale);
  const current = copy[normalized] || copy.en;
  const activeLocale = LOCALE_META[normalized] || LOCALE_META[DEFAULT_LOCALE];
  const activeLabel = normalized === 'en' ? 'En' : activeLocale.nativeLabel;
  const switcher = {
    label: current.language,
    activeLabel,
    ariaLabel: `${activeLocale.nativeLabel}, ${current.language}`,
    options: SUPPORTED_LOCALES.map((localeId) => ({
      id: localeId,
      label: LOCALE_META[localeId].label,
      nativeLabel: LOCALE_META[localeId].nativeLabel,
      active: localeId === normalized,
    })),
  };

  return {
    brand: {
      href: localizePath(normalized, '/'),
      logoAlt: 'Agent Analytics',
      logoSrc: '/logo-v2-96.png',
      logoWidth: 96,
      logoHeight: 76,
      subtitle: current.subtitle,
      title: 'AgentAnalytics',
    },
    links: [
      {
        href: withLocaleUrl('https://blog.agentanalytics.sh', normalized, '/'),
        label: current.blog,
        trackingId: 'nav_blog',
      },
      {
        href: withLocaleUrl('https://docs.agentanalytics.sh', normalized, '/'),
        label: current.docs,
        trackingId: 'nav_docs',
      },
      {
        href: localizePath(normalized, '/#pricing'),
        label: current.pricing,
        trackingId: 'nav_pricing',
      },
    ],
    cta: {
      href: 'https://app.agentanalytics.sh',
      label: current.startFree,
      trackingId: 'nav_start_free',
    },
    switcher,
  };
}

export const headerBrand = getHeader(DEFAULT_LOCALE).brand;
export const headerLinks = getHeader(DEFAULT_LOCALE).links;
export const headerCta = getHeader(DEFAULT_LOCALE).cta;
export const headerSwitcher = getHeader(DEFAULT_LOCALE).switcher;

export default getHeader(DEFAULT_LOCALE);
