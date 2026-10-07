export function initWelcomeAlert() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768;

  try {
    localStorage.removeItem('macos-web-alert-seen');
  } catch (_) {}

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
      width: 290px;
      background: #2C2C2E;
      border-radius: 14px;
      padding: 22px 20px 0 20px;
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
      <div style="font-size:17px;font-weight:600;margin-bottom:8px;color:#ffffff;letter-spacing:-0.4px;">Olá, seja bem-vindo!</div>
      <div style="font-size:13px;font-weight:400;color:rgba(255,255,255,0.75);line-height:1.4;margin-bottom:18px;letter-spacing:-0.1px;">Sou o <strong>Mateus Alves</strong> e este ambiente inspirado no macOS é o meu <strong>portfólio interativo</strong> — um projeto educacional e não comercial. Para aproveitar a experiência desktop completa, acesse pelo computador.</div>
      <div style="border-top: 0.5px solid rgba(255,255,255,0.15);margin:0 -20px;">
        <button id="welcome-alert-close" style="width:100%;height:44px;background:none;border:none;color:#0a84ff;font-size:17px;font-weight:600;cursor:pointer;outline:none;display:flex;align-items:center;justify-content:center;font-family:inherit;">Explorar Portfólio</button>
      </div>
    `;
  } else {
    card.style.cssText = `
      width: 290px;
      background: #2C2C2E;
      border: 0.5px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 18px 18px 16px 18px;
      box-sizing: border-box;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      text-align: center;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.55);
      transform: translateY(15px);
      opacity: 0;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
    `;

    card.innerHTML = `
      <div style="font-size:14px;font-weight:600;color:#ffffff;margin-bottom:6px;line-height:1.3;letter-spacing:-0.15px;">Olá, seja bem-vindo!</div>
      <div style="font-size:11.5px;font-weight:400;color:rgba(255,255,255,0.75);line-height:1.45;margin-bottom:16px;letter-spacing:-0.05px;padding:0 2px;">
        Sou o <strong>Mateus Alves</strong> e este ambiente inspirado no macOS é o meu <strong>portfólio interativo</strong> — um projeto estritamente educacional e não comercial. Sinta-se à vontade para explorar. Para a melhor experiência, acesse pelo computador.
      </div>
      <div style="display:flex;width:100%;">
        <button id="welcome-alert-close" style="width:100%;height:26px;background:#007aff;border:0.5px solid transparent;border-radius:6px;color:#ffffff;font-size:12px;font-weight:500;cursor:pointer;outline:none;font-family:inherit;box-shadow:0 1px 2px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;transition:background 0.15s ease;">Explorar Portfólio</button>
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
