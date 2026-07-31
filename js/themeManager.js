/**
 * ThemeManager — handles dark/light theme toggling
 * Mirrors the behavior of ThemeProvider.jsx
 */
export class ThemeManager {
  constructor() {
    const saved = localStorage.getItem('theme');
    this.isLight = saved === 'light';
    this._listeners = [];
    this._apply();
  }

  _apply() {
    const root = document.documentElement;
    if (this.isLight) {
      root.classList.remove('dark-theme');
      root.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
      root.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    localStorage.setItem('theme', this.isLight ? 'light' : 'dark');
    this._notify();
  }

  toggle() {
    this.isLight = !this.isLight;
    this._apply();
  }

  setTheme(isLight) {
    this.isLight = !!isLight;
    this._apply();
  }

  onChange(fn) {
    this._listeners.push(fn);
    // Call immediately with current state
    fn(this.isLight);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  }

  _notify() {
    this._listeners.forEach(fn => fn(this.isLight));
  }
}
