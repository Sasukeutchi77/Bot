const deletedMessagesCache = new Map();

export function cacheDeletedMessage(keyId, messageObj) {
  deletedMessagesCache.set(keyId, { message: messageObj, time: Date.now() });
  if (deletedMessagesCache.size > 200) {
    const oldestKey = deletedMessagesCache.keys().next().value;
    deletedMessagesCache.delete(oldestKey);
  }
}

export function getCachedDeletedMessage(keyId) {
  return deletedMessagesCache.get(keyId);
}
