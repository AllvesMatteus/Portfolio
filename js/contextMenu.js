/**
 * ContextMenu — floating right-click context menu
 */
export class ContextMenu {
  constructor() {
    this.el = document.getElementById('context-menu');
    this._close = this._close.bind(this);
  }

  open(x, y, items) {
    if (!this.el) return;

    this.el.innerHTML = '';
    items.forEach(item => {
      if (item.type === 'divider') {
        const div = document.createElement('div');
        div.className = 'context-menu__divider';
        this.el.appendChild(div);
        return;
      }

      const row = document.createElement('div');
      row.className = 'context-menu__item';
      row.textContent = item.label;
      if (item.submenu) {
        const arrow = document.createElement('span');
        arrow.className = 'context-menu__arrow';
        arrow.textContent = '›';
        row.appendChild(arrow);
      }
      row.addEventListener('click', () => {
        if (item.action) item.action();
        this._close();
      });
      this.el.appendChild(row);
    });

    this.el.style.cssText = `
      display: block;
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      z-index: 9999;
    `;

    // Keep menu within viewport
    requestAnimationFrame(() => {
      const rect = this.el.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        this.el.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        this.el.style.top = `${y - rect.height}px`;
      }
    });

    // Close on outside click / escape
    setTimeout(() => {
      document.addEventListener('mousedown', this._close);
      document.addEventListener('keydown', this._handleKey.bind(this));
    }, 0);
  }

  _close() {
    if (this.el) this.el.style.display = 'none';
    document.removeEventListener('mousedown', this._close);
  }

  _handleKey(e) {
    if (e.key === 'Escape') this._close();
  }
}
