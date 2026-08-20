export class ThemeManager {
  constructor() {
    this.isLight = false;

    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');

    localStorage.removeItem('theme');
  }

  onChange(fn) {
    fn(false);

    return () => {};
  }
}
