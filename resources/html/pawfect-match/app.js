/*
 * Pawfect Match mockup: screens and navigation (breeding-match concept).
 * Everything is sample data kept in this browser (localStorage). Nothing is sent anywhere.
 * User-typed text is always added with textContent, never as HTML.
 */
(function () {
  'use strict';

  var M = window.PikesMatch;
  var D = window.PikesData;
  var KEY = 'pawfectmatch-mockup-v1'; // new name = new saved-data key, so older saved demo data does not linger

  /* ---------- Option lists (labels shown on screen) ---------- */
  var O = {
    size: [{ v: 'small', l: 'Small (under about 25 lb)' }, { v: 'medium', l: 'Medium (about 25 to 60 lb)' }, { v: 'large', l: 'Large (over about 60 lb)' }],
    sex: [{ v: 'F', l: 'Female (dam)' }, { v: 'M', l: 'Male (sire)' }],
    registry: [{ v: 'akc', l: 'AKC' }, { v: 'ukc', l: 'UKC' }, { v: 'other', l: 'Other registry' }, { v: 'none', l: 'Not registered' }],
    experience: [{ v: 'first', l: 'First litter' }, { v: 'proven', l: 'Has bred before' }],
    ready: [{ v: 'now', l: 'Ready now' }, { v: 'soon', l: 'Within 3 months' }, { v: 'later', l: 'Later (planning ahead)' }],
    vaccinated: [{ v: 'yes', l: 'Yes, up to date' }, { v: 'no', l: 'Not yet / not sure' }],
    health: [{ v: 'vet', l: 'Vet exam in the last 12 months' }, { v: 'brucellosis', l: 'Brucellosis test (negative)' },
      { v: 'dna', l: 'DNA / genetic panel' }, { v: 'joints', l: 'Hip and elbow evaluation' },
      { v: 'eyes', l: 'Eye exam' }, { v: 'heart', l: 'Heart exam' }],
    energy: [{ v: '0', l: 'Low' }, { v: '1', l: 'Medium' }, { v: '2', l: 'High' }],
    train: [{ v: 'eager', l: 'Eager to learn' }, { v: 'average', l: 'Average' }, { v: 'independent', l: 'Independent / stubborn' }],
    dogs: [{ v: 'friendly', l: 'Friendly' }, { v: 'selective', l: 'Selective' }, { v: 'poor', l: 'Struggles with other dogs' }],
    kids: [{ v: 'great', l: 'Great with children' }, { v: 'okay', l: 'Okay with children' }, { v: 'untested', l: 'Not tested around children' }],
    strangers: [{ v: 'friendly', l: 'Friendly' }, { v: 'reserved', l: 'Reserved' }, { v: 'wary', l: 'Wary' }],
    fear: [{ v: 'none', l: 'None' }, { v: 'mild', l: 'Mild' }, { v: 'significant', l: 'Significant' }],
    aggression: [{ v: 'none', l: 'None' }, { v: 'minor', l: 'Minor (once or twice)' }, { v: 'yes', l: 'Yes' }],
    purpose: [{ v: 'companion', l: 'Family companions' }, { v: 'show', l: 'Show' }, { v: 'sport', l: 'Sport (agility, obedience)' }, { v: 'working', l: 'Working (hunting, herding, service)' }],
    comp: [{ v: 'fee', l: 'Stud fee' }, { v: 'pick', l: 'Pick of the litter' }, { v: 'discuss', l: 'Open to discuss' }],
    meet: [{ v: 'video', l: 'Video call (no travel)' }, { v: 'owners', l: 'Owners only, no dogs, at a public place' }, { v: 'dogs', l: 'Owners and dogs, leashed, at a public park' }]
  };

  var MEET_SHORT = { video: 'Video call', owners: 'Owners-only meeting', dogs: 'Leashed meeting with dogs' };

  var TEST_SHORT = { vet: 'Vet exam', brucellosis: 'Brucellosis', dna: 'DNA panel', joints: 'Hips/elbows', eyes: 'Eyes', heart: 'Heart' };

  function labelOf(group, value) {
    var list = O[group] || [];
    for (var i = 0; i < list.length; i++) if (String(list[i].v) === String(value)) return list[i].l;
    return String(value);
  }

  function shortLabel(group, value) { return labelOf(group, value).split(' (')[0]; }

  function ageText(age) { return age + (Number(age) === 1 ? ' yr' : ' yrs'); }

  /* ---------- State ---------- */
  function freshState() {
    return {
      me: null,
      prefs: { maxMiles: 50, breed: 'same', minHealth: 'basic', timing: 'any' },
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
      class: 'avatar' + (large ? ' large' : '') + (dog.photo ? ' has-photo' : ''),
      role: 'img',
      'aria-label': (dog.photo ? 'Photo of ' : 'Illustration for ') + dog.name
    }, dog.photo ? el('img', { src: dog.photo, alt: '' }) : (dog.emoji || '🐕'));
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
          el('input', { type: 'radio', name: name, id: id, value: o.v, checked: String(current) === String(o.v) }),
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
    addMessage(dog.id, 'sys', 'You matched with ' + dog.name + '. Introduce yourselves and share your health testing results.');
    addMessage(dog.id, 'them', 'Hi! This is ' + dog.owner + ', ' + dog.name + "'s person. We would love to talk about a possible pairing between " + dog.name + ' and ' + state.me.name + '. Happy to share our health test results.');
  }

  function lastMessage(id) {
    var list = state.messages[id] || [];
    return list.length ? list[list.length - 1] : null;
  }

  function reportedTests(dog) {
    return M.TESTS.filter(function (t) { return dog.health && dog.health[t]; });
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
    meetup: { title: 'Plan a first meeting', fn: viewMeetup, chrome: true, needsDog: true, tab: 'matches' },
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

    document.title = v.title + ' | Pawfect Match (mockup)';
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
        el('h1', null, 'Pawfect Match'),
        el('p', null, 'Connecting dog parents in Colorado Springs who are considering breeding. Find a match by breed, health testing and temperament.')),
      el('ul', { class: 'feature-list' },
        el('li', null, el('strong', null, '1. Tell us about your dog. '), 'Breed, health testing, temperament and what you hope for.'),
        el('li', null, el('strong', null, '2. Swipe on compatible dogs nearby. '), 'We show the best fits first and hide risky or ineligible ones.'),
        el('li', null, el('strong', null, '3. Match, talk, meet. '), 'Share health results, then plan a first meeting in a public place.')),
      el('p', { class: 'note' }, 'For intact dogs ' + M.MIN_AGE + ' years or older, and owners 18 or older. Pawfect Match does not arrange matings, sell dogs or puppies, or handle payments.'),
      el('div', { class: 'btn-row' },
        el('a', { class: 'btn btn-primary btn-block', href: '#/setup' }, state.me ? 'Edit my dog\'s profile' : 'Create my dog\'s profile'),
        el('button', { type: 'button', class: 'btn btn-secondary btn-block', onclick: function () {
          state = freshState();
          state.me = Object.assign({}, D.demoDog);
          save();
          go('discover');
        } }, 'Try it with a demo dog'),
        state.me ? el('a', { class: 'btn btn-quiet btn-block', href: '#/discover' }, 'Back to swiping') : null),
      el('p', { class: 'note' }, 'Mockup only. The dogs, owners, test results and places are made up, and everything stays in this browser.'));
  }

  /* ---------- Setup (dog profile + health + temperament questions) ---------- */
  function viewSetup() {
    var d = state.me || {
      name: '', breed: '', size: 'large', age: 3, sex: 'M', registry: 'akc',
      experience: 'first', ready: 'soon', health: {}, vaccinated: true,
      energy: 1, train: 'average', dogs: 'friendly', kids: 'okay', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'discuss', healthNotes: '', bio: ''
    };
    var checkedTests = M.TESTS.filter(function (t) { return d.health && d.health[t]; });
    var error = el('p', { class: 'error', role: 'alert', hidden: true });

    var form = el('form', { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var name = String(fd.get('name') || '').trim().slice(0, 30);
      var breed = String(fd.get('breed') || '').trim().slice(0, 40);
      var ageNum = Number(fd.get('age'));
      var sex = fd.get('sex');
      var required = ['size', 'sex', 'registry', 'experience', 'ready', 'vaccinated', 'energy', 'train', 'dogs', 'kids',
        'strangers', 'fear', 'aggression', 'purpose', 'comp'];
      var problem = null;
      if (!name) problem = 'Please enter your dog\'s name.';
      else if (!breed) problem = 'Please enter your dog\'s breed.';
      else if (fd.get('age') === '' || isNaN(ageNum) || ageNum < 0 || ageNum > 20) problem = 'Please enter your dog\'s age in years (0 to 20).';
      else if (required.some(function (k) { return !fd.get(k); })) problem = 'Please answer every question marked with options.';
      else problem = M.ageProblem(ageNum, sex);
      if (problem) { error.textContent = problem; error.hidden = false; if (error.scrollIntoView) error.scrollIntoView({ block: 'center' }); return; }

      var health = {};
      fd.getAll('health').forEach(function (t) { health[t] = true; });
      state.me = {
        name: name, breed: breed, size: fd.get('size'), age: ageNum, sex: sex, registry: fd.get('registry'),
        experience: fd.get('experience'), ready: fd.get('ready'), health: health, vaccinated: fd.get('vaccinated') === 'yes',
        energy: Number(fd.get('energy')), train: fd.get('train'), dogs: fd.get('dogs'), kids: fd.get('kids'),
        strangers: fd.get('strangers'), fear: fd.get('fear'), aggression: fd.get('aggression'),
        purpose: fd.get('purpose'), comp: fd.get('comp'),
        healthNotes: String(fd.get('healthNotes') || '').trim().slice(0, 100),
        bio: String(fd.get('bio') || '').trim().slice(0, 140),
        emoji: '🐕', hue: 150, photo: (state.me && state.me.photo) || ''
      };
      save();
      go('discover');
    } },
      el('h1', null, state.me ? 'Edit your dog' : 'Tell us about your dog'),
      el('p', { class: 'muted' }, 'About 3 minutes. Answers are reported by you and are not verified. Pawfect Match is for intact dogs.'),
      error,

      el('h2', { class: 'section-title' }, 'About your dog'),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-name' }, 'Name'),
        el('input', { type: 'text', id: 'f-name', name: 'name', maxlength: '30', autocomplete: 'off', value: d.name })),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-breed' }, 'Breed'),
        el('p', { class: 'help', id: 'f-breed-help' }, 'Start typing to pick from common breeds, or enter your own. Matching uses breed.'),
        el('input', { type: 'text', id: 'f-breed', name: 'breed', maxlength: '40', autocomplete: 'off', list: 'breed-list', 'aria-describedby': 'f-breed-help', value: d.breed }),
        el('datalist', { id: 'breed-list' }, D.breeds.map(function (b) { return el('option', { value: b }); }))),
      radioGroup('sex', 'Sex', O.sex, d.sex),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-age' }, 'Age in years'),
        el('p', { class: 'help', id: 'f-age-help' }, 'Dogs must be at least ' + M.MIN_AGE + ' years old (placeholder rule; confirm with a vet).'),
        el('input', { type: 'number', id: 'f-age', name: 'age', min: '0', max: '20', step: '0.5', inputmode: 'decimal', 'aria-describedby': 'f-age-help', value: String(d.age) })),
      radioGroup('size', 'Size', O.size, d.size),
      radioGroup('registry', 'Registry', O.registry, d.registry),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-bio' }, 'Short bio (optional)'),
        el('textarea', { id: 'f-bio', name: 'bio', maxlength: '140' }, d.bio)),

      el('h2', { class: 'section-title' }, 'Health and breeding readiness'),
      radioGroup('vaccinated', 'Vaccinations up to date?', O.vaccinated, d.vaccinated ? 'yes' : 'no', 'Dogs without current vaccines are not shown to others.'),
      checkGroup('health', 'Health testing done (pick any)', O.health, checkedTests, 'Owner-reported. We do not verify records. Be ready to share results when you match.'),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'f-hn' }, 'Known health issues in your dog or close relatives (optional)'),
        el('input', { type: 'text', id: 'f-hn', name: 'healthNotes', maxlength: '100', value: d.healthNotes })),
      radioGroup('experience', 'Breeding experience', O.experience, d.experience),
      radioGroup('ready', 'When are you hoping to breed?', O.ready, d.ready, 'For a female, think about her next heat cycle. Your vet can help with timing.'),

      el('h2', { class: 'section-title' }, 'Temperament'),
      radioGroup('energy', 'Energy level', O.energy, d.energy),
      radioGroup('train', 'Trainability', O.train, d.train),
      radioGroup('dogs', 'With other dogs', O.dogs, d.dogs),
      radioGroup('kids', 'With children', O.kids, d.kids),
      radioGroup('strangers', 'With strangers', O.strangers, d.strangers),
      radioGroup('fear', 'Fear or anxiety', O.fear, d.fear, 'Temperament can be passed on, so this matters for pairing.'),
      radioGroup('aggression', 'Any history of aggression or biting (people or dogs)?', O.aggression, d.aggression, 'Be honest. Dogs with a history of aggression are not shown to other owners.'),

      el('h2', { class: 'section-title' }, 'Your breeding goals'),
      radioGroup('purpose', 'What are you hoping the puppies will be?', O.purpose, d.purpose),
      radioGroup('comp', 'How would you like to handle compensation?', O.comp, d.comp, 'Owners agree this directly. Pawfect Match does not handle payments or contracts.'),

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
    var hint = el('p', { class: 'hint' }, '');

    function unseenPool() {
      var seen = {};
      state.liked.concat(state.passed, state.blocked).forEach(function (id) { seen[id] = true; });
      return D.dogs.filter(function (d) { return !seen[d.id]; });
    }

    function queue() { return M.rank(state.me, unseenPool(), state.prefs); }

    function renderStage() {
      busy = false;
      stage.replaceChildren();
      var q = queue();
      var hidden = unseenPool().length - q.length;
      if (!q.length) {
        actions.hidden = true;
        hint.hidden = true;
        stage.append(el('div', { class: 'empty' },
          el('div', { class: 'big', 'aria-hidden': 'true' }, '🌲'),
          el('h2', null, 'No more dogs for now'),
          el('p', null, 'Try a wider distance or other breeds, or bring back dogs you passed on.' + (hidden > 0 ? ' ' + hidden + ' dog(s) are hidden by your filters and safety rules.' : '')),
          el('button', { type: 'button', class: 'btn btn-secondary', onclick: function () { state.passed = []; save(); renderStage(); } }, 'Show passed dogs again')));
        return;
      }
      actions.hidden = false;
      hint.hidden = false;
      stage.append(card(q[0]));
      hint.textContent = 'Tip: drag the card, or use the left and right arrow keys. ' +
        (hidden > 0 ? hidden + ' dog(s) hidden by your filters and safety rules.' : '');
    }

    function card(entry) {
      var dog = entry.dog;
      var c = el('article', { class: 'card', 'aria-label': dog.name + ', ' + dog.breed });
      var chips = [];
      chips.push(el('li', { class: 'chip' }, labelOf('registry', dog.registry)));
      chips.push(el('li', { class: 'chip' }, labelOf('experience', dog.experience)));
      chips.push(el('li', { class: 'chip' }, M.READY_LABEL[dog.ready].replace(/^./, function (m) { return m.toUpperCase(); })));
      chips.push(el('li', { class: 'chip' }, 'Goal: ' + labelOf('purpose', dog.purpose).split(' (')[0].toLowerCase()));
      chips.push(el('li', { class: 'chip ok' }, 'Vaccinated (owner-reported)'));
      var tests = reportedTests(dog);
      tests.forEach(function (t) { chips.push(el('li', { class: 'chip ok' }, TEST_SHORT[t])); });
      if (!tests.length) chips.push(el('li', { class: 'chip caution' }, 'No health tests reported'));
      chips.push(el('li', { class: 'chip' }, M.ENERGY[dog.energy] + ' energy'));
      chips.push(el('li', { class: 'chip' }, labelOf('train', dog.train)));
      if (dog.kids === 'untested') chips.push(el('li', { class: 'chip caution' }, 'Not tested around children'));
      if (dog.dogs !== 'friendly') chips.push(el('li', { class: 'chip caution' }, 'With dogs: ' + labelOf('dogs', dog.dogs).toLowerCase()));
      if (dog.strangers === 'wary') chips.push(el('li', { class: 'chip caution' }, 'Wary of strangers'));
      if (dog.fear !== 'none') chips.push(el('li', { class: 'chip caution' }, 'Fear or anxiety: ' + dog.fear));
      if (dog.aggression === 'minor') chips.push(el('li', { class: 'chip caution' }, 'Past aggression: minor'));
      if (dog.healthNotes) chips.push(el('li', { class: 'chip caution' }, dog.healthNotes));

      c.append(
        avatar(dog, true),
        el('h2', null, dog.name + ', ' + ageText(dog.age)),
        el('p', { class: 'sub' }, dog.breed + ' · ' + shortLabel('sex', dog.sex) + ' · ' + shortLabel('size', dog.size) + ' · about ' + dog.miles + ' mi, ' + dog.area),
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

    function closeDialog(dlg) {
      if (typeof dlg.close === 'function') dlg.close();
      else dlg.remove();
    }

    function showMatch(dog) {
      var dlg = el('dialog', { 'aria-labelledby': 'match-title' },
        el('div', { class: 'pair' }, avatar(state.me), el('span', { 'aria-hidden': 'true' }, '💚'), avatar(dog)),
        el('h2', { id: 'match-title' }, "It's a match!"),
        el('p', null, state.me.name + ' and ' + dog.name + ' liked each other. Next, introduce yourselves and share health results.'),
        el('div', { class: 'btn-row', style: 'justify-content:center' },
          el('button', { type: 'button', class: 'btn btn-primary', onclick: function () { closeDialog(dlg); go('chat/' + dog.id); } }, 'Send a message'),
          el('button', { type: 'button', class: 'btn btn-quiet', onclick: function () { closeDialog(dlg); } }, 'Keep swiping')));
      dlg.addEventListener('close', function () { dlg.remove(); });
      app.append(dlg);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      say("It's a match with " + dog.name);
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
    function choice(name, legend, options, current, onPick, help) {
      return el('fieldset', { class: 'field' },
        el('legend', null, legend),
        help ? el('p', { class: 'help' }, help) : null,
        el('div', { class: 'options' }, options.map(function (o) {
          var id = 'p-' + name + '-' + o.v;
          return el('label', { class: 'opt', for: id },
            el('input', { type: 'radio', name: 'p-' + name, id: id, value: o.v, checked: current === o.v, onchange: function () { onPick(o.v); prefChanged(); } }),
            el('span', null, o.l));
        })));
    }
    var filters = el('details', { class: 'filters' },
      el('summary', null, 'Filters and safety'),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'p-miles' }, 'Distance'),
        el('select', { id: 'p-miles', onchange: function (e) { p.maxMiles = Number(e.target.value); prefChanged(); } },
          [10, 25, 50, 100].map(function (m) { return el('option', { value: String(m), selected: p.maxMiles === m }, 'Within ' + m + ' miles'); }))),
      choice('breed', 'Breed', [{ v: 'same', l: 'Same breed only' }, { v: 'any', l: 'Any breed' }], p.breed, function (v) { p.breed = v; }),
      choice('health', 'Health testing', [{ v: 'any', l: 'Any' }, { v: 'basic', l: 'Vet exam + brucellosis' }, { v: 'full', l: 'Plus DNA or joint tests' }],
        p.minHealth, function (v) { p.minHealth = v; }, 'Based on what owners report. Not verified.'),
      choice('timing', 'Timing', [{ v: 'any', l: 'Any' }, { v: 'soon', l: 'Ready within 3 months' }], p.timing, function (v) { p.timing = v; }),
      el('p', { class: 'help' }, 'Always applied: opposite sex, minimum and maximum age, current vaccines, no aggression history, and no extreme size gaps.'));

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
      meetups.length ? el('h2', null, 'First meetings') : null,
      meetups.length ? el('ul', { class: 'list' }, meetups.map(function (m) {
        var dog = findDog(m.dogId);
        return el('li', null, el('div', { class: 'row' },
          avatar(dog),
          el('div', { class: 'grow' },
            el('strong', null, MEET_SHORT[m.kind] + ' with ' + dog.name + (m.place ? ' at ' + m.place : '')),
            el('span', { class: 'preview' }, new Date(m.when).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }))),
          el('span', { class: 'status' + (m.status === 'Accepted' ? ' ok' : '') }, m.status)));
      })) : null);
  }

  /* ---------- Chat ---------- */
  var REPLIES = [
    'Sounds good. I can send our test results ahead of time. What would you like to see?',
    'Great. Would a video call this week work for you?',
    'Thanks for sharing. We will check with our vet and get back to you.'
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
      el('p', { class: 'note' }, 'Never share your home address. Share health records and talk with your vet before making any plans.'),
      log, form,
      el('div', { class: 'btn-row' },
        el('a', { class: 'btn btn-accent', href: '#/meetup/' + id }, 'Plan a first meeting'),
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

  /* ---------- First-meeting planner ---------- */
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

    var error = el('p', { class: 'error', role: 'alert', hidden: true });
    var kind = el('select', { id: 'm-kind', required: true },
      O.meet.map(function (o) { return el('option', { value: o.v }, o.l); }));
    var place = el('select', { id: 'm-place' },
      el('option', { value: '' }, 'Choose a public place'),
      D.places.map(function (p) { return el('option', { value: p.id }, p.name); }));
    var placeField = el('div', { class: 'field', hidden: true }, el('label', { class: 'lbl', for: 'm-place' }, 'Public place'), place,
      el('p', { class: 'help' }, 'Sample list only. Check each place\'s rules and leash requirements before you go.'));
    kind.addEventListener('change', function () { placeField.hidden = kind.value === 'video'; });
    var date = el('input', { type: 'date', id: 'm-date', required: true, min: localDate(0), value: localDate(2) });
    var time = el('input', { type: 'time', id: 'm-time', required: true, value: '10:00' });

    var form = el('form', { novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      var inPerson = kind.value !== 'video';
      var chosen = D.places.filter(function (p) { return p.id === place.value; })[0];
      if (inPerson && !chosen) { error.textContent = 'Please choose a public place.'; error.hidden = false; return; }
      if (!date.value || !time.value) { error.textContent = 'Please choose a date and a time.'; error.hidden = false; return; }
      var when = date.value + 'T' + time.value;
      if (new Date(when).getTime() < Date.now()) { error.textContent = 'Please pick a time in the future.'; error.hidden = false; return; }
      var nice = new Date(when).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      var meetup = { dogId: id, kind: kind.value, place: chosen ? chosen.name : '', when: when, status: 'Proposed' };
      state.meetups.push(meetup);
      addMessage(id, 'sys', 'You proposed: ' + MEET_SHORT[kind.value].toLowerCase() + ', ' + nice + (chosen ? ' at ' + chosen.name : '') + '.');
      save();
      setTimeout(function () {
        meetup.status = 'Accepted';
        addMessage(id, 'them', 'That works for us. Talk soon!');
        save();
        say(dog.owner + ' accepted the invitation.');
      }, 2500);
      go('chat/' + id);
    } },
      error,
      el('div', { class: 'field' }, el('label', { class: 'lbl', for: 'm-kind' }, 'How would you like to meet?'), kind,
        el('p', { class: 'help' }, 'We suggest starting with a video call or an owners-only meeting.')),
      placeField,
      el('div', { class: 'field' }, el('label', { class: 'lbl', for: 'm-date' }, 'Date'), date),
      el('div', { class: 'field' }, el('label', { class: 'lbl', for: 'm-time' }, 'Time'), time),
      el('div', { class: 'btn-row' },
        el('button', { type: 'submit', class: 'btn btn-primary' }, 'Send invite'),
        el('a', { class: 'btn btn-quiet', href: '#/chat/' + id }, 'Back to chat')));

    return el('section', null,
      el('h1', null, 'First meeting with ' + dog.owner),
      form,
      el('h2', null, 'Before you go'),
      el('ul', null,
        el('li', null, 'Meet only in public. Bringing a friend is a good idea.'),
        el('li', null, 'Keep dogs leashed and under control. Avoid off-leash areas, and take extra care if a female is in or near heat.'),
        el('li', null, 'Bring your health test results and vaccination records, and ask for theirs.'),
        el('li', null, 'Talk to your vet first. Any mating is arranged privately between owners and is not part of Pawfect Match.')));
  }

  /* ---------- My dog ---------- */
  function viewProfile() {
    var d = state.me;
    var tests = reportedTests(d).map(function (t) { return TEST_SHORT[t]; });
    var rows = [
      ['Breed', d.breed], ['Sex', shortLabel('sex', d.sex)], ['Age', ageText(d.age)], ['Size', shortLabel('size', d.size)],
      ['Registry', labelOf('registry', d.registry)],
      ['Vaccinated', d.vaccinated ? 'Yes (owner-reported)' : 'Not confirmed'],
      ['Health testing', tests.length ? tests.join(', ') : 'None reported'],
      ['Breeding experience', labelOf('experience', d.experience)],
      ['Timing', labelOf('ready', d.ready)],
      ['Energy', M.ENERGY[d.energy]], ['Trainability', labelOf('train', d.train)],
      ['With other dogs', labelOf('dogs', d.dogs)], ['With children', labelOf('kids', d.kids)],
      ['With strangers', labelOf('strangers', d.strangers)], ['Fear or anxiety', labelOf('fear', d.fear)],
      ['Aggression history', labelOf('aggression', d.aggression)],
      ['Goal', labelOf('purpose', d.purpose)], ['Compensation', labelOf('comp', d.comp)]
    ];
    if (d.healthNotes) rows.push(['Health notes', d.healthNotes]);

    return el('section', null,
      d.photo ? avatar(d, true) : null,
      el('div', { class: 'chat-head' }, d.photo ? null : avatar(d), el('div', null, el('h1', null, d.name), el('span', { class: 'muted small' }, d.bio || ''))),
      d.aggression === 'yes' ? el('p', { class: 'note' }, 'Because of the aggression history you reported, ' + d.name + ' is not shown to other owners.') : null,
      el('dl', { class: 'facts' }, rows.map(function (r) { return [el('dt', null, r[0]), el('dd', null, r[1])]; })),
      el('div', { class: 'field' },
        el('label', { class: 'lbl', for: 'ready-sel' }, 'Timing'),
        el('select', { id: 'ready-sel', onchange: function (e) {
          state.me.ready = e.target.value; save(); say('Timing updated');
        } }, O.ready.map(function (o) { return el('option', { value: o.v, selected: d.ready === o.v }, o.l); }))),
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
      el('h2', null, 'What Pawfect Match is'),
      el('ul', null,
        el('li', null, 'A way for owners of intact, adult dogs to find compatible dogs and talk. You must be 18 or older.'),
        el('li', null, 'It does not arrange matings, sell or list dogs or puppies, or handle payments or contracts. Owners agree everything directly.'),
        el('li', null, 'It is not a dating site for people.')),
      el('h2', null, 'Responsible breeding'),
      el('ul', null,
        el('li', null, 'Talk to your veterinarian and, if you have one, your breed club before breeding. Not every dog should be bred.'),
        el('li', null, 'Health testing, vaccinations and registry details are owner-reported and not verified. Ask to see records.'),
        el('li', null, 'Dogs with a history of aggression are not shown. Be honest about temperament, since it can be passed on.'),
        el('li', null, 'Plan for the whole litter: puppies need homes, vet care and time for years to come.'),
        el('li', null, 'Colorado\'s Department of Agriculture says people who breed pet animals may need to be licensed under its Pet Animal Care and Facilities Act. Check the rules that apply to you.')),
      el('h2', null, 'Meeting up'),
      el('ul', null,
        el('li', null, 'Start with a video call or an owners-only meeting in a public place.'),
        el('li', null, 'Never share your home address. We only show an approximate area.'),
        el('li', null, 'Keep dogs leashed at first meetings, and avoid off-leash areas, especially if a female may be in heat.'),
        el('li', null, 'You can always say no. Report or block anyone who makes you uncomfortable. A moderator reviews reports.')));
  }

  /* ---------- Start ---------- */
  if (/[?&]demo=1\b/.test(location.search) && !state.me) {
    state.me = Object.assign({}, D.demoDog);
    save();
  }
  if (!location.hash) location.hash = '#/welcome';
  route();
})();
