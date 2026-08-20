import { showNotification } from './notificationManager.js';

export function showMacDialog({
  icon = '',
  title = '',
  message = 'Em breve.',
  category = ''
} = {}) {
  showNotification({
    category: category || title.toUpperCase(),
    title: title,
    subtitle: 'Recurso em breve',
    desc: message,
    icon: icon
  });
}

export function showMacAlert({
  messageText = '',
  informativeText = '',
  iconSrc = 'assets/icons/folders/default-folder.png',
  buttons = ['OK'],
  showsSuppressionButton = false,
  suppressionButtonText = 'Não perguntar novamente',
  callback = null
} = {}) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    opacity: 0;
    transition: opacity 0.2s ease;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif;
    user-select: none;
    -webkit-user-select: none;
  `;

  const alertBox = document.createElement('div');
  alertBox.style.cssText = `
    width: 260px;
    background: #2C2C2E;
    border: 0.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    transform: scale(0.9);
    opacity: 0;
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.2, 1), opacity 0.2s ease;
  `;

  const iconHtml = iconSrc 
    ? `<img src="${iconSrc}" style="width:48px;height:48px;object-fit:contain;margin-bottom:12px;" draggable="false" />` 
    : '';

  let suppressionHtml = '';
  if (showsSuppressionButton) {
    suppressionHtml = `
      <label style="display:flex;align-items:center;gap:6px;width:100%;margin-bottom:14px;cursor:pointer;font-size:10px;color:rgba(255,255,255,0.75);text-align:left;justify-content:flex-start;padding-left:4px;">
        <input type="checkbox" id="mac-alert-suppression-chk" style="accent-color:#007aff;margin:0;cursor:pointer;width:12px;height:12px;" />
        <span>${suppressionButtonText}</span>
      </label>
    `;
  }

  alertBox.innerHTML = `
    ${iconHtml}
    <div style="font-size:13.5px;font-weight:600;color:#ffffff;margin-bottom:4px;line-height:1.3;letter-spacing:-0.1px;">${messageText}</div>
    <div style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.7);line-height:1.4;margin-bottom:16px;letter-spacing:-0.05px;padding:0 4px;">${informativeText}</div>
    ${suppressionHtml}
    <div id="mac-alert-buttons-container" style="display:flex;width:100%;gap:8px;justify-content:center;"></div>
  `;

  const btnContainer = alertBox.querySelector('#mac-alert-buttons-container');
  const chk = alertBox.querySelector('#mac-alert-suppression-chk');

  const closeAlert = (chosenBtn) => {
    const isSuppressed = chk ? chk.checked : false;
    overlay.style.opacity = '0';
    alertBox.style.transform = 'scale(0.9)';
    alertBox.style.opacity = '0';
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (callback) callback(chosenBtn, isSuppressed);
    }, 200);
  };

  if (buttons.length === 1) {
    const btn = document.createElement('button');
    btn.style.cssText = `
      flex: 1;
      height: 22px;
      background: rgba(255, 255, 255, 0.15);
      border: 0.5px solid rgba(255, 255, 255, 0.05);
      border-radius: 5px;
      color: #ffffff;
      font-size: 11.5px;
      font-weight: 400;
      cursor: pointer;
      outline: none;
      font-family: inherit;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    btn.textContent = buttons[0];
    btn.addEventListener('click', () => closeAlert(buttons[0]));
    btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255, 255, 255, 0.2)');
    btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(255, 255, 255, 0.15)');
    btnContainer.appendChild(btn);
  } else {
    buttons.forEach((btnText, idx) => {
      const btn = document.createElement('button');
      const isDefault = idx === buttons.length - 1; 
      btn.style.cssText = `
        flex: 1;
        height: 22px;
        background: ${isDefault ? '#007aff' : 'rgba(255, 255, 255, 0.15)'};
        border: 0.5px solid ${isDefault ? 'transparent' : 'rgba(255, 255, 255, 0.05)'};
        border-radius: 5px;
        color: #ffffff;
        font-size: 11.5px;
        font-weight: 400;
        cursor: pointer;
        outline: none;
        font-family: inherit;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      btn.textContent = btnText;
      btn.addEventListener('click', () => closeAlert(btnText));
      btn.addEventListener('mouseenter', () => {
        btn.style.background = isDefault ? '#147efb' : 'rgba(255, 255, 255, 0.2)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = isDefault ? '#007aff' : 'rgba(255, 255, 255, 0.15)';
      });
      btnContainer.appendChild(btn);
    });
  }

  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    alertBox.style.transform = 'scale(1)';
    alertBox.style.opacity = '1';
  });

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      closeAlert(buttons[buttons.length - 1]);
      window.removeEventListener('keydown', handleKeydown);
    }
  };
  window.addEventListener('keydown', handleKeydown);
}
