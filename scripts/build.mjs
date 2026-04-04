import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_DOMAIN,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
} from '../src/locales.js';
import { getHeader } from '../src/header.js';
import { getFooter } from '../src/footer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const tokensPath = path.join(root, 'tokens.json');

const tokens = JSON.parse(await readFile(tokensPath, 'utf8'));
const localesJs = await readFile(path.join(root, 'src', 'locales.js'), 'utf8');
const headerByLocale = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, getHeader(locale)])
);
const footerByLocale = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, getFooter(locale)])
);

function toCssVars(entries) {
  return entries.map(([key, value]) => `  --${key}: ${value};`).join('\n');
}

function buildTokenEntries(sourceTokens) {
  const tokenSections = [
    ['colors', sourceTokens.colors],
    ['effects', sourceTokens.effects],
    ['recipes', sourceTokens.recipes],
  ];

  return [
    ...tokenSections.map(([, values]) => Object.entries(values)).flat(),
    ...Object.entries(sourceTokens.fonts).map(([key, value]) => [`font-${key}`, value]),
  ];
}

const rootVars = buildTokenEntries(tokens);
const darkVars = tokens.dark
  ? buildTokenEntries({
      colors: tokens.dark.colors,
      effects: tokens.dark.effects,
      recipes: tokens.dark.recipes,
      fonts: tokens.fonts,
    })
  : [];

const darkSelector = ':root[data-theme="dark"], .dark, .dark-theme';
const darkScope = (selector) =>
  [
    `:root[data-theme="dark"] ${selector}`,
    `.dark ${selector}`,
    `.dark-theme ${selector}`,
  ].join(',\n');

const variablesCss = [
  `:root {\n${toCssVars(rootVars)}\n}`,
  darkVars.length > 0 ? `${darkSelector} {\n${toCssVars(darkVars)}\n}` : '',
].filter(Boolean).join('\n\n') + '\n';

const tailwindTheme = {
  'color-bg': tokens.colors.bg,
  'color-bg-warm': tokens.colors['bg-warm'],
  'color-bg-card': tokens.colors['bg-card'],
  'color-bg-card-hover': tokens.colors['bg-card-hover'],
  'color-bg-hover': tokens.colors['bg-card-hover'],
  'color-bg-input': tokens.colors['bg-card'],
  'color-bg-subtle': tokens.recipes['surface-soft'],
  'color-bg-strong': tokens.recipes['surface-strong'],
  'color-text': tokens.colors.text,
  'color-text-bright': tokens.colors.text,
  'color-text-dim': tokens.colors['text-dim'],
  'color-text-muted': tokens.colors['text-muted'],
  'color-accent': tokens.colors.accent,
  'color-accent-dim': '#0c8f52',
  'color-accent-warm': tokens.colors['accent-warm'],
  'color-accent-blue': tokens.colors['accent-blue'],
  'color-green': tokens.colors.accent,
  'color-red': '#b44b32',
  'color-warning': '#c9751f',
  'color-border': tokens.colors.border,
  'color-border-light': tokens.colors['border-light'],
  'color-border-hover': tokens.colors['border-light'],
  'color-badge-muted': 'rgba(16, 19, 19, 0.06)',
  'shadow-paper': tokens.effects['paper-shadow'],
  'shadow-soft': tokens.effects['shadow-soft'],
  'radius-card': tokens.effects['radius-md'],
  'radius-panel': tokens.effects['radius-lg'],
  'radius-hero': tokens.effects['radius-xl'],
  'font-sans': tokens.fonts.body,
  'font-serif': tokens.fonts.serif,
  'font-mono': tokens.fonts.mono,
};

const tailwindCss = `${variablesCss}\n@theme {\n${toCssVars(
  Object.entries(tailwindTheme)
)}\n}\n`;

