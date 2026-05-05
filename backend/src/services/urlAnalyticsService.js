import { ShortUrl } from '../models/ShortUrl.js';
import { UrlAnalytics } from '../models/UrlAnalytics.js';
import { getVisitorMeta } from '../utils/requestMeta.js';

export const recordUrlClick = async ({ shortUrlId, ownerId, req }) => {
  const meta = getVisitorMeta(req);

  const existingVisit = await UrlAnalytics.exists({
    shortUrl: shortUrlId,
    visitorHash: meta.visitorHash,
  });

  await UrlAnalytics.create({
    shortUrl: shortUrlId,
    owner: ownerId,
    ...meta,
  });

  await ShortUrl.findByIdAndUpdate(shortUrlId, {
    $inc: {
      totalClicks: 1,
      uniqueClicks: existingVisit ? 0 : 1,
    },
    $set: {
      lastClickedAt: new Date(),
    },
  });
};

export const getUrlAnalytics = async (shortUrlId) => {
  const [events, clicksByDate, totalUniqueVisitors] = await Promise.all([
    UrlAnalytics.find({ shortUrl: shortUrlId }).sort({ clickedAt: -1 }).limit(50),
    UrlAnalytics.aggregate([
      { $match: { shortUrl: shortUrlId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    UrlAnalytics.distinct('visitorHash', { shortUrl: shortUrlId }),
  ]);

  return {
    recentEvents: events,
    clicksByDate: clicksByDate.map((item) => ({
      date: item._id,
      clicks: item.clicks,
    })),
    uniqueVisitors: totalUniqueVisitors.length,
  };
};
