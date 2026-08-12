class NotificationManager {
  constructor() {
    this.container = document.getElementById('mac-notification-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'mac-notification-container';
      this.container.className = 'mac-notif-container';
      document.body.appendChild(this.container);
    }
  }

  show({ category = 'RELEVANTE', title, subtitle, desc, icon, duration = 5000, onClick } = {}) {
    const notif = document.createElement('div');
    notif.className = 'mac-notif-banner';

    let iconHtml = '';
    if (icon) {
      iconHtml = `<img src="${icon}" alt="${title}" class="mac-notif-icon" />`;
    }

    notif.innerHTML = `
      <div class="mac-notif-header">
        <span class="mac-notif-category">${category}</span>
        <span class="mac-notif-time">Agora</span>
      </div>
      <div class="mac-notif-body">
        ${iconHtml}
        <div class="mac-notif-content">
          <div class="mac-notif-title">${title || 'Notificação'}</div>
          ${subtitle ? `<div class="mac-notif-subtitle">${subtitle}</div>` : ''}
          ${desc ? `<div class="mac-notif-desc">${desc}</div>` : ''}
        </div>
      </div>
    `;

    this.container.appendChild(notif);

    let dismissTimer = setTimeout(() => this.dismiss(notif), duration);

    notif.addEventListener('mouseenter', () => clearTimeout(dismissTimer));
    notif.addEventListener('mouseleave', () => {
      dismissTimer = setTimeout(() => this.dismiss(notif), 2500);
    });

    notif.addEventListener('click', () => {
      clearTimeout(dismissTimer);
      this.dismiss(notif);
      if (onClick) onClick();
    });
  }

  dismiss(notif) {
    if (!notif || notif.classList.contains('mac-notif-closing')) return;
    notif.classList.add('mac-notif-closing');
    setTimeout(() => {
      if (notif.parentNode) notif.parentNode.removeChild(notif);
    }, 300);
  }
}

export const notificationManager = new NotificationManager();

export function showNotification(options) {
  notificationManager.show(options);
}