const recipesCss = `:root {\n  --surface-border: rgba(16, 19, 19, 0.1);\n  --surface-border-soft: rgba(16, 19, 19, 0.08);\n  --surface-border-faint: rgba(16, 19, 19, 0.06);\n}\n\n${darkSelector} {\n  --surface-border: rgba(243, 239, 228, 0.12);\n  --surface-border-soft: rgba(243, 239, 228, 0.08);\n  --surface-border-faint: rgba(243, 239, 228, 0.06);\n}\n\n.aa-page-theme {\n  min-height: 100vh;\n  position: relative;\n  background: var(--page-background);\n  color: var(--text);\n}\n\n.aa-page-theme::before {\n  content: "";\n  position: fixed;\n  inset: 0;\n  pointer-events: none;\n  background-image: var(--grid-overlay-image);\n  background-size: var(--grid-overlay-size);\n  mask-image: var(--grid-overlay-mask);\n  opacity: var(--grid-overlay-opacity);\n}\n\n.aa-site-shell {\n  position: relative;\n  z-index: 1;\n}\n\n.aa-site-header {\n  position: sticky;\n  top: 0;\n  z-index: 20;\n  backdrop-filter: blur(18px);\n  background: var(--header-backdrop);\n  border-bottom: 1px solid var(--header-border);\n}\n\n.aa-utility-header__inner {\n  width: min(1180px, calc(100% - 56px));\n  margin: 0 auto;\n  padding: 18px 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 24px;\n}\n\n.aa-utility-header__brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 12px;\n  min-width: 0;\n  color: var(--text);\n  text-decoration: none;\n}\n\n.aa-utility-header__mark {\n  width: 42px;\n  height: 42px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n\n.aa-utility-header__mark img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n}\n\n.aa-utility-header__copy {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n\n.aa-utility-header__copy strong {\n  font-size: 16px;\n  font-weight: 700;\n  letter-spacing: -0.03em;\n}\n\n.aa-utility-header__copy span {\n  font-family: var(--font-mono);\n  font-size: 11px;\n  color: var(--text-dim);\n  text-transform: uppercase;\n  letter-spacing: 0.14em;\n  white-space: nowrap;\n}\n\n.aa-utility-header__nav {\n  display: flex;\n  align-items: center;\n  gap: 22px;\n  font-size: 14px;\n}\n\n.aa-utility-header__controls {\n  display: inline-flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.aa-utility-header__link {\n  text-decoration: none;\n  transition: color 0.2s ease;\n}\n\n.aa-utility-header__locale {\n  position: relative;\n  display: inline-flex;\n}\n\n.aa-utility-header__locale-trigger {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  min-height: 34px;\n  padding: 0 12px;\n  border: 1px solid var(--surface-border-soft);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.52);\n  color: var(--text-dim);\n  font: inherit;\n  font-size: 13px;\n  line-height: 1;\n  white-space: nowrap;\n  cursor: pointer;\n  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;\n}\n\n${darkScope('.aa-utility-header__locale-trigger')} {\n  background: rgba(35, 41, 38, 0.72);\n}\n\n.aa-utility-header__locale-trigger:hover,\n.aa-utility-header__locale.is-open .aa-utility-header__locale-trigger {\n  border-color: var(--surface-border);\n  background: rgba(255, 255, 255, 0.72);\n  color: var(--text);\n}\n\n${darkScope('.aa-utility-header__locale-trigger:hover')},\n${darkScope('.aa-utility-header__locale.is-open .aa-utility-header__locale-trigger')} {\n  background: rgba(35, 41, 38, 0.92);\n}\n\n.aa-utility-header__locale-trigger:focus-visible,\n.aa-utility-header__locale-menu-option:focus-visible {\n  outline: 2px solid rgba(12, 143, 82, 0.28);\n  outline-offset: 2px;\n}\n\n.aa-utility-header__locale-current {\n  white-space: nowrap;\n}\n\n.aa-utility-header__locale-caret {\n  width: 7px;\n  height: 7px;\n  margin-top: -3px;\n  border-right: 1.5px solid currentColor;\n  border-bottom: 1.5px solid currentColor;\n  transform: rotate(45deg);\n  transition: transform 0.18s ease, margin-top 0.18s ease;\n}\n\n.aa-utility-header__locale.is-open .aa-utility-header__locale-caret {\n  margin-top: 1px;\n  transform: rotate(-135deg);\n}\n\n.aa-utility-header__locale-menu {\n  position: absolute;\n  top: calc(100% + 8px);\n  inset-inline-end: 0;\n  z-index: 30;\n  min-width: 144px;\n  padding: 6px;\n  display: grid;\n  gap: 2px;\n  border: 1px solid var(--surface-border);\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.94);\n  box-shadow: var(--paper-shadow);\n  backdrop-filter: blur(18px);\n}\n\n${darkScope('.aa-utility-header__locale-menu')} {\n  background: rgba(26, 31, 28, 0.96);\n}\n\n.aa-utility-header__locale-menu[hidden] {\n  display: none;\n}\n\n.aa-utility-header__locale-menu-option {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  min-height: 36px;\n  padding: 0 10px;\n  border: 0;\n  border-radius: 12px;\n  background: transparent;\n  color: var(--text-dim);\n  font: inherit;\n  font-size: 13px;\n  line-height: 1;\n  text-align: start;\n  white-space: nowrap;\n  cursor: pointer;\n  transition: background 0.18s ease, color 0.18s ease;\n}\n\n.aa-utility-header__locale-menu-option:hover {\n  background: rgba(16, 19, 19, 0.04);\n  color: var(--text);\n}\n\n${darkScope('.aa-utility-header__locale-menu-option:hover')} {\n  background: rgba(243, 239, 228, 0.06);\n}\n\n.aa-utility-header__locale-menu-option.is-active {\n  background: rgba(16, 19, 19, 0.05);\n  color: var(--text);\n}\n\n${darkScope('.aa-utility-header__locale-menu-option.is-active')} {\n  background: rgba(243, 239, 228, 0.08);\n}\n\n.aa-utility-header__locale-marker {\n  width: 6px;\n  height: 6px;\n  border-radius: 999px;\n  background: var(--accent);\n  opacity: 0;\n  transform: scale(0.7);\n  transition: opacity 0.18s ease, transform 0.18s ease;\n  flex-shrink: 0;\n}\n\n.aa-utility-header__locale-menu-option.is-active .aa-utility-header__locale-marker {\n  opacity: 1;\n  transform: scale(1);\n}\n\n.aa-utility-header__cta {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 11px 18px;\n  border-radius: 14px;\n  font-size: 13px;\n  font-weight: 600;\n  text-decoration: none;\n}\n\n.aa-paper-card,\n.aa-paper-panel {\n  background: var(--surface-glass);\n  border: 1px solid var(--surface-border);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--paper-shadow);\n}\n\n.aa-paper-card-strong {\n  background: var(--surface-strong);\n  border: 1px solid var(--surface-border-soft);\n  border-radius: var(--radius-md);\n}\n\n.aa-paper-panel {\n  background: var(--surface-panel);\n}\n\n.aa-paper-green {\n  background: var(--surface-green);\n}\n\n.aa-soft-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 12px;\n  border-radius: 999px;\n  border: 1px solid var(--chip-border);\n  background: var(--chip-background);\n}\n\n.aa-chip-mark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  min-height: 22px;\n  border-radius: 999px;\n  background: var(--chip-background-strong);\n}\n\n.aa-button-dark {\n  background: var(--button-dark-background);\n  color: var(--button-dark-text);\n  border: 1px solid var(--button-dark-background);\n  box-shadow: none;\n}\n\n.aa-button-dark:hover {\n  background: var(--button-dark-hover);\n}\n\n.aa-link-muted {\n  color: var(--text-dim);\n}\n\n.aa-link-muted:hover {\n  color: var(--text);\n}\n\n.aa-category-guide,\n.aa-category-announcement,\n.aa-category-engineering,\n.aa-category-story,\n.aa-category-default {\n  display: inline-flex;\n  align-items: center;\n  padding: 6px 11px;\n  border-radius: 999px;\n  font-family: var(--font-mono);\n  font-size: 11px;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  border: 1px solid transparent;\n}\n\n.aa-category-guide {\n  background: var(--guide-soft);\n  border-color: var(--guide-border);\n  color: var(--accent);\n}\n\n.aa-category-announcement,\n.aa-category-story {\n  background: var(--announcement-soft);\n  border-color: var(--announcement-border);\n  color: var(--accent-warm);\n}\n\n.aa-category-engineering {\n  background: var(--engineering-soft);\n  border-color: var(--engineering-border);\n  color: var(--accent-blue);\n}\n\n.aa-category-default {\n  background: rgba(16, 19, 19, 0.05);\n  border-color: rgba(16, 19, 19, 0.08);\n  color: var(--text-dim);\n}\n\n${darkScope('.aa-category-default')} {\n  background: rgba(243, 239, 228, 0.06);\n  border-color: rgba(243, 239, 228, 0.1);\n}\n\n.aa-footer {\n  margin-top: clamp(4rem, 8vw, 6rem);\n  padding: clamp(3rem, 5vw, 4rem) 0 clamp(3rem, 6vw, 4.5rem);\n  border-top: 1px solid var(--aa-footer-border, var(--sl-color-hairline, rgba(16, 19, 19, 0.08)));\n}\n\n.aa-footer__inner {\n  width: min(72rem, calc(100% - 3rem));\n  margin: 0 auto;\n}\n\n.aa-footer__grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.6fr);\n  gap: 2.5rem 3rem;\n  align-items: start;\n}\n\n.aa-footer__brand {\n  display: grid;\n  gap: 1.25rem;\n  align-content: start;\n}\n\n.aa-footer__mark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 5rem;\n  height: 5rem;\n  border-radius: 1.75rem;\n  border: 1px solid var(--aa-footer-mark-border, var(--sl-color-hairline, rgba(16, 19, 19, 0.08)));\n  background: var(--aa-footer-mark-bg, var(--sl-color-bg-sidebar, var(--surface-strong, rgba(255, 255, 255, 0.6))));\n  box-shadow: var(--aa-footer-mark-shadow, var(--shadow-soft, 0 12px 30px rgba(70, 58, 30, 0.08)));\n}\n\n.aa-footer__mark img {\n  width: 3rem;\n  height: 3rem;\n  object-fit: contain;\n  border-radius: 1rem;\n}\n\n.aa-footer__brand-copy {\n  display: grid;\n  gap: 0.7rem;\n}\n\n.aa-footer__title {\n  margin: 0;\n  font-size: clamp(1.5rem, 3vw, 1.9rem);\n  line-height: 1.05;\n  letter-spacing: -0.04em;\n}\n\n.aa-footer__description {\n  margin: 0;\n  max-width: 24rem;\n  color: var(--text-dim);\n  font-size: 1rem;\n  line-height: 1.65;\n}\n\n.aa-footer__copy {\n  margin: 0;\n  color: var(--aa-footer-copy, var(--sl-color-gray-3, var(--text-muted)));\n  font-size: 0.95rem;\n  line-height: 1.6;\n}\n\n.aa-footer__sections {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 1.5rem 1.75rem;\n}\n\n.aa-footer__section {\n  display: grid;\n  gap: 0.9rem;\n  align-content: start;\n}\n\n.aa-footer__heading {\n  margin: 0;\n  font-size: 0.95rem;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n}\n\n.aa-footer__list {\n  display: grid;\n  gap: 0.7rem;\n}\n\n.aa-footer__link {\n  color: var(--aa-footer-text, var(--sl-color-text, var(--text-dim)));\n  text-decoration: none;\n  font-size: 0.98rem;\n  line-height: 1.45;\n  transition: color 0.18s ease;\n}\n\n.aa-footer__link:hover {\n  color: var(--aa-footer-hover, var(--sl-color-white, var(--text)));\n}\n\n[dir='rtl'] .aa-utility-header__inner,\n[dir='rtl'] .aa-footer__grid,\n[dir='rtl'] .aa-footer__sections {\n  direction: rtl;\n}\n\n[dir='rtl'] .aa-utility-header__copy,\n[dir='rtl'] .aa-footer__brand-copy,\n[dir='rtl'] .aa-footer__section,\n[dir='rtl'] .aa-footer__description,\n[dir='rtl'] .aa-footer__copy {\n  text-align: right;\n}\n\n@media (max-width: 960px) {\n  .aa-footer__grid {\n    grid-template-columns: 1fr;\n  }\n\n  .aa-footer__sections {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n\n@media (max-width: 720px) {\n  .aa-utility-header__inner {\n    width: min(100%, calc(100% - 32px));\n    padding: 14px 0;\n    gap: 14px;\n  }\n\n  .aa-utility-header__mark {\n    width: 36px;\n    height: 36px;\n  }\n\n  .aa-utility-header__copy strong {\n    font-size: 14px;\n  }\n\n  .aa-utility-header__copy span {\n    font-size: 10px;\n    letter-spacing: 0.12em;\n  }\n\n  .aa-utility-header__nav {\n    gap: 12px;\n  }\n\n  .aa-utility-header__controls {\n    gap: 8px;\n  }\n\n  .aa-utility-header__locale-trigger {\n    min-height: 32px;\n    padding: 0 10px;\n  }\n\n  .aa-utility-header__locale-menu {\n    min-width: 132px;\n  }\n\n  .aa-utility-header__locale-menu-option {\n    min-height: 34px;\n    padding: 0 9px;\n  }\n\n  .aa-utility-header__link {\n    display: none;\n  }\n\n  .aa-utility-header__cta {\n    min-height: 44px;\n    padding: 10px 14px;\n    font-size: 14px;\n  }\n\n  .aa-footer {\n    padding-top: 3rem;\n  }\n\n  .aa-footer__inner {\n    width: min(100%, calc(100% - 2rem));\n  }\n\n  .aa-footer__sections {\n    grid-template-columns: 1fr;\n    gap: 1.25rem;\n  }\n\n  .aa-footer__brand {\n    gap: 1rem;\n  }\n\n  .aa-footer__link,\n  .aa-footer__copy,\n  .aa-footer__description {\n    font-size: 0.95rem;\n  }\n}\n`;

