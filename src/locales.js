export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'he', 'zh'];
export const LOCALE_COOKIE_NAME = 'aa_locale';
export const LOCALE_COOKIE_DOMAIN = '.agentanalytics.sh';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LOCALE_META = Object.freeze({
  en: {
    id: 'en',
    label: 'English',
    nativeLabel: 'English',
    lang: 'en',
    dir: 'ltr',
  },
  he: {
    id: 'he',
    label: 'Hebrew',
    nativeLabel: 'עברית',
    lang: 'he',
    dir: 'rtl',
  },
  zh: {
    id: 'zh',
    label: 'Chinese',
    nativeLabel: '简体中文',
    lang: 'zh-CN',
    dir: 'ltr',
  },
});

export function normalizeLocale(locale) {
  if (!locale) return DEFAULT_LOCALE;
  const value = String(locale).trim().toLowerCase();
  if (value === 'iw') return 'he';
  if (value === 'zh-cn' || value === 'zh-hans' || value === 'zh-sg') return 'zh';
  if (SUPPORTED_LOCALES.includes(value)) return value;
  return DEFAULT_LOCALE;
}

export function getLocaleMeta(locale) {
  return LOCALE_META[normalizeLocale(locale)];
}

export function getLocalePrefix(locale) {
  const normalized = normalizeLocale(locale);
  return normalized === DEFAULT_LOCALE ? '' : `/${normalized}`;
}

export function stripLocalePrefix(pathname = '/') {
  const source = pathname || '/';
  return source.replace(/^\/(?:he|zh)(?=\/|$)/, '') || '/';
}

export function localizePath(locale, pathname = '/') {
  const [pathAndQuery, hash = ''] = String(pathname || '/').split('#');
  const [pathOnly, query = ''] = pathAndQuery.split('?');
  const normalizedPath = stripLocalePrefix(
    pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`
  );
  const prefix = getLocalePrefix(locale);
  const localizedPath =
    prefix === ''
      ? normalizedPath
      : normalizedPath === '/'
        ? `${prefix}/`
        : `${prefix}${normalizedPath}`;

  const search = query ? `?${query}` : '';
  const fragment = hash ? `#${hash}` : '';
  return `${localizedPath}${search}${fragment}`;
}

export function withLocaleUrl(baseUrl, locale, pathname = '/') {
  return new URL(localizePath(locale, pathname), baseUrl).toString();
}

export function detectPreferredLocale(languages = []) {
  for (const language of languages) {
    const value = String(language || '').toLowerCase();
    if (value.startsWith('he') || value.startsWith('iw')) return 'he';
    if (value.startsWith('zh')) return 'zh';
  }
  return DEFAULT_LOCALE;
}

export function readLocaleCookie(cookieString = '') {
  const match = String(cookieString)
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE_NAME}=`));

  if (!match) return null;
  return normalizeLocale(match.slice(`${LOCALE_COOKIE_NAME}=`.length));
}

export function resolveClientLocale(options = {}) {
  const cookieValue =
    options.cookieString ??
    (typeof document !== 'undefined' ? document.cookie : '');
  const fromCookie = readLocaleCookie(cookieValue);
  if (fromCookie) return fromCookie;

  const languages =
    options.languages ??
    (typeof navigator !== 'undefined'
      ? navigator.languages || [navigator.language]
      : []);

  return detectPreferredLocale(languages);
}

export function getLocaleCookieDomain(
  targetLocation = typeof location !== 'undefined' ? location : null
) {
  const hostname = targetLocation?.hostname || '';
  if (hostname === 'agentanalytics.sh' || hostname.endsWith('.agentanalytics.sh')) {
    return LOCALE_COOKIE_DOMAIN;
  }
  return '';
}

export function buildLocaleCookie(locale, options = {}) {
  const normalized = normalizeLocale(locale);
  const domain = options.domain ?? getLocaleCookieDomain();
  const maxAge = options.maxAge ?? LOCALE_COOKIE_MAX_AGE;
  const secure =
    options.secure ??
    (typeof location !== 'undefined' ? location.protocol === 'https:' : true);

  const parts = [
    `${LOCALE_COOKIE_NAME}=${normalized}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'SameSite=Lax',
  ];

  if (domain) parts.push(`Domain=${domain}`);
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function writeLocaleCookie(locale, options = {}) {
  if (typeof document === 'undefined') return normalizeLocale(locale);
  document.cookie = buildLocaleCookie(locale, options);
  return normalizeLocale(locale);
}

export function setDocumentLocale(locale, targetDocument = typeof document !== 'undefined' ? document : null) {
  if (!targetDocument?.documentElement) return getLocaleMeta(locale);
  const meta = getLocaleMeta(locale);
  targetDocument.documentElement.lang = meta.lang;
  targetDocument.documentElement.dir = meta.dir;
  return meta;
}
