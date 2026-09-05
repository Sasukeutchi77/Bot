const tasks = new Map();

export function scheduleJob(id, delayMs, callback) {
  if (tasks.has(id)) {
    clearTimeout(tasks.get(id));
  }
  const timer = setTimeout(() => {
    tasks.delete(id);
    callback();
  }, delayMs);
  tasks.set(id, timer);
}

export function cancelJob(id) {
  if (tasks.has(id)) {
    clearTimeout(tasks.get(id));
    tasks.delete(id);
    return true;
  }
  return false;
}