const indexJs = `import tokens from '../tokens.json' with { type: 'json' };\nexport * from './locales.js';\nexport { tokens };\nexport default tokens;\n`;

const headerJs = `import { DEFAULT_LOCALE, localizePath, normalizeLocale, withLocaleUrl } from './locales.js';\n\nconst headerData = ${JSON.stringify(
  headerByLocale,
  null,
  2
)};\n\nexport const headerLocales = headerData;\nexport const headerBrand = headerData[DEFAULT_LOCALE].brand;\nexport const headerLinks = headerData[DEFAULT_LOCALE].links;\nexport const headerCta = headerData[DEFAULT_LOCALE].cta;\nexport const headerSwitcher = headerData[DEFAULT_LOCALE].switcher;\n\nexport function getHeader(locale = DEFAULT_LOCALE) {\n  return headerData[normalizeLocale(locale)] ?? headerData[DEFAULT_LOCALE];\n}\n\nexport { DEFAULT_LOCALE, localizePath, normalizeLocale, withLocaleUrl };\nexport default getHeader(DEFAULT_LOCALE);\n`;

const footerJs = `import { DEFAULT_LOCALE, normalizeLocale, withLocaleUrl } from './locales.js';\n\nconst footerData = ${JSON.stringify(
  footerByLocale,
  null,
  2
)};\n\nexport const footerLocales = footerData;\nexport const footerLinks = footerData[DEFAULT_LOCALE].sections.flatMap((section) => section.links);\nexport const footerSections = footerData[DEFAULT_LOCALE].sections;\nexport const footerCopy = footerData[DEFAULT_LOCALE].copy;\nexport const footerDescription = footerData[DEFAULT_LOCALE].description;\nexport const footerLogoSrc = footerData[DEFAULT_LOCALE].logoSrc;\nexport const footerLogoAlt = footerData[DEFAULT_LOCALE].logoAlt;\nexport const footerTitle = footerData[DEFAULT_LOCALE].title;\n\nexport function getFooter(locale = DEFAULT_LOCALE) {\n  return footerData[normalizeLocale(locale)] ?? footerData[DEFAULT_LOCALE];\n}\n\nexport { DEFAULT_LOCALE, normalizeLocale, withLocaleUrl };\nexport default getFooter(DEFAULT_LOCALE);\n`;

