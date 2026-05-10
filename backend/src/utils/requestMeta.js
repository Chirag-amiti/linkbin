import crypto from 'crypto';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

const hash = (value) => {
  return crypto.createHash('sha256').update(value || 'unknown').digest('hex');
};

const isLocalOrPrivateIp = (ip = '') => {
  const normalizedIp = ip.replace('::ffff:', '');

  return (
    normalizedIp === '::1' ||
    normalizedIp === '127.0.0.1' ||
    normalizedIp === 'localhost' ||
    normalizedIp.startsWith('192.168.') ||
    normalizedIp.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalizedIp)
  );
};

export const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
};

export const getVisitorMeta = (req) => {
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || '';
  const parsedUserAgent = new UAParser(userAgent).getResult();
  const geo = geoip.lookup(ip);
  const isLocal = isLocalOrPrivateIp(ip);

  return {
    visitorHash: hash(`${ip}:${userAgent}`),
    ipHash: hash(ip),
    userAgent,
    browser: parsedUserAgent.browser.name || 'Unknown',
    os: parsedUserAgent.os.name || 'Unknown',
    device: parsedUserAgent.device.type || 'desktop',
    referrer: req.headers.referer || req.headers.referrer || 'direct',
    country: geo?.country || (isLocal ? 'Local' : 'Unknown'),
    city: geo?.city || (isLocal ? 'Private network' : 'Unknown'),
  };
};
