import { getSFSymbolHtml } from './sfSymbols.js';

export class ContextMenu {
  constructor() {
    this.openMenus = [];
    this._closeAll = this._closeAll.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
  }

  open(x, y, items) {
    this._closeAll();
    this._renderMenu(items, 0, x, y, null);
    
    setTimeout(() => {
      document.addEventListener('mousedown', this._handleMouseDown);
      document.addEventListener('keydown', this._handleKeyDown);
    }, 0);
  }

  _renderMenu(items, depth, x, y, parentItemEl) {
    this._closeSubmenusFrom(depth);

    const menuEl = document.createElement('div');
    menuEl.className = 'context-menu';
    menuEl.dataset.depth = depth;

    items.forEach(item => {
      if (item.type === 'divider') {
        const div = document.createElement('div');
        div.className = 'context-menu__divider';
        menuEl.appendChild(div);
        return;
      }

      if (item.type === 'tags') {
        const tagsRow = document.createElement('div');
        tagsRow.className = 'context-menu__tags';
        tagsRow.style.cssText = `
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 6px 14px;
          user-select: none;
        `;
        const colors = ['#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#0a84ff', '#bf5af2', '#8e8e93'];
        colors.forEach(c => {
          const dot = document.createElement('span');
          dot.style.cssText = `
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background-color: ${c};
            display: inline-block;
            cursor: pointer;
            transition: transform 0.1s;
          `;
          dot.addEventListener('mouseenter', () => dot.style.transform = 'scale(1.2)');
          dot.addEventListener('mouseleave', () => dot.style.transform = 'scale(1)');
          tagsRow.appendChild(dot);
        });
        menuEl.appendChild(tagsRow);
        return;
      }

      const row = document.createElement('div');
      let rowClasses = 'context-menu__item';
      if (item.disabled || item.isHeader) rowClasses += ' context-menu__item--disabled';
      if (item.isHeader) rowClasses += ' context-menu__item--header';
      row.className = rowClasses;

      const checkSlot = document.createElement('span');
      checkSlot.className = 'context-menu__check';
      checkSlot.textContent = item.checked ? '✓' : '';

      const labelSlot = document.createElement('span');
      labelSlot.className = 'context-menu__label';
      labelSlot.textContent = item.label;

      row.appendChild(checkSlot);
      row.appendChild(labelSlot);

      if (item.submenu) {
        const arrowSlot = document.createElement('span');
        arrowSlot.className = 'context-menu__arrow';
        arrowSlot.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        row.appendChild(arrowSlot);
      }

      if (!item.disabled && !item.isHeader) {
        row.addEventListener('mouseenter', () => {
          const parentMenu = this.openMenus[depth];
          if (parentMenu) {
            Array.from(parentMenu.children).forEach(child => child.classList.remove('is-active-parent'));
          }

          if (item.submenu) {
            row.classList.add('is-active-parent');
            const rect = row.getBoundingClientRect();
            const childX = rect.right - 2;
            const childY = rect.top - 4;
            this._renderMenu(item.submenu, depth + 1, childX, childY, row);
          } else {
            this._closeSubmenusFrom(depth + 1);
          }
        });

        row.addEventListener('click', (e) => {
          e.stopPropagation();
          if (item.submenu) return;
          if (item.action) item.action();
          this._closeAll();
        });
      }

      menuEl.appendChild(row);
    });

    document.body.appendChild(menuEl);
    this.openMenus.push(menuEl);

    menuEl.style.cssText = `
      left: ${x}px;
      top: ${y}px;
    `;

    requestAnimationFrame(() => {
      const rect = menuEl.getBoundingClientRect();
      if (rect.right > window.innerWidth - 8) {
        if (parentItemEl) {
          const parentRect = parentItemEl.getBoundingClientRect();
          menuEl.style.left = `${parentRect.left - rect.width + 2}px`;
        } else {
          menuEl.style.left = `${window.innerWidth - rect.width - 8}px`;
        }
      }
      if (rect.bottom > window.innerHeight - 8) {
        menuEl.style.top = `${Math.max(8, window.innerHeight - rect.height - 8)}px`;
      }
    });
  }

  _closeSubmenusFrom(depth) {
    while (this.openMenus.length > depth) {
      const menu = this.openMenus.pop();
      if (menu && menu.parentNode) {
        menu.parentNode.removeChild(menu);
      }
    }
    const parentMenu = this.openMenus[depth - 1];
    if (parentMenu) {
      Array.from(parentMenu.children).forEach(child => child.classList.remove('is-active-parent'));
    }
  }

  _closeAll() {
    this._closeSubmenusFrom(0);
    document.removeEventListener('mousedown', this._handleMouseDown);
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  _handleMouseDown(e) {
    if (this.openMenus.some(menu => menu.contains(e.target))) return;
    this._closeAll();
  }

  _handleKeyDown(e) {
    if (e.key === 'Escape') this._closeAll();
  }
}
