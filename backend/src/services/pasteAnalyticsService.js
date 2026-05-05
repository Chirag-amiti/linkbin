import { Paste } from '../models/Paste.js';
import { PasteAnalytics } from '../models/PasteAnalytics.js';
import { getVisitorMeta } from '../utils/requestMeta.js';

export const recordPasteView = async ({ pasteId, ownerId, req }) => {
  const meta = getVisitorMeta(req);

  const existingVisit = await PasteAnalytics.exists({
    paste: pasteId,
    visitorHash: meta.visitorHash,
  });

  await PasteAnalytics.create({
    paste: pasteId,
    owner: ownerId,
    visitorHash: meta.visitorHash,
    ipHash: meta.ipHash,
    browser: meta.browser,
    os: meta.os,
    device: meta.device,
  });

  await Paste.findByIdAndUpdate(pasteId, {
    $inc: {
      totalViews: 1,
      uniqueViews: existingVisit ? 0 : 1,
    },
    $set: {
      lastViewedAt: new Date(),
    },
  });
};

export const getPasteAnalytics = async (pasteId) => {
  const [events, viewsByDate, totalUniqueVisitors] = await Promise.all([
    PasteAnalytics.find({ paste: pasteId }).sort({ viewedAt: -1 }).limit(30),
    PasteAnalytics.aggregate([
      { $match: { paste: pasteId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } },
          views: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    PasteAnalytics.distinct('visitorHash', { paste: pasteId }),
  ]);

  return {
    recentEvents: events,
    viewsByDate: viewsByDate.map((item) => ({
      date: item._id,
      views: item.views,
    })),
    uniqueVisitors: totalUniqueVisitors.length,
  };
};
