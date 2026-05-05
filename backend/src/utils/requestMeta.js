import crypto from 'crypto';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

const hash = (value) => {
  return crypto.createHash('sha256').update(value || 'unknown').digest('hex');
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

  return {
    visitorHash: hash(`${ip}:${userAgent}`),
    ipHash: hash(ip),
    userAgent,
    browser: parsedUserAgent.browser.name || 'Unknown',
    os: parsedUserAgent.os.name || 'Unknown',
    device: parsedUserAgent.device.type || 'desktop',
    referrer: req.headers.referer || req.headers.referrer || 'direct',
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown',
  };
};
