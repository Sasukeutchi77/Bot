const newsletterCache = new Map();

export function saveNewsletterMessage(channelId, message) {
  const existing = newsletterCache.get(channelId) || [];
  existing.unshift(message);
  if (existing.length > 50) existing.pop();
  newsletterCache.set(channelId, existing);
}

export function getNewsletterMessages(channelId) {
  return newsletterCache.get(channelId) || [];
}
