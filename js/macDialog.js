export function showMacDialog({
  icon = 'assets/icons/dock/windows11.png',
  title = 'Windows 11',
  message = 'Em breve.',
  buttonText = 'OK',
  onClose = null
} = {}) {
  const existing = document.getElementById('mac-dialog-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'mac-dialog-overlay';
  overlay.className = 'mac-dialog-overlay';

  const modal = document.createElement('div');
  modal.className = 'mac-dialog-box';

  modal.innerHTML = `
    ${icon ? `<img src="${icon}" class="mac-dialog-icon" alt="${title}" />` : ''}
    <div class="mac-dialog-title">${title}</div>
    <div class="mac-dialog-message">${message}</div>
    <button class="mac-dialog-btn" id="mac-dialog-ok">${buttonText}</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const closeDialog = () => {
    overlay.classList.add('is-closing');
    setTimeout(() => {
      overlay.remove();
      if (onClose) onClose();
    }, 150);
  };

  modal.querySelector('#mac-dialog-ok')?.addEventListener('click', closeDialog);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeDialog();
  });

  const handleKeydown = e => {
    if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
      e.preventDefault();
      document.removeEventListener('keydown', handleKeydown);
      closeDialog();
    }
  };
  document.addEventListener('keydown', handleKeydown);
}
