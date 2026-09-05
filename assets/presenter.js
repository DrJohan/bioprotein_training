/* Shared options keep touch controls and keyboard colour selection in sync. */
const InocareInk = ['#234173', '#538AC3', '#C62828', '#2E7D32', '#F59E0B'];
const InocareChalk = ['#FFFFFF', '#83B8F0', '#FF8A80', '#A5D6A7', '#FFE082'];
const InocareDrawingOptions = {
  theme: 'chalkboard', grid: false, readOnly: false,
  // Restore drawings promptly so delayed replay cannot close a newly opened tool.
  storage: 'inocare-bioprotein-drawings-v1', transition: 1,
  boardmarkerWidth: 3, chalkWidth: 5, chalkEffect: 0.3,
  background: ['rgba(83,138,195,0.04)', 'assets/vendor/chalkboard/img/blackboard.png'],
  boardmarkers: InocareInk.map(color => ({color, cursor: 'crosshair'})),
  chalks: InocareChalk.map(color => ({color, cursor: 'crosshair'})),
  colorButtons: false, boardHandle: false,
  toggleChalkboardButton: false, toggleNotesButton: false,
  // Bind through wrappers below, so key events cannot bypass reset confirmation.
  keyBindings: {toggleNotesCanvas: false, toggleChalkboard: false, clear: false,
    resetAll: false, colorNext: false, colorPrev: false, download: false}
};

