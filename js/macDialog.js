import { showNotification } from './notificationManager.js';

export function showMacDialog({
  icon = 'assets/icons/dock/windows11.png',
  title = 'Windows 11',
  message = 'Em breve.',
  category = 'WINDOWS 11'
} = {}) {
  showNotification({
    category: category || title.toUpperCase(),
    title: title,
    subtitle: 'Recurso em breve',
    desc: message,
    icon: icon
  });
}
