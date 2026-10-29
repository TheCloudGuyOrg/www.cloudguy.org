/*
 * Pikes Pack mockup: screens and navigation.
 * Everything is sample data kept in this browser (localStorage). Nothing is sent anywhere.
 * User-typed text is always added with textContent, never as HTML.
 */
(function () {
  'use strict';

  var M = window.PikesMatch;
  var D = window.PikesData;
  var KEY = 'pikespack-mockup-v1';

  /* ---------- Option lists (labels shown on screen) ---------- */
  var O = {
    size: [{ v: 'small', l: 'Small (under about 25 lb)' }, { v: 'medium', l: 'Medium' }, { v: 'large', l: 'Large' }],
    age: [{ v: 'puppy', l: 'Under 1 year (puppy)' }, { v: 'young', l: '1 to 2 years' }, { v: 'adult', l: '3 to 6 years' }, { v: 'senior', l: '7 years or more' }],
    sex: [{ v: 'F', l: 'Female' }, { v: 'M', l: 'Male' }],
    fixed: [{ v: 'yes', l: 'Spayed / neutered' }, { v: 'no', l: 'Intact' }],
    vaccinated: [{ v: 'yes', l: 'Yes, up to date' }, { v: 'no', l: 'Not yet / not sure' }],
    energy: [{ v: '0', l: 'Low' }, { v: '1', l: 'Medium' }, { v: '2', l: 'High' }],
    play: [{ v: 'chase', l: 'Chasing' }, { v: 'wrestle', l: 'Wrestling' }, { v: 'fetch', l: 'Fetch / ball' }, { v: 'tug', l: 'Tug' },
      { v: 'gentle', l: 'Gentle sniff-and-stroll' }, { v: 'none', l: 'Not into playing' }],
    intensity: [{ v: '0', l: 'Gentle' }, { v: '1', l: 'Moderate' }, { v: '2', l: 'Rough' }],
    greeting: [{ v: 'eager', l: 'Eager greeter' }, { v: 'polite', l: 'Polite' }, { v: 'shy', l: 'Shy, warms up slowly' }, { v: 'selective', l: 'Selective' }],
    bite: [{ v: 'none', l: 'None' }, { v: 'minor', l: 'Minor (once or twice)' }, { v: 'yes', l: 'Yes' }],
    reactive: [{ v: 'no', l: 'No' }, { v: 'sometimes', l: 'Sometimes' }, { v: 'yes', l: 'Yes' }],
    guards: [{ v: 'no', l: 'No' }, { v: 'sometimes', l: 'Sometimes' }, { v: 'yes', l: 'Yes' }],
    group: [{ v: 'one', l: 'One-on-one' }, { v: 'small', l: 'Small group' }, { v: 'busy', l: 'Busy park' }],
    recall: [{ v: 'reliable', l: 'Reliable' }, { v: 'sometimes', l: 'Sometimes' }, { v: 'leash', l: 'Leash only' }]
  };

  function labelOf(group, value) {
    var list = O[group] || [];
    for (var i = 0; i < list.length; i++) if (String(list[i].v) === String(value)) return list[i].l;
    return String(value);
  }

  var AGE_SHORT = { puppy: 'Puppy', young: '1 to 2 yrs', adult: '3 to 6 yrs', senior: '7+ yrs' };

  /* ---------- State ---------- */
  function freshState() {
    return {
      me: null,
      prefs: { maxMiles: 10, fixed: 'fixed', relaxedOnly: true },
      liked: [], passed: [], blocked: [],
      matches: [], messages: {}, meetups: []
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(freshState(), JSON.parse(raw));
    } catch (e) { /* storage unavailable: start fresh */ }
    return freshState();
  }

  var state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  /* ---------- Small helpers ---------- */
  function el(tag, attrs) {
    var n = document.createElement(tag);
    var a = attrs || {};
    Object.keys(a).forEach(function (k) {
      var v = a[k];
      if (v === false || v === null || v === undefined) return;
      if (k === 'class') n.className = v;
      else if (k.indexOf('on') === 0 && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) append(n, arguments[i]);
    return n;
  }

  function append(parent, kid) {
    if (kid === null || kid === undefined || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(parent, k); }); return; }
    parent.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }

  var live = document.getElementById('live');
  function say(msg) {
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 40);
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function avatar(dog, large) {
    var a = el('div', {
      class: 'avatar' + (large ? ' large' : ''),
      role: 'img',
      'aria-label': 'Illustration for ' + dog.name
    }, dog.emoji || '🐕');
    a.style.background = 'linear-gradient(135deg, hsl(' + (dog.hue || 150) + ', 70%, 85%), hsl(' + (((dog.hue || 150) + 40) % 360) + ', 65%, 75%))';
    return a;
  }

  function findDog(id) {
    for (var i = 0; i < D.dogs.length; i++) if (D.dogs[i].id === id) return D.dogs[i];
    return null;
  }

  function stamp() { return Date.now(); }

  function radioGroup(name, legend, options, current, help) {
    return el('fieldset', { class: 'field' },
      el('legend', null, legend),
      help ? el('p', { class: 'help' }, help) : null,
      el('div', { class: 'options' }, options.map(function (o) {
        var id = 'f-' + name + '-' + o.v;
        return el('label', { class: 'opt', for: id },
          el('input', { type: 'radio', name: name, id: id, value: o.v, required: true, checked: String(current) === String(o.v) }),
          el('span', null, o.l));
      })));
  }

  function checkGroup(name, legend, options, current, help) {
    return el('fieldset', { class: 'field' },
      el('legend', null, legend),
      help ? el('p', { class: 'help' }, help) : null,
      el('div', { class: 'options' }, options.map(function (o) {
        var id = 'f-' + name + '-' + o.v;
        return el('label', { class: 'opt', for: id },
          el('input', { type: 'checkbox', name: name, id: id, value: o.v, checked: current.indexOf(o.v) >= 0 }),
          el('span', null, o.l));
      })));
  }

  /* ---------- Matching helpers ---------- */
  function hasMatch(id) { return state.matches.indexOf(id) >= 0; }

  function addMessage(id, from, text) {
    if (!state.messages[id]) state.messages[id] = [];
    state.messages[id].push({ from: from, text: text, t: stamp() });
  }

  function createMatch(dog) {
    state.matches.push(dog.id);
    addMessage(dog.id, 'sys', 'You matched with ' + dog.name + '. Say hi and suggest a dog park.');
    addMessage(dog.id, 'them', 'Hi! This is ' + dog.owner + ', ' + dog.name + "'s person. " + dog.name + ' would love a playdate with ' + state.me.name + '.');
  }

  function lastMessage(id) {
    var list = state.messages[id] || [];
    return list.length ? list[list.length - 1] : null;
  }

  /* ---------- Router ---------- */
  var app = document.getElementById('app');
  var tabs = document.getElementById('tabs');
  var cleanup = null;

  var views = {
    welcome: { title: 'Welcome', fn: viewWelcome, chrome: false },
    setup: { title: 'Your dog', fn: viewSetup, chrome: false },
    discover: { title: 'Discover', fn: viewDiscover, chrome: true, needsDog: true },
    matches: { title: 'Matches', fn: viewMatches, chrome: true, needsDog: true },
    chat: { title: 'Chat', fn: viewChat, chrome: true, needsDog: true, tab: 'matches' },
    meetup: { title: 'Plan a meetup', fn: viewMeetup, chrome: true, needsDog: true, tab: 'matches' },
    profile: { title: 'My dog', fn: viewProfile, chrome: true, needsDog: true },
    safety: { title: 'Safety', fn: viewSafety, chrome: true }
  };

  function go(path) { location.hash = '#/' + path; }

  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var name = parts[0] || 'welcome';
    var arg = parts[1];
    var v = views[name];
    if (!v) { go('welcome'); return; }
    if (v.needsDog && !state.me) { go('welcome'); return; }

    if (cleanup) { cleanup(); cleanup = null; }
    var node = v.fn(arg);
    app.replaceChildren(node);

    tabs.hidden = !v.chrome;
    var current = v.tab || name;
    Array.prototype.forEach.call(tabs.querySelectorAll('a'), function (a) {
      if (a.getAttribute('data-route') === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    document.title = v.title + ' | Pikes Pack (mockup)';
    window.scrollTo(0, 0);
    var h = app.querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  window.addEventListener('hashchange', route);
  document.getElementById('skip').addEventListener('click', function () { app.focus(); });

  /* ---------- Welcome ---------- */
  function viewWelcome() {
    return el('section', null,
      el('div', { class: 'hero' },
        el('div', { class: 'big', 'aria-hidden': 'true' }, '🐕⛰️'),
        el('h1', null, 'Pikes Pack'),
        el('p', null, 'Playdates for dogs in Colorado Springs. Match with dogs that play like yours, then meet at a public dog park.')),
      el('ul', { class: 'feature-list' },
        el('li', null, el('strong', null, '1. Tell us about your dog. '), 'Size, energy, how they like to play.'),
        el('li', null, el('strong', null, '2. Swipe on nearby dogs. '), 'We show the best fits first and hide the risky ones.'),
        el('li', null, el('strong', null, '3. Match, chat, meet. '), 'Pick a dog park and a time that works for both of you.')),
      el('div', { class: 'btn-row' },
        el('a', { class: 'btn btn-primary btn-block', href: '#/setup' }, state.me ? 'Edit my dog\'s profile' : 'Create my dog\'s profile'),
        el('button', { type: 'button', class: 'btn btn-secondary btn-block', onclick: function () {
          state = freshState();
          state.me = Object.assign({}, D.demoDog);
          save();
          go('discover');
        } }, 'Try it with a demo dog'),
        state.me ? el('a', { class: 'btn btn-quiet btn-block', href: '#/discover' }, 'Back to swiping') : null),
      el('p', { class: 'note' }, 'Mockup only. The dogs, owners and parks are made up, and everything stays in this browser.'));
  }

  /* ---------- Setup (dog profile + temperament questions) ---------- */
  function viewSetup() {
    var d = state.me || {
      name: '', breed: '', size: 'medium', age: 'adult', sex: 'M', fixed: true, vaccinated: true,
      energy: 1, play: ['fetch'], intensity: 1, comfort: ['medium'], greeting: 'polite', bite: 'none',
      reactive: 'no', guards: 'no', group: 'small', recall: 'sometimes', limits: '', bio: '', inHeat: false
    };
    var error = el('p', { class: 'error', role: 'alert', hidden: true });

    var form = el('form', { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var name = String(fd.get('name') || '').trim().slice(0, 30);
      var play = fd.getAll('play');
      var comfort = fd.getAll('comfort');
      var problem = null;
      if (!name) problem = 'Please enter your dog\'s name.';
      else if (!fd.get('size') || !fd.get('age') || !fd.get('sex') || !fd.get('fixed') || !fd.get('vaccinated')) problem = 'Please answer every question in "About your dog".';
      else if (!play.length) problem = 'Pick at least one play style (or "Not into playing").';
      else if (!comfort.length) problem = 'Pick at least one size your dog plays well with.';
      else if (['energy', 'intensity', 'greeting', 'bite', 'reactive', 'guards', 'group', 'recall'].some(function (k) { return !fd.get(k); })) problem = 'Please answer every temperament question.';
      if (problem) { error.textContent = problem; error.hidden = false; if (error.scrollIntoView) error.scrollIntoView({ block: 'center' }); return; }

      state.me = {
        name: name,
        breed: String(fd.get('breed') || '').trim().slice(0, 40) || 'Mixed breed',
        size: fd.get('size'), age: fd.get('age'), sex: fd.get('sex'),
        fixed: fd.get('fixed') === 'yes', vaccinated: fd.get('vaccinated') === 'yes',
        energy: Number(fd.get('energy')), play: play, intensity: Number(fd.get('intensity')), comfort: comfort,
        greeting: fd.get('greeting'), bite: fd.get('bite'), reactive: fd.get('reactive'), guards: fd.get('guards'),
        group: fd.get('group'), recall: fd.get('recall'),
        limits: String(fd.get('limits') || '').trim().slice(0, 100),
        bio: String(fd.get('bio') || '').trim().slice(0, 140),
        inHeat: state.me ? !!state.me.inHeat : false,
        emoji: '🐕', hue: 150
      };
      save();
      go('discover');
    } },
      el('h1', null, state.me ? 'Edit your dog' : 'Tell us about your dog'),
      el('p', { class: 'muted' }, 'About 2 minutes. Answers are reported by you and are not verified.'),
      error,
      el('h2', { class: 'section-title' }, 'About your dog'),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-name' }, 'Name'),
        el('input', { type: 'text', id: 'f-name', name: 'name', maxlength: '30', autocomplete: 'off', required: true, value: d.name })),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-breed' }, 'Breed or mix'),
        el('input', { type: 'text', id: 'f-breed', name: 'breed', maxlength: '40', autocomplete: 'off', value: d.breed })),
      radioGroup('size', 'Size', O.size, d.size),
      radioGroup('age', 'Age', O.age, d.age, 'Puppies can join once their vaccine series is complete.'),
      radioGroup('sex', 'Sex', O.sex, d.sex),
      radioGroup('fixed', 'Spayed / neutered?', O.fixed, d.fixed ? 'yes' : 'no'),
      radioGroup('vaccinated', 'Vaccinations up to date?', O.vaccinated, d.vaccinated ? 'yes' : 'no', 'Owner-reported. We do not verify records.'),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-bio' }, 'Short bio (optional)'),
        el('textarea', { id: 'f-bio', name: 'bio', maxlength: '140' }, d.bio)),

      el('h2', { class: 'section-title' }, 'How your dog plays'),
      radioGroup('energy', 'Energy level', O.energy, d.energy),
      checkGroup('play', 'Play style (pick any)', O.play, d.play),
      radioGroup('intensity', 'Play intensity', O.intensity, d.intensity),
      checkGroup('comfort', 'Plays well with (pick any)', O.size, d.comfort, 'Both owners\' answers must allow the pairing.'),
      radioGroup('greeting', 'Meeting new dogs', O.greeting, d.greeting),
      radioGroup('group', 'Best in', O.group, d.group),
      radioGroup('recall', 'Off-leash recall', O.recall, d.recall),

      el('h2', { class: 'section-title' }, 'Safety (be honest, it keeps dogs safe)'),
      radioGroup('bite', 'Any history of snapping, biting or fights with dogs?', O.bite, d.bite),
      radioGroup('reactive', 'Reactive on leash?', O.reactive, d.reactive),
      radioGroup('guards', 'Guards toys, treats or people?', O.guards, d.guards),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-limits' }, 'Limits (optional)'),
        el('p', { class: 'help', id: 'f-limits-help' }, 'For example: sore hips, afraid of loud noises.'),
        el('input', { type: 'text', id: 'f-limits', name: 'limits', maxlength: '100', 'aria-describedby': 'f-limits-help', value: d.limits })),
      el('div', { class: 'btn-row' },
        el('button', { type: 'submit', class: 'btn btn-primary' }, state.me ? 'Save' : 'Start swiping'),
        el('a', { class: 'btn btn-quiet', href: state.me ? '#/profile' : '#/welcome' }, 'Cancel')));

    return el('section', null, form);
  }

  /* ---------- Discover ---------- */
  function viewDiscover() {
    var busy = false;
    var stage = el('div', { class: 'stage' });
    var actions = el('div', { class: 'actions' });
    var hint = el('p', { class: 'hint' }, 'Tip: drag the card, or use the left and right arrow keys.');

    function queue() {
      var seen = {};
      state.liked.concat(state.passed, state.blocked).forEach(function (id) { seen[id] = true; });
      var pool = D.dogs.filter(function (d) { return !seen[d.id]; });
      return M.rank(state.me, pool, state.prefs);
    }

    function hiddenCount() {
      var seen = {};
      state.liked.concat(state.passed, state.blocked).forEach(function (id) { seen[id] = true; });
      return D.dogs.filter(function (d) { return !seen[d.id]; }).length - queue().length;
    }

    function renderStage() {
      busy = false;
      stage.replaceChildren();
      var q = queue();
      if (!q.length) {
        actions.hidden = true;
        hint.hidden = true;
        stage.append(el('div', { class: 'empty' },
          el('div', { class: 'big', 'aria-hidden': 'true' }, '🌲'),
          el('h2', null, 'No more dogs for now'),
          el('p', null, 'Try a wider distance, or bring back dogs you passed on.'),
          el('button', { type: 'button', class: 'btn btn-secondary', onclick: function () { state.passed = []; save(); renderStage(); } }, 'Show passed dogs again')));
        return;
      }
      actions.hidden = false;
      hint.hidden = false;
      stage.append(card(q[0]));
      hint.textContent = 'Tip: drag the card, or use the left and right arrow keys. ' +
        (hiddenCount() > 0 ? hiddenCount() + ' dog(s) hidden by your filters and safety settings.' : '');
    }

    function card(entry) {
      var dog = entry.dog;
      var c = el('article', { class: 'card', 'aria-label': dog.name + ', ' + dog.breed });
      var chips = [];
      chips.push(el('li', { class: 'chip ' + (dog.fixed ? 'ok' : '') }, dog.fixed ? 'Spayed / neutered' : 'Intact'));
      chips.push(el('li', { class: 'chip ' + (dog.vaccinated ? 'ok' : 'caution') }, dog.vaccinated ? 'Vaccinated (owner-reported)' : 'Vaccination not confirmed'));
      chips.push(el('li', { class: 'chip' }, M.ENERGY[dog.energy] + ' energy'));
      dog.play.forEach(function (p) { if (p !== 'none') chips.push(el('li', { class: 'chip' }, labelOf('play', p))); });
      chips.push(el('li', { class: 'chip' }, labelOf('greeting', dog.greeting)));
      chips.push(el('li', { class: 'chip' }, 'Recall: ' + labelOf('recall', dog.recall).toLowerCase()));
      if (dog.bite !== 'none') chips.push(el('li', { class: 'chip caution' }, 'Past snapping: ' + labelOf('bite', dog.bite).toLowerCase()));
      if (dog.reactive !== 'no') chips.push(el('li', { class: 'chip caution' }, 'Leash reactive: ' + dog.reactive));
      if (dog.guards !== 'no') chips.push(el('li', { class: 'chip caution' }, 'Guards things: ' + dog.guards));
      if (dog.limits) chips.push(el('li', { class: 'chip caution' }, dog.limits));

      c.append(
        avatar(dog, true),
        el('h2', null, dog.name + ', ' + AGE_SHORT[dog.age]),
        el('p', { class: 'sub' }, dog.breed + ' · ' + labelOf('size', dog.size).split(' (')[0] + ' · about ' + dog.miles + ' mi, ' + dog.area),
        el('p', null, dog.bio),
        el('div', { class: 'fit' }, el('span', { class: 'score' }, entry.score + '%'), M.fitLabel(entry.score)),
        entry.reasons.length ? el('ul', { class: 'reasons' }, entry.reasons.map(function (r) { return el('li', null, r); })) : null,
        el('ul', { class: 'chips' }, chips),
        el('div', { class: 'card-foot' },
          el('span', { class: 'muted small' }, 'Owner: ' + dog.owner),
          el('button', { type: 'button', class: 'link-btn', onclick: function () {
            if (window.confirm('Report ' + dog.name + '\'s profile? (Mockup: nothing is sent.)')) say('Reported. A moderator would review this.');
          } }, 'Report')));
      enableDrag(c, entry);
      return c;
    }

    function decide(entry, like, cardEl) {
      if (busy) return;
      busy = true;
      var dog = entry.dog;
      function finish() {
        if (!stage.isConnected) return; // user left the screen mid-swipe
        if (like) {
          state.liked.push(dog.id);
          if (dog.likesYou && !hasMatch(dog.id)) {
            createMatch(dog);
            save();
            renderStage();
            showMatch(dog);
            return;
          }
          say('Liked ' + dog.name);
        } else {
          state.passed.push(dog.id);
          say('Passed on ' + dog.name);
        }
        save();
        renderStage();
      }
      if (cardEl && !reduceMotion) {
        cardEl.style.transform = 'translateX(' + (like ? 420 : -420) + 'px) rotate(' + (like ? 22 : -22) + 'deg)';
        cardEl.style.opacity = '0';
        setTimeout(finish, 230);
      } else {
        finish();
      }
    }

    function enableDrag(cardEl, entry) {
      var startX = null;
      var dx = 0;
      cardEl.addEventListener('pointerdown', function (e) {
        if (busy || e.target.closest('button, a')) return;
        startX = e.clientX; dx = 0;
        cardEl.setPointerCapture(e.pointerId);
        cardEl.classList.add('dragging');
      });
      cardEl.addEventListener('pointermove', function (e) {
        if (startX === null) return;
        dx = e.clientX - startX;
        cardEl.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 20) + 'deg)';
      });
      function end() {
        if (startX === null) return;
        startX = null;
        cardEl.classList.remove('dragging');
        if (Math.abs(dx) > 110) decide(entry, dx > 0, cardEl);
        else cardEl.style.transform = '';
      }
      cardEl.addEventListener('pointerup', end);
      cardEl.addEventListener('pointercancel', end);
    }

    function topEntry() { var q = queue(); return q.length ? q[0] : null; }

    function showMatch(dog) {
      var dlg = el('dialog', { 'aria-labelledby': 'match-title' },
        el('div', { class: 'pair' }, avatar(state.me), el('span', { 'aria-hidden': 'true' }, '💚'), avatar(dog)),
        el('h2', { id: 'match-title' }, "It's a match!"),
        el('p', null, state.me.name + ' and ' + dog.name + ' liked each other.'),
        el('div', { class: 'btn-row', style: 'justify-content:center' },
          el('button', { type: 'button', class: 'btn btn-primary', onclick: function () { closeDialog(dlg); go('chat/' + dog.id); } }, 'Send a message'),
          el('button', { type: 'button', class: 'btn btn-quiet', onclick: function () { closeDialog(dlg); } }, 'Keep swiping')));
      dlg.addEventListener('close', function () { dlg.remove(); });
      app.append(dlg);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      say("It's a match with " + dog.name);
    }

    function closeDialog(dlg) {
      if (typeof dlg.close === 'function') dlg.close();
      else dlg.remove();
    }

    function onKey(e) {
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || document.querySelector('dialog[open]')) return;
      var t = topEntry();
      if (!t) return;
      var cardEl = stage.querySelector('.card');
      if (e.key === 'ArrowRight') { e.preventDefault(); decide(t, true, cardEl); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); decide(t, false, cardEl); }
    }
    document.addEventListener('keydown', onKey);
    cleanup = function () { document.removeEventListener('keydown', onKey); };

    actions.append(
      el('button', { type: 'button', class: 'round pass', 'aria-label': 'Pass', onclick: function () {
        var t = topEntry(); if (t) decide(t, false, stage.querySelector('.card')); } }, '✕'),
      el('button', { type: 'button', class: 'round like', 'aria-label': 'Like', onclick: function () {
        var t = topEntry(); if (t) decide(t, true, stage.querySelector('.card')); } }, '♥'));

    /* Filters */
    var p = state.prefs;
    function prefChanged() { save(); renderStage(); }
    var filters = el('details', { class: 'filters' },
      el('summary', null, 'Filters and safety'),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'p-miles' }, 'Distance'),
        el('select', { id: 'p-miles', onchange: function (e) { p.maxMiles = Number(e.target.value); prefChanged(); } },
          [2, 5, 10, 25].map(function (m) { return el('option', { value: String(m), selected: p.maxMiles === m }, 'Within ' + m + ' miles'); }))),
      el('fieldset', { class: 'field' },
        el('legend', null, 'Show dogs that are'),
        el('div', { class: 'options' }, [
          { v: 'fixed', l: 'Spayed / neutered' }, { v: 'both', l: 'Either' }, { v: 'intact', l: 'Intact' }
        ].map(function (o) {
          var id = 'p-fixed-' + o.v;
          return el('label', { class: 'opt', for: id },
            el('input', { type: 'radio', name: 'p-fixed', id: id, value: o.v, checked: p.fixed === o.v, onchange: function () { p.fixed = o.v; prefChanged(); } }),
            el('span', null, o.l));
        }))),
      el('div', { class: 'field' },
        el('label', { for: 'p-relaxed' },
          el('input', { type: 'checkbox', id: 'p-relaxed', checked: p.relaxedOnly, onchange: function (e) { p.relaxedOnly = e.target.checked; prefChanged(); } }),
          ' Only show relaxed dogs (no snapping history, not leash reactive)')),
      el('p', { class: 'help' }, 'Dogs with a "yes" to snapping or fights are always hidden. Puppies appear once their vaccine series is complete.'));

    renderStage();

    return el('section', null,
      el('div', { class: 'topline' }, el('h1', null, 'Discover'), el('span', { class: 'muted small' }, 'for ' + state.me.name)),
      filters, stage, actions, hint);
  }

  /* ---------- Matches ---------- */
  function viewMatches() {
    var list = state.matches.map(findDog).filter(Boolean);
    var meetups = state.meetups.slice().sort(function (a, b) { return a.when.localeCompare(b.when); });

    return el('section', null,
      el('h1', null, 'Matches'),
      list.length ? el('ul', { class: 'list' }, list.map(function (dog) {
        var last = lastMessage(dog.id);
        return el('li', null, el('a', { class: 'row', href: '#/chat/' + dog.id },
          avatar(dog),
          el('div', { class: 'grow' }, el('strong', null, dog.name + ' · ' + dog.owner), el('span', { class: 'preview' }, last ? last.text : 'Say hi!')),
          el('span', { 'aria-hidden': 'true' }, '›')));
      })) : el('div', { class: 'empty' },
        el('div', { class: 'big', 'aria-hidden': 'true' }, '💌'),
        el('p', null, 'No matches yet. Keep swiping!'),
        el('a', { class: 'btn btn-primary', href: '#/discover' }, 'Back to Discover')),
      meetups.length ? el('h2', null, 'Meetups') : null,
      meetups.length ? el('ul', { class: 'list' }, meetups.map(function (m) {
        var dog = findDog(m.dogId);
        return el('li', null, el('div', { class: 'row' },
          avatar(dog),
          el('div', { class: 'grow' },
            el('strong', null, 'With ' + dog.name + ' at ' + m.parkName),
            el('span', { class: 'preview' }, new Date(m.when).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }))),
          el('span', { class: 'status' + (m.status === 'Accepted' ? ' ok' : '') }, m.status)));
      })) : null);
  }

  /* ---------- Chat ---------- */
  var REPLIES = [
    'That sounds great! What time were you thinking?',
    'Perfect, we can be there. Does a weekend morning work?',
    'Love it. Maybe the dog park, so they can run?'
  ];

  function viewChat(id) {
    var dog = findDog(id);
    if (!dog || !hasMatch(id)) { go('matches'); return el('section'); }
    var log = el('div', { class: 'messages', role: 'log', 'aria-live': 'polite', 'aria-label': 'Messages with ' + dog.name, tabindex: '0' });
    var input = el('input', { type: 'text', id: 'chat-input', maxlength: '300', autocomplete: 'off', 'aria-label': 'Message to ' + dog.owner, placeholder: 'Write a message' });
    var timer = null;

    function renderMessages() {
      log.replaceChildren();
      (state.messages[id] || []).forEach(function (m) {
        log.append(el('div', { class: 'bubble ' + (m.from === 'me' ? 'me' : m.from === 'sys' ? 'sys' : '') }, m.text));
      });
      log.scrollTop = log.scrollHeight;
    }

    var form = el('form', { class: 'chat-form', onsubmit: function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      addMessage(id, 'me', text);
      input.value = '';
      save();
      renderMessages();
      clearTimeout(timer);
      timer = setTimeout(function () {
        addMessage(id, 'them', REPLIES[(state.messages[id].length) % REPLIES.length]);
        save();
        if (location.hash === '#/chat/' + id) renderMessages();
      }, 1100);
    } }, input, el('button', { type: 'submit', class: 'btn btn-primary' }, 'Send'));

    cleanup = function () { clearTimeout(timer); };
    renderMessages();

    return el('section', null,
      el('div', { class: 'chat-head' }, avatar(dog), el('div', null, el('h1', null, dog.name), el('span', { class: 'muted small' }, dog.owner + ' · ' + dog.breed))),
      el('p', { class: 'note' }, 'Never share your home address. Meet only at public dog parks.'),
      log, form,
      el('div', { class: 'btn-row' },
        el('a', { class: 'btn btn-accent', href: '#/meetup/' + id }, 'Plan a meetup'),
        el('button', { type: 'button', class: 'btn btn-quiet', onclick: function () {
          if (window.confirm('Report this conversation? (Mockup: nothing is sent.)')) say('Reported. A moderator would review this.');
        } }, 'Report'),
        el('button', { type: 'button', class: 'btn btn-quiet', onclick: function () {
          if (window.confirm('Block ' + dog.owner + '? You will not see each other again.')) {
            state.blocked.push(id);
            state.matches = state.matches.filter(function (m) { return m !== id; });
            save();
            go('matches');
          }
        } }, 'Block')));
  }

  /* ---------- Meetup planner ---------- */
  function localDate(offsetDays) {
    var d = new Date();
    d.setDate(d.getDate() + offsetDays);
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  function viewMeetup(id) {
    var dog = findDog(id);
    if (!dog || !hasMatch(id)) { go('matches'); return el('section'); }

    var me = state.me;
    var blockedMsg = null;
    if (M.stageOf(me.age) === 'puppy' && !me.vaccinated) blockedMsg = me.name + ' can join park meetups once the vaccine series is complete.';
    else if (me.inHeat) blockedMsg = me.name + ' is marked as in heat, so meetups are paused. You can change this on the My dog page.';

    var error = el('p', { class: 'error', role: 'alert', hidden: true });
    var parkSel = el('select', { id: 'm-park', required: true },
      el('option', { value: '' }, 'Choose a park'),
      D.parks.map(function (p) { return el('option', { value: p.id }, p.name); }));
    var date = el('input', { type: 'date', id: 'm-date', required: true, min: localDate(0), value: localDate(2) });
    var time = el('input', { type: 'time', id: 'm-time', required: true, value: '10:00' });

    var form = el('form', { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      var park = D.parks.filter(function (p) { return p.id === parkSel.value; })[0];
      if (!park || !date.value || !time.value) { error.textContent = 'Please choose a park, a date and a time.'; error.hidden = false; return; }
      var when = date.value + 'T' + time.value;
      if (new Date(when).getTime() < Date.now()) { error.textContent = 'Please pick a time in the future.'; error.hidden = false; return; }
      var nice = new Date(when).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      var meetup = { dogId: id, parkName: park.name, when: when, status: 'Proposed' };
      state.meetups.push(meetup);
      addMessage(id, 'sys', 'You proposed ' + nice + ' at ' + park.name + '.');
      save();
      setTimeout(function () {
        meetup.status = 'Accepted';
        addMessage(id, 'them', 'That works for us! See you at ' + park.name + '.');
        save();
        say(dog.owner + ' accepted the meetup.');
      }, 2500);
      go('chat/' + id);
    } },
      error,
      el('div', { class: 'field' }, el('label', { class: 'lbl', for: 'm-park' }, 'Dog park'), parkSel,
        el('p', { class: 'help' }, 'Sample list only. Real parks, hours and rules will come from city data and be checked by hand.')),
      el('div', { class: 'field' }, el('label', { class: 'lbl', for: 'm-date' }, 'Date'), date),
      el('div', { class: 'field' }, el('label', { class: 'lbl', for: 'm-time' }, 'Time'), time),
      el('div', { class: 'btn-row' },
        el('button', { type: 'submit', class: 'btn btn-primary' }, 'Send invite'),
        el('a', { class: 'btn btn-quiet', href: '#/chat/' + id }, 'Back to chat')));

    return el('section', null,
      el('h1', null, 'Meet up with ' + dog.name),
      blockedMsg ? el('p', { class: 'note' }, blockedMsg) : form,
      el('h2', null, 'Before you go'),
      el('ul', null,
        el('li', null, 'Meet only at a public, designated off-leash dog park.'),
        el('li', null, 'Keep dogs leashed until you are inside the off-leash area.'),
        el('li', null, 'Bring water and waste bags. Daytime visits are best.'),
        el('li', null, 'Do a short, calm introduction. Leave if either dog is stressed.')));
  }

  /* ---------- My dog ---------- */
  function viewProfile() {
    var d = state.me;
    var isIntactFemale = d.sex === 'F' && !d.fixed;
    var rows = [
      ['Breed', d.breed], ['Size', labelOf('size', d.size).split(' (')[0]], ['Age', labelOf('age', d.age)],
      ['Sex', labelOf('sex', d.sex)], ['Spayed / neutered', d.fixed ? 'Yes' : 'No (intact)'],
      ['Vaccinated', d.vaccinated ? 'Yes (owner-reported)' : 'Not confirmed'],
      ['Energy', M.ENERGY[d.energy]],
      ['Play styles', d.play.map(function (p) { return labelOf('play', p); }).join(', ')],
      ['Play intensity', M.INTENSITY[d.intensity]],
      ['Plays well with', d.comfort.map(function (s) { return labelOf('size', s).split(' (')[0]; }).join(', ')],
      ['Meeting new dogs', labelOf('greeting', d.greeting)], ['Best in', labelOf('group', d.group)],
      ['Off-leash recall', labelOf('recall', d.recall)], ['Past snapping', labelOf('bite', d.bite)],
      ['Leash reactive', labelOf('reactive', d.reactive)], ['Guards things', labelOf('guards', d.guards)]
    ];
    if (d.limits) rows.push(['Limits', d.limits]);

    return el('section', null,
      el('div', { class: 'chat-head' }, avatar(d), el('div', null, el('h1', null, d.name), el('span', { class: 'muted small' }, d.bio || ''))),
      el('dl', { class: 'facts' }, rows.map(function (r) { return [el('dt', null, r[0]), el('dd', null, r[1])]; })),
      isIntactFemale ? el('div', { class: 'field' },
        el('label', { for: 'in-heat' },
          el('input', { type: 'checkbox', id: 'in-heat', checked: !!d.inHeat, onchange: function (e) {
            state.me.inHeat = e.target.checked; save();
            say(e.target.checked ? 'Meetups paused while in heat' : 'Meetups available again');
          } }), ' Currently in heat (pauses meetup scheduling)')) : null,
      el('div', { class: 'btn-row' },
        el('a', { class: 'btn btn-primary', href: '#/setup' }, 'Edit profile'),
        el('button', { type: 'button', class: 'btn btn-quiet', onclick: function () {
          if (window.confirm('Reset the demo? This clears your dog, matches and messages in this browser.')) {
            state = freshState(); save(); go('welcome');
          }
        } }, 'Reset demo')));
  }

  /* ---------- Safety ---------- */
  function viewSafety() {
    return el('section', null,
      el('h1', null, 'Safety and community rules'),
      el('p', { class: 'muted' }, 'Draft wording for the mockup. A real version should be reviewed before launch.'),
      el('h2', null, 'Meeting up'),
      el('ul', null,
        el('li', null, 'Meet only at public, designated off-leash dog parks. Colorado Springs city code requires dogs to be leashed in city parks and on trails except in designated off-leash areas.'),
        el('li', null, 'Daytime meetups are best, and you can bring a friend.'),
        el('li', null, 'Never share your home address. We only show an approximate area.'),
        el('li', null, 'Leave if either dog seems stressed. You can always say no.')),
      el('h2', null, 'Dogs'),
      el('ul', null,
        el('li', null, 'Vaccination and spay/neuter answers come from owners and are not verified.'),
        el('li', null, 'Be honest about snapping, leash reactivity and guarding. Dogs with a snapping history are hidden from most owners.'),
        el('li', null, 'Puppies appear once their vaccine series is complete. Female dogs in heat pause meetups.')),
      el('h2', null, 'Community'),
      el('ul', null,
        el('li', null, 'You must be 18 or older.'),
        el('li', null, 'This app is for dog playdates. It does not support breeding or selling animals, and it is not a dating site for people.'),
        el('li', null, 'Report or block anyone who makes you uncomfortable. A moderator reviews reports.')));
  }

  /* ---------- Start ---------- */
  if (/[?&]demo=1\b/.test(location.search) && !state.me) {
    state.me = Object.assign({}, D.demoDog);
    save();
  }
  if (!location.hash) location.hash = '#/welcome';
  route();
})();
