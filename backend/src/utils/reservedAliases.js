export const reservedAliases = new Set([
  'admin',
  'analytics',
  'api',
  'auth',
  'dashboard',
  'health',
  'login',
  'logout',
  'me',
  'p',
  'paste',
  'pastes',
  'register',
  'settings',
  'url',
  'urls',
]);

export const isReservedAlias = (alias) => reservedAliases.has(alias.toLowerCase());
