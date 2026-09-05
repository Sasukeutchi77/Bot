export async function kickMember(sock, groupJid, memberJid) {
  try {
    await sock.groupParticipantsUpdate(groupJid, [memberJid], 'remove');
    return true;
  } catch (err) {
    console.error("[v2Moderation kick error]:", err);
    return false;
  }
}

export async function promoteMember(sock, groupJid, memberJid) {
  try {
    await sock.groupParticipantsUpdate(groupJid, [memberJid], 'promote');
    return true;
  } catch (err) {
    console.error("[v2Moderation promote error]:", err);
    return false;
  }
}

export async function demoteMember(sock, groupJid, memberJid) {
  try {
    await sock.groupParticipantsUpdate(groupJid, [memberJid], 'demote');
    return true;
  } catch (err) {
    console.error("[v2Moderation demote error]:", err);
    return false;
  }
}