const astroFooter = `---\nconst footerData = ${JSON.stringify(
  footerByLocale,
  null,
  2
)};\nconst locale = Astro.props.locale ?? 'en';\nconst footer = footerData[locale] ?? footerData.en;\n---\n\n<footer class="aa-footer" data-aa-impression="footer">\n  <div class="aa-footer__inner">\n    <div class="aa-footer__grid">\n      <div class="aa-footer__brand">\n        <div class="aa-footer__mark">\n          <img src={footer.logoSrc} alt={footer.logoAlt} width={footer.logoWidth} height={footer.logoHeight} />\n        </div>\n        <div class="aa-footer__brand-copy">\n          <h2 class="aa-footer__title">{footer.title}</h2>\n          <p class="aa-footer__description">{footer.description}</p>\n          <p class="aa-footer__copy">{footer.copy}</p>\n        </div>\n      </div>\n      <nav class="aa-footer__sections" aria-label="Footer">\n        {footer.sections.map((section) => (\n          <section class="aa-footer__section">\n            <h3 class="aa-footer__heading">{section.title}</h3>\n            <div class="aa-footer__list">\n              {section.links.map((link) => (\n                <a href={link.href} class="aa-footer__link" target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} onclick={link.trackingId ? \`window.aa?.track('cta_click',{id:'\${link.trackingId}'})\` : undefined}>{link.label}</a>\n              ))}\n            </div>\n          </section>\n        ))}\n      </nav>\n    </div>\n  </div>\n</footer>\n`;

