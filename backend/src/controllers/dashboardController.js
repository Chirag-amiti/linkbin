import { Paste } from '../models/Paste.js';
import { ShortUrl } from '../models/ShortUrl.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const owner = req.user._id;

  const [urlStats, pasteStats, recentUrls, recentPastes] = await Promise.all([
    ShortUrl.aggregate([
      { $match: { owner, isDeleted: false } },
      {
        $group: {
          _id: null,
          totalUrls: { $sum: 1 },
          activeUrls: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalClicks: { $sum: '$totalClicks' },
          uniqueClicks: { $sum: '$uniqueClicks' },
        },
      },
    ]),
    Paste.aggregate([
      { $match: { owner, isDeleted: false } },
      {
        $group: {
          _id: null,
          totalPastes: { $sum: 1 },
          activePastes: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalViews: { $sum: '$totalViews' },
          uniqueViews: { $sum: '$uniqueViews' },
        },
      },
    ]),
    ShortUrl.find({ owner, isDeleted: false }).sort({ createdAt: -1 }).limit(5),
    Paste.find({ owner, isDeleted: false }).sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    success: true,
    data: {
      urls: urlStats[0] || {
        totalUrls: 0,
        activeUrls: 0,
        totalClicks: 0,
        uniqueClicks: 0,
      },
      pastes: pasteStats[0] || {
        totalPastes: 0,
        activePastes: 0,
        totalViews: 0,
        uniqueViews: 0,
      },
      recentUrls,
      recentPastes,
    },
  });
});
