import { DEFAULT_LOCALE, normalizeLocale, withLocaleUrl } from './locales.js';

const footerContentByLocale = {
  en: {
    title: 'Agent Analytics',
    description: 'Agent-ready analytics for builders who ship fast.',
    tagline: 'Open source under MIT.',
    product: 'Product',
    compare: 'Compare',
    company: 'Company',
    legal: 'Legal',
    dashboard: 'Dashboard',
    blog: 'Blog',
    docs: 'Docs',
    github: 'GitHub',
    openorchestrators: 'OpenOrchestrators',
    clawflows: 'Clawflows',
    contact: 'Contact',
    support: 'Support',
    privacy: 'Privacy',
    terms: 'Terms',
    dpa: 'DPA',
  },
  he: {
    title: 'Agent Analytics',
    description: 'אנליטיקה שסוכני AI יכולים לקרוא, לנתח ולפעול לפיה.',
    tagline: 'נבנה למפתחים ולצוותים שבונים מהר. קוד פתוח ברישיון MIT.',
    product: 'מוצר',
    compare: 'השוואה',
    company: 'חברה',
    legal: 'משפטי',
    dashboard: 'לוח בקרה',
    blog: 'בלוג',
    docs: 'תיעוד',
    github: 'GitHub',
    openorchestrators: 'OpenOrchestrators',
    clawflows: 'Clawflows',
    contact: 'יצירת קשר',
    support: 'תמיכה',
    privacy: 'פרטיות',
    terms: 'תנאים',
    dpa: 'DPA',
  },
  zh: {
    title: 'Agent Analytics',
    description: '为快速交付的构建者打造的智能代理分析。',
    tagline: '为快速交付的构建者打造。MIT 开源许可。',
    product: '产品',
    compare: '对比',
    company: '公司',
    legal: '法律',
    dashboard: '仪表盘',
    blog: '博客',
    docs: '文档',
    github: 'GitHub',
    openorchestrators: 'OpenOrchestrators',
    clawflows: 'Clawflows',
    contact: '联系我们',
    support: '支持',
    privacy: '隐私',
    terms: '条款',
    dpa: 'DPA',
  },
};

function compareSection() {
  return {
    links: [
      {
        href: 'https://agentanalytics.sh/compare/umami',
        label: 'vs Umami',
        trackingId: 'footer_compare_umami',
      },
      {
        href: 'https://agentanalytics.sh/compare/mixpanel',
        label: 'vs Mixpanel',
        trackingId: 'footer_compare_mixpanel',
      },
      {
        href: 'https://agentanalytics.sh/compare/amplitude',
        label: 'vs Amplitude',
        trackingId: 'footer_compare_amplitude',
      },
      {
        href: 'https://agentanalytics.sh/compare/ga4',
        label: 'vs GA4',
        trackingId: 'footer_compare_ga4',
      },
      {
        href: 'https://agentanalytics.sh/compare/heap',
        label: 'vs Heap',
        trackingId: 'footer_compare_heap',
      },
      {
        href: 'https://agentanalytics.sh/compare/adobe-analytics',
        label: 'vs Adobe Analytics',
        trackingId: 'footer_compare_adobe_analytics',
      },
    ],
  };
}

export const footerContent = footerContentByLocale;

export function getFooter(locale = DEFAULT_LOCALE) {
  const normalized = normalizeLocale(locale);
  const current = footerContentByLocale[normalized] || footerContentByLocale.en;

  const sections = [
    {
      title: current.product,
      links: [
        {
          href: 'https://app.agentanalytics.sh',
          label: current.dashboard,
          trackingId: 'footer_product_dashboard',
        },
        {
          href: withLocaleUrl('https://blog.agentanalytics.sh', normalized, '/'),
          label: current.blog,
          trackingId: 'footer_product_blog',
        },
        {
          href: withLocaleUrl('https://docs.agentanalytics.sh', normalized, '/'),
          label: current.docs,
          trackingId: 'footer_product_docs',
        },
        {
          href: 'https://github.com/Agent-Analytics/agent-analytics',
          label: current.github,
          external: true,
          trackingId: 'footer_product_github',
        },
        {
          href: 'https://openorchestrators.org/',
          label: current.openorchestrators,
          external: true,
          trackingId: 'footer_product_openorchestrators',
        },
        {
          href: 'https://clawflows.com/',
          label: current.clawflows,
          external: true,
          trackingId: 'footer_product_clawflows',
        },
      ],
    },
    {
      title: current.company,
      links: [
        {
          href: 'https://x.com/analytics_90590',
          label: 'X',
          external: true,
          trackingId: 'footer_company_x',
        },
        {
          href: 'mailto:contact@agentanalytics.sh',
          label: current.contact,
          trackingId: 'footer_company_contact',
        },
        {
          href: 'mailto:support@agentanalytics.sh',
          label: current.support,
          trackingId: 'footer_company_support',
        },
      ],
    },
    {
      title: current.legal,
      links: [
        {
          href: 'https://agentanalytics.sh/privacy',
          label: current.privacy,
          trackingId: 'footer_legal_privacy',
        },
        {
          href: 'https://agentanalytics.sh/terms',
          label: current.terms,
          trackingId: 'footer_legal_terms',
        },
        {
          href: 'https://agentanalytics.sh/dpa',
          label: current.dpa,
          trackingId: 'footer_legal_dpa',
        },
      ],
    },
  ];

  if (normalized === DEFAULT_LOCALE) {
    sections.splice(1, 0, {
      title: current.compare,
      links: compareSection().links,
    });
  }

  return {
    title: current.title,
    description: current.description,
    copy: current.tagline,
    logoAlt: 'Agent Analytics',
    logoSrc: '/logo-v2-96.png',
    logoWidth: 96,
    logoHeight: 76,
    sections,
  };
}

export const footerSections = getFooter(DEFAULT_LOCALE).sections;
export const footerLinks = footerSections.flatMap((section) => section.links);
export const footerDescription = getFooter(DEFAULT_LOCALE).description;
export const footerCopy = getFooter(DEFAULT_LOCALE).copy;
export const footerLogoSrc = getFooter(DEFAULT_LOCALE).logoSrc;
export const footerLogoAlt = getFooter(DEFAULT_LOCALE).logoAlt;
export const footerTitle = getFooter(DEFAULT_LOCALE).title;

export default getFooter(DEFAULT_LOCALE);