const InocarePresenter = {
  id: 'inocare-presenter',
  init(deck) {
    if (new URLSearchParams(location.search).has('receiver')) return;
    const ui = document.createElement('div');
    ui.className = 'presenter-ui';
    document.body.append(ui);
    const printMode = new URLSearchParams(location.search).has('print-pdf');
    if (printMode) {
      ui.innerHTML = '<div class="presenter-print-bar"><button type="button" data-back>Back to slides</button><button type="button" data-print>Print / Save PDF</button></div>';
      ui.querySelector('[data-back]').onclick = () => {
        const url = new URL(location.href); url.searchParams.delete('print-pdf'); location.assign(url);
      };
      ui.querySelector('[data-print]').onclick = () => window.print();
      return;
    }

    const symbols = {menu:'list',close:'x',board:'chalkboard',pen:'pencil-simple',eraser:'eraser',grid:'squares-four',notes:'presentation',fullscreen:'arrows-out',pause:'monitor',print:'printer',save:'download-simple',clear:'trash',help:'question',previous:'caret-left',next:'caret-right',first:'skip-back',last:'skip-forward',jump:'hash'};
    const icon = name => `<svg viewBox="0 0 256 256" aria-hidden="true" focusable="false"><use href="assets/icons/presenter.svg#${symbols[name]}"></use></svg>`;
    const tool = (action, label, key, symbol, extra = '') => `<button type="button" class="presenter-tool" data-action="${action}" ${extra}>${icon(symbol)}<span>${label}</span>${key ? `<kbd>${key}</kbd>` : ''}</button>`;
    const shortcuts = rows => '<dl class="presenter-shortcuts">' + rows.map(([label, key]) => `<div><dt>${label}</dt><dd><kbd>${key}</kbd></dd></div>`).join('') + '</dl>';
    ui.innerHTML = `
      <button type="button" class="presenter-menu-toggle" aria-haspopup="dialog" aria-controls="presenter-menu" aria-expanded="false" title="Presentation menu (M)">${icon('menu')}<span>Menu</span></button>
      <dialog class="presenter-menu" id="presenter-menu" aria-labelledby="presenter-menu-title">
        <header class="presenter-menu-header"><div><h2 id="presenter-menu-title">Presentation menu</h2><p class="presenter-position"></p></div><button type="button" class="presenter-icon-button" data-close aria-label="Close menu">${icon('close')}</button></header>
        <div class="presenter-tabs" role="tablist" aria-label="Presentation menu sections">
          <button type="button" id="tab-tools" role="tab" aria-controls="panel-tools" aria-selected="true">Tools</button>
          <button type="button" id="tab-slides" role="tab" aria-controls="panel-slides" aria-selected="false" tabindex="-1">Slides</button>
          <button type="button" id="tab-shortcuts" role="tab" aria-controls="panel-shortcuts" aria-selected="false" tabindex="-1">Shortcuts</button>
        </div>
        <div class="presenter-panel" id="panel-tools" role="tabpanel" aria-labelledby="tab-tools">
          <h3>Draw &amp; explain</h3><div class="presenter-tool-grid">
            ${tool('chalkboard', 'Chalkboard', 'T', 'board', 'aria-pressed="false"')}
            ${tool('annotate', 'Draw on slide', 'C', 'pen', 'aria-pressed="false"')}
            ${tool('save', 'Save drawings', 'D', 'save')}
            ${tool('clear', 'Clear current drawing', 'Delete', 'eraser')}
          </div><p class="presenter-hint">Use a mouse, pen or touch. Drawings stay in this browser tab, including after a refresh. Save a copy before closing it.</p>
          <h3>Present</h3><div class="presenter-tool-grid">
            ${tool('notes', 'Speaker view', 'S', 'notes')}
            ${tool('overview', 'Slide overview', 'O / Esc', 'grid')}
            ${tool('fullscreen', 'Fullscreen', 'F', 'fullscreen')}
            ${tool('blackout', 'Black screen', 'B', 'pause')}
            ${tool('print', 'Print / Save PDF', '', 'print')}
            ${tool('help', 'Keyboard help', '? / F1', 'help')}
          </div>
          <h3>Navigate</h3><div class="presenter-tool-grid">
            ${tool('previous', 'Previous slide', '←', 'previous')}${tool('next', 'Next slide', '→', 'next')}
            ${tool('first', 'First slide', 'Home', 'first')}${tool('last', 'Last slide', 'End', 'last')}
            ${tool('jump', 'Go to slide number', 'G', 'jump')}
          </div>
          <h3>Reset</h3><div class="presenter-tool-grid">${tool('reset', 'Clear all drawings', 'Backspace', 'clear')}</div>
        </div>
        <div class="presenter-panel" id="panel-slides" role="tabpanel" aria-labelledby="tab-slides" hidden>
          <label class="presenter-search-label" for="presenter-search">Find a slide by title or number</label><input class="presenter-search" id="presenter-search" type="search" placeholder="e.g. 12 or wound assessment" autocomplete="off">
          <ol class="presenter-slide-list"></ol><p class="presenter-no-results" role="status" hidden>No matching slides.</p>
        </div>
        <div class="presenter-panel" id="panel-shortcuts" role="tabpanel" aria-labelledby="tab-shortcuts" hidden>
          <h3>Presentation</h3>${shortcuts([
            ['Open / close this menu', 'M'], ['Chalkboard', 'T'], ['Draw on slide', 'C'], ['Leave drawing mode / close menu', 'Esc'],
            ['Speaker view', 'S'], ['Fullscreen', 'F'], ['Black screen / resume', 'B · V · . · / · ;'], ['Slide overview', 'O · Esc'], ['Jump to slide number', 'G'], ['Keyboard help', '? · F1']
          ])}
          <h3>Navigation</h3>${shortcuts([
            ['Next slide', '→ · ↓ · Space · N · Page Down · J · L'], ['Previous slide', '← · ↑ · Shift+Space · P · Page Up · H · K'],
            ['First slide', 'Home · Shift+←'], ['Last slide', 'End · Shift+→']
          ])}
          <h3>While drawing</h3>${shortcuts([
            ['Next / previous pen colour', 'X / Y'], ['Eraser', 'E · Right-drag'], ['Return to pen', 'X / Y or a colour'],
            ['Clear current drawing', 'Delete'], ['Clear all drawings (confirmation)', 'Backspace'], ['Save drawing data', 'D']
          ])}<p class="presenter-hint">Shortcuts are inactive while typing in the slide search. Press Esc to close a menu or finish drawing before returning to the slide overview.</p>
        </div>
      </dialog>
      <div class="presenter-drawing-bar" role="group" aria-label="Drawing tools" hidden>
        <span class="drawing-mode" role="status"></span><div class="presenter-colours" role="group" aria-label="Pen colour"></div>
        <button type="button" class="presenter-icon-button" data-erase aria-label="Eraser (E)" title="Eraser (E)" aria-pressed="false">${icon('eraser')}</button>
        <button type="button" class="presenter-icon-button" data-clear aria-label="Clear current drawing (Delete)" title="Clear current drawing (Delete)">${icon('clear')}</button>
        <button type="button" class="presenter-done" data-done>Done</button>
      </div>
      <div class="presenter-notice" role="status" hidden></div>`;

    const menu = ui.querySelector('dialog');
    const trigger = ui.querySelector('.presenter-menu-toggle');
    const bar = ui.querySelector('.presenter-drawing-bar');
    const search = ui.querySelector('input');
    const tabs = [...ui.querySelectorAll('[role=tab]')];
    const colourNames = ['Navy / white', 'Blue', 'Red', 'Green', 'Yellow'];
    const colourChoice = [0, 0];
    let noticeTimeout;
    const board = () => document.getElementById('chalkboard');
    const notes = () => document.getElementById('notescanvas');
    const mode = () => board()?.style.visibility === 'visible' ? 1 : notes()?.style.pointerEvents === 'auto' ? 0 : -1;
    const chalk = () => deck.getPlugin('RevealChalkboard');
    const notice = message => {
      const element = ui.querySelector('.presenter-notice');
      clearTimeout(noticeTimeout); element.textContent = message; element.hidden = false;
      noticeTimeout = setTimeout(() => { element.hidden = true; }, 5000);
    };
    function syncDrawing() {
      const active = mode();
      bar.hidden = active < 0 || deck.isPaused();
      document.body.classList.toggle('presenter-drawing-active', active >= 0);
      ui.querySelector('[data-action=chalkboard]').setAttribute('aria-pressed', active === 1);
      ui.querySelector('[data-action=annotate]').setAttribute('aria-pressed', active === 0);
      ui.querySelector('[data-action=clear]').disabled = active < 0;
      if (active < 0) return;
      ui.querySelector('.drawing-mode').textContent = active === 1 ? 'Chalkboard' : 'Draw on slide';
      ui.querySelectorAll('[data-colour]').forEach((button, i) => {
        button.style.setProperty('--swatch', (active === 1 ? InocareChalk : InocareInk)[i]);
        button.setAttribute('aria-label', `Pen: ${i === 0 ? (active === 1 ? 'White' : 'Navy') : colourNames[i]}`);
        button.setAttribute('aria-pressed', colourChoice[active] === i);
      });
      ui.querySelector('[data-erase]').setAttribute('aria-pressed', colourChoice[active] === -1);
    }
    function chooseColour(index) {
      const active = mode(); if (active < 0) return;
      colourChoice[active] = index; chalk().colorIndex(index); syncDrawing();
    }
    function cycleColour(delta) {
      const active = mode(); if (active < 0) return;
      chooseColour((Math.max(-1, colourChoice[active]) + delta + InocareInk.length) % InocareInk.length);
    }
    colourNames.forEach((name, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'presenter-colour'; button.dataset.colour = index;
      button.title = name; button.onclick = () => chooseColour(index);
      ui.querySelector('.presenter-colours').append(button);
    });
    function finishDrawing() {
      if (mode() === 1) chalk().toggleChalkboard();
      if (notes()?.style.pointerEvents === 'auto') chalk().toggleNotesCanvas();
      syncDrawing();
    }
    function toggleDrawing(target) {
      const previous = mode(); finishDrawing();
      if (previous !== target) {
        deck.toggleOverview(false); deck.togglePause(false);
        if (target === 1) chalk().toggleChalkboard(); else chalk().toggleNotesCanvas();
        chalk().colorIndex(colourChoice[target]);
      }
      syncDrawing();
    }
    function closeMenu() {
      if (!menu.open) return;
      menu.close(); trigger.setAttribute('aria-expanded', 'false'); trigger.focus({preventScroll:true});
    }
    function selectTab(tab, focus = false) {
      tabs.forEach(item => {
        const selected = tab === item;
        item.setAttribute('aria-selected', selected); item.tabIndex = selected ? 0 : -1;
        ui.querySelector('#' + item.getAttribute('aria-controls')).hidden = !selected;
      });
      if (focus) tab.focus();
    }
    function toggleMenu() {
      if (menu.open) { closeMenu(); return; }
      syncDrawing(); updatePosition();
      menu.showModal(); trigger.setAttribute('aria-expanded', 'true');
      ui.querySelector('[data-close]').focus();
    }
    const slides = deck.getSlides();
    const slideItems = slides.map((slide, index) => {
      const title = slide.querySelector('h1,h2,.case-title,.big-message')?.textContent.trim() || `Slide ${index + 1}`;
      const item = document.createElement('li'), button = document.createElement('button');
      button.type = 'button'; button.className = 'presenter-slide-link'; button.dataset.slide = index;
      const number = document.createElement('span'), label = document.createElement('span');
      number.textContent = String(index + 1).padStart(2, '0'); label.textContent = title;
      button.append(number, label);
      button.onclick = () => { closeMenu(); finishDrawing(); deck.slide(index); };
      item.append(button); ui.querySelector('.presenter-slide-list').append(item);
      return {item, button, title: `${index + 1} ${title}`.toLocaleLowerCase()};
    });
    function updatePosition() {
      const current = deck.getIndices().h;
      ui.querySelector('.presenter-position').textContent = `Slide ${current + 1} of ${slides.length} · Klinik Inocare`;
      slideItems.forEach(({button}, index) => button.setAttribute('aria-current', index === current));
    }
    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase();
      slideItems.forEach(({item, title}) => { item.hidden = !title.includes(query); });
      ui.querySelector('.presenter-no-results').hidden = slideItems.some(({item}) => !item.hidden);
    });
    const actions = {
      chalkboard: () => toggleDrawing(1), annotate: () => toggleDrawing(0),
      clear: () => { if (mode() >= 0) chalk().clear(); },
      reset: () => { chalk().resetAll(); syncDrawing(); },
      save: () => { chalk().updateStorage(); chalk().download(); },
      notes: () => { finishDrawing(); deck.getPlugin('notes').open(); },
      overview: () => { finishDrawing(); deck.toggleOverview(); },
      blackout: () => { finishDrawing(); deck.togglePause(); },
      fullscreen: () => {
        const promise = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
        if (promise) promise.catch(() => notice('Fullscreen is unavailable here. Open the slides in your browser.'));
        else notice('Use your browser’s fullscreen control.');
      },
      help: () => { finishDrawing(); deck.toggleHelp(); },
      jump: () => { finishDrawing(); deck.toggleJumpToSlide(); },
      print: () => { finishDrawing(); chalk().updateStorage(); const url = new URL(location.href); url.searchParams.set('print-pdf', ''); url.hash = ''; location.assign(url); },
      previous: () => { finishDrawing(); deck.prev(); }, next: () => { finishDrawing(); deck.next(); },
      first: () => { finishDrawing(); deck.slide(0); }, last: () => { finishDrawing(); deck.slide(slides.length - 1); }
    };
    ui.querySelectorAll('[data-action]').forEach(button => button.onclick = () => {
      closeMenu(); actions[button.dataset.action]();
    });
    trigger.onclick = toggleMenu;
    ui.querySelector('[data-close]').onclick = closeMenu;
    ui.querySelector('[data-done]').onclick = finishDrawing;
    ui.querySelector('[data-erase]').onclick = () => chooseColour(-1);
    ui.querySelector('[data-clear]').onclick = actions.clear;
    tabs.forEach(tab => tab.onclick = () => selectTab(tab));
    menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
    menu.addEventListener('click', event => { if (event.target === menu && event.clientX > menu.getBoundingClientRect().right) closeMenu(); });

    // Keep menu navigation and native button activation from advancing slides.
    window.addEventListener('keydown', event => {
      const typing = event.target.matches?.('input,textarea,[contenteditable=true]');
      if (menu.open) {
        if (event.key === 'Escape' || (!typing && event.key.toLowerCase() === 'm')) { event.preventDefault(); closeMenu(); }
        else if (event.key === 'Tab') {
          const focusable = [...menu.querySelectorAll('button:not(:disabled), input, [href], [tabindex]')].filter(element => element.tabIndex >= 0 && element.getClientRects().length);
          const first = focusable[0], last = focusable[focusable.length - 1];
          if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        else if (event.target.matches('[role=tab]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
          event.preventDefault(); const index = tabs.indexOf(event.target);
          selectTab(tabs[event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
        }
        event.stopPropagation();
      } else if (!typing && event.key === 'Escape' && mode() >= 0) {
        event.preventDefault(); event.stopPropagation(); finishDrawing();
      } else if (event.target.closest('.presenter-ui button') && [' ', 'Enter'].includes(event.key)) {
        event.stopPropagation();
      }
    }, true);
    [
      [77,'M','Open presentation menu',toggleMenu],
      [84,'T','Toggle chalkboard',actions.chalkboard], [67,'C','Draw on slide',actions.annotate],
      [69,'E','Eraser (while drawing)',() => chooseColour(-1)],
      [88,'X','Next pen colour',() => cycleColour(1)], [89,'Y','Previous pen colour',() => cycleColour(-1)],
      [46,'Delete','Clear current drawing',actions.clear], [8,'Backspace','Clear all drawings (confirmation)',actions.reset],
      [68,'D','Save drawings',actions.save]
    ].forEach(([keyCode,key,description,callback]) => deck.addKeyBinding({keyCode,key,description}, () => callback()));
    deck.on('slidechanged', () => { updatePosition(); syncDrawing(); });
    deck.on('paused', () => { finishDrawing(); trigger.hidden = true; });
    deck.on('resumed', () => { trigger.hidden = false; });
    // Initialise the plugin's viewport transform before the first stroke, so
    // drawings retain their position after refresh or a screen-size change.
    deck.on('ready', () => window.dispatchEvent(new Event('resize')));
    const observer = new MutationObserver(syncDrawing);
    observer.observe(board(), {attributes:true,attributeFilter:['style']});
    observer.observe(notes(), {attributes:true,attributeFilter:['style']});
    window.addEventListener('pagehide', () => chalk().updateStorage());
    updatePosition(); syncDrawing();
  }
};
