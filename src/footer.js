export const footerSections = [
  {
    title: 'Product',
    links: [
      {
        href: 'https://app.agentanalytics.sh',
        label: 'Dashboard',
        trackingId: 'footer_product_dashboard',
      },
      {
        href: 'https://blog.agentanalytics.sh',
        label: 'Blog',
        trackingId: 'footer_product_blog',
      },
      {
        href: 'https://docs.agentanalytics.sh',
        label: 'API Docs',
        trackingId: 'footer_product_docs',
      },
      {
        href: 'https://github.com/Agent-Analytics/agent-analytics',
        label: 'GitHub',
        external: true,
        trackingId: 'footer_product_github',
      },
    ],
  },
  {
    title: 'Compare',
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
  },
  {
    title: 'Company',
    links: [
      {
        href: 'https://x.com/analytics_90590',
        label: 'X',
        external: true,
        trackingId: 'footer_company_x',
      },
      {
        href: 'mailto:contact@agentanalytics.sh',
        label: 'Contact',
        trackingId: 'footer_company_contact',
      },
      {
        href: 'mailto:support@agentanalytics.sh',
        label: 'Support',
        trackingId: 'footer_company_support',
      },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        href: 'https://agentanalytics.sh/privacy',
        label: 'Privacy',
        trackingId: 'footer_legal_privacy',
      },
      {
        href: 'https://agentanalytics.sh/terms',
        label: 'Terms',
        trackingId: 'footer_legal_terms',
      },
      {
        href: 'https://agentanalytics.sh/dpa',
        label: 'DPA',
        trackingId: 'footer_legal_dpa',
      },
    ],
  },
];

export const footerLinks = footerSections.flatMap((section) => section.links);

export const footerCopy = 'Built for builders who ship fast. Open source under MIT.';
export const footerDescription = 'Agent-ready analytics for builders who ship fast.';

export const footerLogoSrc = '/logo-v2.png';
export const footerLogoAlt = 'Agent Analytics';
export const footerTitle = 'Agent Analytics';

export default {
  copy: footerCopy,
  description: footerDescription,
  links: footerLinks,
  logoAlt: footerLogoAlt,
  logoSrc: footerLogoSrc,
  sections: footerSections,
  title: footerTitle,
};
