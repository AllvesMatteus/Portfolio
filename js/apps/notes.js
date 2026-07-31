/**
 * Notes App — simple rich text notes with localStorage persistence
 */
import { WindowManager } from '../windowManager.js';
import { getSFSymbolHtml } from '../sfSymbols.js';

export function renderNotes(contentEl, wm) {
  contentEl.innerHTML = '';
  const titlebar = WindowManager.buildTitleBar('notes', 'Notes', wm);
  contentEl.appendChild(titlebar);

  const notes = JSON.parse(localStorage.getItem('macos-notes') || '[]');
  if (notes.length === 0) {
    notes.push({ id: Date.now(), title: 'Welcome to Notes', body: 'Start typing your note here...\n\nmacweb.dev Notes app supports basic rich text.' });
  }

  let selectedId = notes[0]?.id;

  const wrapper = document.createElement('div');
  wrapper.className = 'notes-window';
  wrapper.style.cssText = 'display:flex;height:calc(100% - 40px);overflow:hidden;';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'notes-sidebar';
  sidebar.style.cssText = 'width:220px;min-width:180px;border-right:1px solid rgba(255,255,255,0.1);overflow-y:auto;background:rgba(28,28,30,0.95);flex-shrink:0;';

  const sidebarHeader = document.createElement('div');
  sidebarHeader.style.cssText = 'padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;';
  sidebarHeader.innerHTML = `
    <span style="font-size:13px;font-weight:600;opacity:0.8;">Notes</span>
    <button id="notes-new-btn" style="background:none;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;" aria-label="New Note" title="New Note">${getSFSymbolHtml('square.and.pencil', { size: 16 })}</button>
  `;
  sidebar.appendChild(sidebarHeader);

  const notesList = document.createElement('div');
  notesList.id = 'notes-list';
  sidebar.appendChild(notesList);

  // Editor
  const editorPane = document.createElement('div');
  editorPane.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;background:rgba(35,35,38,0.98);';

  const editorToolbar = document.createElement('div');
  editorToolbar.style.cssText = 'padding:8px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;gap:8px;align-items:center;flex-shrink:0;';
  editorToolbar.innerHTML = `
    <button data-cmd="bold" style="background:none;border:1px solid rgba(255,255,255,0.15);color:currentColor;border-radius:4px;padding:2px 8px;cursor:pointer;font-weight:bold;font-size:12px;">B</button>
    <button data-cmd="italic" style="background:none;border:1px solid rgba(255,255,255,0.15);color:currentColor;border-radius:4px;padding:2px 8px;cursor:pointer;font-style:italic;font-size:12px;">I</button>
    <button data-cmd="underline" style="background:none;border:1px solid rgba(255,255,255,0.15);color:currentColor;border-radius:4px;padding:2px 8px;cursor:pointer;text-decoration:underline;font-size:12px;">U</button>
    <div style="width:1px;height:16px;background:rgba(255,255,255,0.15);margin:0 4px;"></div>
    <button id="notes-delete" style="background:none;border:1px solid rgba(255,59,48,0.4);color:#ff3b30;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px;" title="Delete note">${getSFSymbolHtml('trash', { size: 14 })} Delete</button>
  `;

  const editor = document.createElement('div');
  editor.contentEditable = 'true';
  editor.id = 'notes-editor';
  editor.style.cssText = 'flex:1;padding:20px;overflow-y:auto;font-size:14px;line-height:1.7;outline:none;color:rgba(255,255,255,0.9);';

  editorPane.appendChild(editorToolbar);
  editorPane.appendChild(editor);

  wrapper.appendChild(sidebar);
  wrapper.appendChild(editorPane);
  contentEl.appendChild(wrapper);

  function save() {
    const note = notes.find(n => n.id === selectedId);
    if (note) {
      note.body = editor.innerHTML;
      // Extract title from first line
      const tmp = document.createElement('div');
      tmp.innerHTML = note.body;
      note.title = tmp.textContent?.split('\n')[0]?.trim().slice(0, 50) || 'Untitled';
    }
    localStorage.setItem('macos-notes', JSON.stringify(notes));
    renderList();
  }

  function renderList() {
    notesList.innerHTML = '';
    notes.forEach(note => {
      const item = document.createElement('div');
      item.className = 'notes-list-item' + (note.id === selectedId ? ' notes-list-item--active' : '');
      item.style.cssText = `padding:10px 16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.05);${note.id === selectedId ? 'background:rgba(255,213,10,0.12);' : ''}`;
      item.innerHTML = `
        <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${note.title || 'Untitled'}</div>
        <div style="font-size:11px;opacity:0.4;margin-top:2px;">${new Date(note.id).toLocaleDateString()}</div>
      `;
      item.addEventListener('click', () => {
        save();
        selectedId = note.id;
        renderList();
        editor.innerHTML = note.body || '';
      });
      notesList.appendChild(item);
    });
  }

  function loadNote(id) {
    const note = notes.find(n => n.id === id);
    editor.innerHTML = note?.body || '';
  }

  renderList();
  loadNote(selectedId);

  // Toolbar buttons
  editorToolbar.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.execCommand(btn.dataset.cmd, false, null);
      editor.focus();
    });
  });

  // New note
  document.getElementById('notes-new-btn')?.addEventListener('click', () => {
    save();
    const note = { id: Date.now(), title: 'New Note', body: '' };
    notes.unshift(note);
    selectedId = note.id;
    renderList();
    loadNote(selectedId);
    editor.focus();
  });

  // Delete note
  document.getElementById('notes-delete')?.addEventListener('click', () => {
    const idx = notes.findIndex(n => n.id === selectedId);
    if (idx > -1) {
      notes.splice(idx, 1);
      selectedId = notes[0]?.id || null;
      renderList();
      loadNote(selectedId);
      localStorage.setItem('macos-notes', JSON.stringify(notes));
    }
  });

  // Auto-save on input
  let saveTimer;
  editor.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 500);
  });
}
