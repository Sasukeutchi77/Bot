export async function sendRelayMessage(sock, jid, content, options = {}) {
  try {
    return await sock.sendMessage(jid, content, options);
  } catch (err) {
    console.error(`[sendMessage Error to ${jid}]:`, err.message);
    throw err;
  }
}