const eleventyHeader = `{% set aaHeaderData = ${JSON.stringify(
  headerByLocale,
  null,
  2
)} %}\n{% set aaHeader = aaHeaderData[locale or 'en'] or aaHeaderData.en %}\n{% set aaActiveLocaleLabel = aaHeader.switcher.activeLabel or aaHeader.switcher.options[0].nativeLabel %}\n{% for option in aaHeader.switcher.options %}\n  {% if option.active %}\n    {% set aaActiveLocaleLabel = option.nativeLabel %}\n  {% endif %}\n{% endfor %}\n<header class="aa-site-header aa-utility-header">\n  <div class="aa-utility-header__inner">\n    <a href="{{ aaHeader.brand.href }}" class="aa-utility-header__brand">\n      <span class="aa-utility-header__mark">\n        <img src="{{ aaHeader.brand.logoSrc }}" alt="{{ aaHeader.brand.logoAlt }}" width="{{ aaHeader.brand.logoWidth }}" height="{{ aaHeader.brand.logoHeight }}">\n      </span>\n      <span class="aa-utility-header__copy">\n        <strong>{{ aaHeader.brand.title }}</strong>\n        <span>{{ aaHeader.brand.subtitle }}</span>\n      </span>\n    </a>\n    <nav class="aa-utility-header__nav" aria-label="Primary">\n      {% for link in aaHeader.links %}\n      <a href="{{ link.href }}" class="aa-utility-header__link aa-link-muted"{% if link.trackingId %} onclick="window.aa?.track('cta_click',{id:'{{ link.trackingId }}'})"{% endif %}>{{ link.label }}</a>\n      {% endfor %}\n      <div class="aa-utility-header__controls">\n        <div class="aa-utility-header__locale" data-aa-locale-root>\n          <button type="button" class="aa-utility-header__locale-trigger" aria-label="{{ aaHeader.switcher.ariaLabel or aaActiveLocaleLabel }}" aria-haspopup="menu" aria-expanded="false" data-aa-locale-trigger>\n            <span class="aa-utility-header__locale-current">{{ aaActiveLocaleLabel }}</span>\n            <span class="aa-utility-header__locale-caret" aria-hidden="true"></span>\n          </button>\n          <div class="aa-utility-header__locale-menu" role="menu" hidden data-aa-locale-menu>\n            {% for option in aaHeader.switcher.options %}\n            <button type="button" class="aa-utility-header__locale-menu-option{% if option.active %} is-active{% endif %}" role="menuitemradio" aria-checked="{% if option.active %}true{% else %}false{% endif %}" data-aa-locale-option="{{ option.id }}">\n              <span class="aa-utility-header__locale-marker" aria-hidden="true"></span>\n              <span>{{ option.nativeLabel }}</span>\n            </button>\n            {% endfor %}\n          </div>\n        </div>\n        <a href="{{ aaHeader.cta.href }}" class="aa-utility-header__cta aa-button-dark"{% if aaHeader.cta.trackingId %} onclick="window.aa?.track('cta_click',{id:'{{ aaHeader.cta.trackingId }}'})"{% endif %}>{{ aaHeader.cta.label }}</a>\n      </div>\n    </nav>\n  </div>\n</header>\n<script>\n  (function () {\n    if (window.__aaLocaleSwitcherInitialized) return;\n    window.__aaLocaleSwitcherInitialized = true;\n\n    var COOKIE_NAME = ${JSON.stringify(
      LOCALE_COOKIE_NAME
    )};\n    var COOKIE_DOMAIN = ${JSON.stringify(
      LOCALE_COOKIE_DOMAIN
    )};\n    var COOKIE_MAX_AGE = ${JSON.stringify(LOCALE_COOKIE_MAX_AGE)};\n\n    function normalizeLocale(locale) {\n      var value = String(locale || '').trim().toLowerCase();\n      if (value === 'iw') return 'he';\n      if (value === 'zh-cn' || value === 'zh-hans' || value === 'zh-sg') return 'zh';\n      if (value === 'en' || value === 'he' || value === 'zh') return value;\n      return 'en';\n    }\n\n    function getCookieDomain() {\n      var hostname = window.location.hostname || '';\n      if (hostname === 'agentanalytics.sh' || hostname.endsWith('.agentanalytics.sh')) {\n        return COOKIE_DOMAIN;\n      }\n      return '';\n    }\n\n    function stripLocalePrefix(pathname) {\n      var source = pathname || '/';\n      return source.replace(/^\\/(?:he|zh)(?=\\/|$)/, '') || '/';\n    }\n\n    function localizePath(locale, pathname) {\n      var targetLocale = normalizeLocale(locale);\n      var value = String(pathname || '/');\n      var hashIndex = value.indexOf('#');\n      var hash = hashIndex === -1 ? '' : value.slice(hashIndex);\n      var pathAndQuery = hashIndex === -1 ? value : value.slice(0, hashIndex);\n      var queryIndex = pathAndQuery.indexOf('?');\n      var query = queryIndex === -1 ? '' : pathAndQuery.slice(queryIndex);\n      var pathOnly = queryIndex === -1 ? pathAndQuery : pathAndQuery.slice(0, queryIndex);\n      var normalizedPath = stripLocalePrefix(pathOnly.charAt(0) === '/' ? pathOnly : '/' + pathOnly);\n\n      if (targetLocale === 'en') return normalizedPath + query + hash;\n      return (normalizedPath === '/' ? '/' + targetLocale + '/' : '/' + targetLocale + normalizedPath) + query + hash;\n    }\n\n    function getLocaleRoots() {\n      return Array.prototype.slice.call(document.querySelectorAll('[data-aa-locale-root]'));\n    }\n\n    function closeLocaleMenu(root) {\n      if (!root) return;\n      root.classList.remove('is-open');\n      var trigger = root.querySelector('[data-aa-locale-trigger]');\n      var menu = root.querySelector('[data-aa-locale-menu]');\n      if (trigger) trigger.setAttribute('aria-expanded', 'false');\n      if (menu) menu.hidden = true;\n    }\n\n    function openLocaleMenu(root) {\n      if (!root) return;\n      var trigger = root.querySelector('[data-aa-locale-trigger]');\n      var menu = root.querySelector('[data-aa-locale-menu]');\n      if (!trigger || !menu) return;\n      root.classList.add('is-open');\n      trigger.setAttribute('aria-expanded', 'true');\n      menu.hidden = false;\n    }\n\n    function closeAllLocaleMenus(exceptRoot) {\n      var roots = getLocaleRoots();\n      for (var index = 0; index < roots.length; index += 1) {\n        if (exceptRoot && roots[index] === exceptRoot) continue;\n        closeLocaleMenu(roots[index]);\n      }\n    }\n\n    document.addEventListener('click', function (event) {\n      var option = event.target.closest('[data-aa-locale-option]');\n      if (option) {\n        var nextLocale = normalizeLocale(option.getAttribute('data-aa-locale-option'));\n        var domain = getCookieDomain();\n        var secure = window.location.protocol === 'https:' ? '; Secure' : '';\n        var domainAttr = domain ? '; Domain=' + domain : '';\n\n        document.cookie = COOKIE_NAME + '=' + nextLocale + '; Path=/; Max-Age=' + COOKIE_MAX_AGE + '; SameSite=Lax' + domainAttr + secure;\n        window.location.assign(localizePath(nextLocale, window.location.pathname + window.location.search + window.location.hash));\n        return;\n      }\n\n      var trigger = event.target.closest('[data-aa-locale-trigger]');\n      if (trigger) {\n        var root = trigger.closest('[data-aa-locale-root]');\n        var isOpen = trigger.getAttribute('aria-expanded') === 'true';\n        closeAllLocaleMenus(root);\n        if (isOpen) {\n          closeLocaleMenu(root);\n        } else {\n          openLocaleMenu(root);\n        }\n        return;\n      }\n\n      var menu = event.target.closest('[data-aa-locale-menu]');\n      if (menu) return;\n\n      closeAllLocaleMenus();\n    });\n\n    document.addEventListener('keydown', function (event) {\n      if (event.key !== 'Escape') return;\n\n      var roots = getLocaleRoots();\n      var openRoot = null;\n      for (var index = 0; index < roots.length; index += 1) {\n        if (roots[index].classList.contains('is-open')) {\n          openRoot = roots[index];\n          break;\n        }\n      }\n\n      closeAllLocaleMenus();\n      if (!openRoot) return;\n\n      var trigger = openRoot.querySelector('[data-aa-locale-trigger]');\n      if (trigger) trigger.focus();\n    });\n  })();\n</script>\n`;

