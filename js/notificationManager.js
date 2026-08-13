class NotificationManager {
  constructor() {
    this.container = document.getElementById('mac-notification-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'mac-notification-container';
      this.container.className = 'mac-notif-container';
      document.body.appendChild(this.container);
    }
    this.maxVisible = 5;
  }

  show({
    type = 'banner',
    appName = '',
    category = '',
    title = 'Notificação',
    subtitle = '',
    desc = '',
    icon = '',
    duration = 5000,
    actions = [],
    onClick = null
  } = {}) {
    const activeBanners = this.container.querySelectorAll('.mac-notif-banner:not(.mac-notif-closing)');
    if (activeBanners.length >= this.maxVisible) {
      this.dismiss(activeBanners[activeBanners.length - 1]);
    }

    const notif = document.createElement('div');
    notif.className = `mac-notif-banner ${type === 'alert' ? 'mac-notif-alert' : ''}`;

    const appLabel = appName || category || 'SISTEMA';
    const iconHtml = icon ? `<img src="${icon}" alt="${title}" class="mac-notif-icon" draggable="false" />` : '';

    let actionsHtml = '';
    if (actions && actions.length > 0) {
      actionsHtml = `
        <div class="mac-notif-actions">
          ${actions.map((act, i) => `<button class="mac-notif-action-btn" data-index="${i}">${act.label}</button>`).join('')}
        </div>
      `;
    }

    notif.innerHTML = `
      <div class="mac-notif-header">
        <span class="mac-notif-category">${appLabel}</span>
        <span class="mac-notif-time">Agora</span>
      </div>
      <div class="mac-notif-body">
        ${iconHtml}
        <div class="mac-notif-content">
          <div class="mac-notif-title">${title}</div>
          ${subtitle ? `<div class="mac-notif-subtitle">${subtitle}</div>` : ''}
          ${desc ? `<div class="mac-notif-desc">${desc}</div>` : ''}
        </div>
      </div>
      ${actionsHtml}
    `;

    this.container.insertBefore(notif, this.container.firstChild);

    let dismissTimer = null;
    const isAutoDismiss = type === 'banner' && duration > 0;

    const startTimer = (ms) => {
      if (!isAutoDismiss) return;
      clearTimeout(dismissTimer);
      dismissTimer = setTimeout(() => this.dismiss(notif), ms);
    };

    if (isAutoDismiss) {
      startTimer(duration);
    }

    notif.addEventListener('mouseenter', () => {
      if (isAutoDismiss) clearTimeout(dismissTimer);
    });

    notif.addEventListener('mouseleave', () => {
      if (isAutoDismiss) startTimer(3000);
    });

    if (actions && actions.length > 0) {
      notif.querySelectorAll('.mac-notif-action-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.index, 10);
          if (actions[idx] && actions[idx].action) actions[idx].action();
          this.dismiss(notif);
        });
      });
    }

    notif.addEventListener('click', e => {
      if (e.target.closest('.mac-notif-action-btn')) return;
      if (onClick) onClick();
      if (type === 'banner') this.dismiss(notif);
    });

    this._enableSwipeToDismiss(notif, () => this.dismiss(notif));
  }

  _enableSwipeToDismiss(notif, onDismiss) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const onStart = (e) => {
      if (e.target.closest('.mac-notif-action-btn')) return;
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      notif.style.transition = 'none';
    };

    const onMove = (e) => {
      if (!isDragging) return;
      currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = currentX - startX;
      if (deltaX > 0) {
        notif.style.transform = `translateX(${deltaX}px)`;
        notif.style.opacity = `${Math.max(0, 1 - deltaX / 280)}`;
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const deltaX = currentX - startX;
      if (deltaX > 100) {
        notif.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        notif.style.transform = 'translateX(380px)';
        notif.style.opacity = '0';
        setTimeout(onDismiss, 200);
      } else {
        notif.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.25s ease';
        notif.style.transform = 'translateX(0)';
        notif.style.opacity = '1';
      }
    };

    notif.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    notif.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  }

  dismiss(notif) {
    if (!notif || notif.classList.contains('mac-notif-closing')) return;
    notif.classList.add('mac-notif-closing');
    setTimeout(() => {
      if (notif.parentNode) notif.parentNode.removeChild(notif);
    }, 220);
  }
}

export const notificationManager = new NotificationManager();

export function showNotification(options) {
  notificationManager.show(options);
}
