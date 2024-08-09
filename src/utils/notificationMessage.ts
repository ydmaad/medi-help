interface NotificationData {
  medi_nickname: string;
  medi_name: string;
  user_nickname: string;
  notes: string;
}

export function generateNotificationMessage(data: NotificationData) {
  const subject = `💊 MEDIHELP 💊 ${data.medi_nickname}을 먹을 시간이에요!`;
  const message = `
    💊 ${data.user_nickname}님이 설정하신 ${data.medi_nickname} (${data.medi_name})을 복용하실 시간입니다!

    💊 메모: ${data.notes}
  `;
  return { subject, message };
}
