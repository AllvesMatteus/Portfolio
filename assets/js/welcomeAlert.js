export function initWelcomeAlert() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768;

  const hasSeen = localStorage.getItem('macos-web-alert-seen');

  if (hasSeen && !isMobile) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'welcome-alert-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0);
    opacity: 0;
    transition: opacity 0.2s ease, backdrop-filter 0.3s ease;
    pointer-events: auto;
  `;

  const card = document.createElement('div');
  card.id = 'welcome-alert-card';

  if (isMobile) {
    overlay.style.backdropFilter = 'blur(0px)';
    overlay.style.webkitBackdropFilter = 'blur(0px)';
    overlay.style.background = 'rgba(0, 0, 0, 0)';

    card.style.cssText = `
      width: 270px;
      background: #2C2C2E;
      border-radius: 14px;
      padding: 20px 20px 0 20px;
      box-sizing: border-box;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      transform: scale(0.8);
      opacity: 0;
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1.15), opacity 0.3s ease;
    `;

    card.innerHTML = `
      <div style="font-size:17px;font-weight:600;margin-bottom:6px;color:#ffffff;letter-spacing:-0.4px;">Bem-vindo</div>
      <div style="font-size:13px;font-weight:400;color:rgba(255,255,255,0.7);line-height:1.35;margin-bottom:16px;letter-spacing:-0.1px;">Este é um projeto educacional e não comercial. Acesse pelo computador para a experiência completa.</div>
      <div style="border-top: 0.5px solid rgba(255,255,255,0.15);margin:0 -20px;">
        <button id="welcome-alert-close" style="width:100%;height:44px;background:none;border:none;color:#0a84ff;font-size:17px;font-weight:600;cursor:pointer;outline:none;display:flex;align-items:center;justify-content:center;font-family:inherit;">Entendi</button>
      </div>
    `;
  } else {
    card.style.cssText = `
      width: 260px;
      background: #2C2C2E;
      border: 0.5px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 16px;
      box-sizing: border-box;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      transform: translateY(15px);
      opacity: 0;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    `;

    card.innerHTML = `
      <div style="font-size:13.5px;font-weight:600;color:#ffffff;margin-bottom:4px;line-height:1.3;letter-spacing:-0.1px;">Bem-vindo</div>
      <div style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.7);line-height:1.4;margin-bottom:16px;letter-spacing:-0.05px;padding:0 4px;">Este é um projeto educacional e não comercial. A experiência completa do sistema e do portfólio foi pensada para ser acessada pelo computador.</div>
      <div style="display:flex;width:100%;">
        <button id="welcome-alert-close" style="width:100%;height:22px;background:#007aff;border:0.5px solid transparent;border-radius:5px;color:#ffffff;font-size:11.5px;font-weight:400;cursor:pointer;outline:none;font-family:inherit;box-shadow:0 1px 2px rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:center;">Entendi</button>
      </div>
    `;
  }

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    if (isMobile) {
      overlay.style.background = 'rgba(0, 0, 0, 0.4)';
      overlay.style.backdropFilter = 'blur(10px)';
      overlay.style.webkitBackdropFilter = 'blur(10px)';
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
    } else {
      overlay.style.background = 'rgba(0, 0, 0, 0.45)';
      card.style.transform = 'translateY(0)';
      card.style.opacity = '1';
    }
  });

  const closeBtn = card.querySelector('#welcome-alert-close');

  const closeAlert = () => {
    localStorage.setItem('macos-web-alert-seen', 'true');

    if (isMobile) {
      overlay.style.opacity = '0';
      overlay.style.background = 'rgba(0, 0, 0, 0)';
      overlay.style.backdropFilter = 'blur(0px)';
      overlay.style.webkitBackdropFilter = 'blur(0px)';
      card.style.transform = 'scale(0.8)';
      card.style.opacity = '0';
    } else {
      overlay.style.opacity = '0';
      overlay.style.background = 'rgba(0, 0, 0, 0)';
      card.style.transform = 'translateY(10px)';
      card.style.opacity = '0';
    }

    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 300);
  };

  closeBtn.addEventListener('click', closeAlert);
  if (!isMobile) {
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = '#147efb');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = '#007aff');
  }

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      closeAlert();
      window.removeEventListener('keydown', handleKeydown);
    }
  };
  window.addEventListener('keydown', handleKeydown);
}
