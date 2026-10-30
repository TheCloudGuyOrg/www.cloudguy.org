/*
 * Pikes Pack mockup: matching rules for breeding pairs (see SPEC.md section 4).
 *   1. Hard filters decide whether a dog is shown at all.
 *   2. A soft score (0-100) ranks the dogs that pass.
 * Everything here is owner-reported data; nothing is verified.
 * The age limits below are PLACEHOLDERS to be confirmed with a veterinarian or breed club.
 */
(function (root) {
  'use strict';

  var ENERGY = ['low', 'medium', 'high'];
  var TRAIN = ['eager', 'average', 'independent'];
  var DOGS = ['friendly', 'selective', 'poor'];
  var SIZES = ['small', 'medium', 'large'];
  var READY = ['now', 'soon', 'later'];
  var TESTS = ['vet', 'brucellosis', 'dna', 'joints', 'eyes', 'heart'];

  var MIN_AGE = 2;          // years, placeholder
  var MAX_AGE_FEMALE = 8;   // years, placeholder

  var PURPOSE_LABEL = { companion: 'companion pups', show: 'show', sport: 'sport', working: 'working' };
  var READY_LABEL = { now: 'ready now', soon: 'ready within 3 months', later: 'planning for later' };

  function idx(list, v) { return list.indexOf(v); }
  function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

  function healthCount(dog) {
    var n = 0;
    TESTS.forEach(function (t) { if (dog.health && dog.health[t]) n++; });
    return n;
  }

  function meetsHealth(dog, level) {
    var h = dog.health || {};
    if (level === 'basic') return !!(h.vet && h.brucellosis);
    if (level === 'full') return !!(h.vet && h.brucellosis && (h.dna || h.joints));
    return true;
  }

  /* Returns a plain-language reason a dog cannot be listed, or null if it is fine. */
  function ageProblem(age, sex) {
    if (age < MIN_AGE) return 'Pikes Pack is for dogs ' + MIN_AGE + ' years or older. Ask your vet when your dog is ready.';
    if (sex === 'F' && age > MAX_AGE_FEMALE) return 'For health reasons we do not list female dogs older than ' + MAX_AGE_FEMALE + '.';
    return null;
  }

  /* Returns null when the dog may be shown, or a short reason code when it is filtered out. */
  function blockedReason(me, dog, prefs) {
    if (dog.miles > prefs.maxMiles) return 'distance';
    if (dog.sex === me.sex) return 'sex';
    if (ageProblem(dog.age, dog.sex)) return 'age';
    if (dog.aggression === 'yes') return 'aggression';
    if (!dog.vaccinated) return 'vaccination';
    if (Math.abs(idx(SIZES, me.size) - idx(SIZES, dog.size)) >= 2) return 'size';
    if (prefs.breed === 'same' && norm(dog.breed) !== norm(me.breed)) return 'breed';
    if (!meetsHealth(dog, prefs.minHealth)) return 'health';
    if (prefs.timing === 'soon' && dog.ready === 'later') return 'timing';
    return null;
  }

  /* Soft score out of 100, plus short plain-language reasons. */
  function softScore(me, dog) {
    var score = 0;
    var reasons = [];

    // Temperament: 30 points
    var eDiff = Math.abs(me.energy - dog.energy);
    score += 10 - eDiff * 5;
    if (eDiff === 0) reasons.push('Similar energy level (' + ENERGY[me.energy] + ')');

    var tDiff = Math.abs(idx(TRAIN, me.train) - idx(TRAIN, dog.train));
    score += tDiff === 0 ? 6 : tDiff === 1 ? 3 : 0;
    if (me.train === 'eager' && dog.train === 'eager') reasons.push('Both are eager to learn');

    var dDiff = Math.abs(idx(DOGS, me.dogs) - idx(DOGS, dog.dogs));
    score += dDiff === 0 ? 7 : dDiff === 1 ? 4 : 0;
    if (me.dogs === 'friendly' && dog.dogs === 'friendly') reasons.push('Both are friendly with other dogs');

    if (me.fear === 'significant' || dog.fear === 'significant') score += 0;
    else if (me.fear === 'none' && dog.fear === 'none') { score += 7; reasons.push('Neither shows fear or anxiety'); }
    else score += 4;

    // Health testing: 25 points, based on the other dog's reported tests
    var n = healthCount(dog);
    score += Math.round((25 * n) / TESTS.length);
    if (n >= 4) reasons.push('Strong health testing reported (' + n + ' of ' + TESTS.length + ')');
    else if (n >= 2) reasons.push('Some health testing reported (' + n + ' of ' + TESTS.length + ')');

    // Timing: 15 points
    var rDiff = Math.abs(idx(READY, me.ready) - idx(READY, dog.ready));
    score += rDiff === 0 ? 15 : rDiff === 1 ? 8 : 0;
    if (rDiff === 0) reasons.push('Both ' + READY_LABEL[me.ready]);

    // Goals: 15 points
    if (me.purpose === dog.purpose) { score += 10; reasons.push('Same goal: ' + PURPOSE_LABEL[me.purpose]); }
    if (me.comp === dog.comp || me.comp === 'discuss' || dog.comp === 'discuss') score += 5;

    // Size: 5 points
    var sDiff = Math.abs(idx(SIZES, me.size) - idx(SIZES, dog.size));
    score += sDiff === 0 ? 5 : sDiff === 1 ? 3 : 0;

    // Experience: 5 points
    var proven = (me.experience === 'proven' ? 1 : 0) + (dog.experience === 'proven' ? 1 : 0);
    score += proven > 0 ? 5 : 2;
    if (proven === 1) reasons.push('One of you has bred before');

    // Breed: 5 points
    if (norm(me.breed) === norm(dog.breed)) { score += 5; reasons.push('Same breed'); }

    return { score: Math.max(0, Math.min(100, score)), reasons: reasons };
  }

  function fitLabel(score) {
    if (score >= 80) return 'Great fit';
    if (score >= 60) return 'Good fit';
    return 'Could work';
  }

  /* Filter, score and sort a list of dogs for this user's dog. */
  function rank(me, dogs, prefs) {
    return dogs
      .filter(function (d) { return blockedReason(me, d, prefs) === null; })
      .map(function (d) {
        var s = softScore(me, d);
        return { dog: d, score: s.score, reasons: s.reasons };
      })
      .sort(function (a, b) { return b.score - a.score; });
  }

  var api = {
    ENERGY: ENERGY, TESTS: TESTS, MIN_AGE: MIN_AGE, MAX_AGE_FEMALE: MAX_AGE_FEMALE,
    PURPOSE_LABEL: PURPOSE_LABEL, READY_LABEL: READY_LABEL,
    healthCount: healthCount, ageProblem: ageProblem, blockedReason: blockedReason,
    softScore: softScore, fitLabel: fitLabel, rank: rank
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PikesMatch = api;
})(typeof window !== 'undefined' ? window : globalThis);