const eleventyFooter = `{% set aaFooterData = ${JSON.stringify(
  footerByLocale,
  null,
  2
)} %}\n{% set aaFooter = aaFooterData[locale or 'en'] or aaFooterData.en %}\n<footer class="aa-footer" data-aa-impression="footer">\n  <div class="aa-footer__inner">\n    <div class="aa-footer__grid">\n      <div class="aa-footer__brand">\n        <div class="aa-footer__mark">\n          <img src="{{ aaFooter.logoSrc }}" alt="{{ aaFooter.logoAlt }}" width="{{ aaFooter.logoWidth }}" height="{{ aaFooter.logoHeight }}">\n        </div>\n        <div class="aa-footer__brand-copy">\n          <h2 class="aa-footer__title">{{ aaFooter.title }}</h2>\n          <p class="aa-footer__description">{{ aaFooter.description }}</p>\n          <p class="aa-footer__copy">{{ aaFooter.copy }}</p>\n        </div>\n      </div>\n      <nav class="aa-footer__sections" aria-label="Footer">\n        {% for section in aaFooter.sections %}\n        <section class="aa-footer__section">\n          <h3 class="aa-footer__heading">{{ section.title }}</h3>\n          <div class="aa-footer__list">\n            {% for link in section.links %}\n            <a href="{{ link.href }}" class="aa-footer__link"{% if link.external %} target="_blank" rel="noopener noreferrer"{% endif %}{% if link.trackingId %} onclick="window.aa?.track('cta_click',{id:'{{ link.trackingId }}'})"{% endif %}>{{ link.label }}</a>\n            {% endfor %}\n          </div>\n        </section>\n        {% endfor %}\n      </nav>\n    </div>\n  </div>\n</footer>\n`;

await mkdir(distDir, { recursive: true });
await mkdir(path.join(distDir, 'astro'), { recursive: true });
await mkdir(path.join(distDir, 'eleventy'), { recursive: true });

await writeFile(path.join(distDir, 'variables.css'), variablesCss);
await writeFile(path.join(distDir, 'tailwind.css'), tailwindCss);
await writeFile(path.join(distDir, 'recipes.css'), recipesCss);
await writeFile(path.join(distDir, 'index.js'), indexJs);
await writeFile(path.join(distDir, 'locales.js'), localesJs);
await writeFile(path.join(distDir, 'header.js'), headerJs);
await writeFile(path.join(distDir, 'footer.js'), footerJs);
await writeFile(path.join(distDir, 'astro', 'Footer.astro'), astroFooter);
await writeFile(path.join(distDir, 'eleventy', 'header.njk'), eleventyHeader);
await writeFile(path.join(distDir, 'eleventy', 'footer.njk'), eleventyFooter);
