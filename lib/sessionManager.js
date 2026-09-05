import fs from 'fs';
import path from 'path';

export function checkSessionHealth(sessionDir = './session') {
  const fullPath = path.resolve(sessionDir);
  const exists = fs.existsSync(fullPath);
  const credsExists = fs.existsSync(path.join(fullPath, 'creds.json'));
  return {
    exists,
    authenticated: credsExists
  };
}

export function clearSession(sessionDir = './session') {
  const fullPath = path.resolve(sessionDir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    return true;
  }
  return false;
}
