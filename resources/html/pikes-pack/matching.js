/*
 * Pikes Pack mockup: matching rules (from SPEC.md section 4).
 *   1. Hard filters decide whether a dog is shown at all.
 *   2. A soft score (0-100) ranks the dogs that pass.
 * Everything here is owner-reported data; nothing is verified.
 */
(function (root) {
  'use strict';

  var ENERGY = ['low', 'medium', 'high'];
  var INTENSITY = ['gentle', 'moderate', 'rough'];
  var PLAY_PHRASE = {
    chase: 'chasing',
    wrestle: 'wrestling',
    fetch: 'fetch',
    tug: 'tug-of-war',
    gentle: 'gentle sniff-and-stroll'
  };
  var GROUP_LABEL = { one: 'one-on-one', small: 'small groups', busy: 'busy parks' };
  var GROUP_ORDER = ['one', 'small', 'busy'];
  var STAGES = ['puppy', 'adult', 'senior'];

  function stageOf(age) {
    if (age === 'puppy') return 'puppy';
    if (age === 'senior') return 'senior';
    return 'adult';
  }

  /* Returns null when the dog may be shown, or a short reason code when it is filtered out. */
  function blockedReason(me, dog, prefs) {
    if (dog.miles > prefs.maxMiles) return 'distance';
    if (prefs.fixed === 'fixed' && !dog.fixed) return 'intact';
    if (prefs.fixed === 'intact' && dog.fixed) return 'fixed';
    if (me.comfort.indexOf(dog.size) < 0) return 'size';
    if (dog.comfort.indexOf(me.size) < 0) return 'size';
    if (dog.bite === 'yes') return 'bite';
    if (prefs.relaxedOnly && (dog.bite !== 'none' || dog.reactive === 'yes')) return 'relaxed';
    if (stageOf(dog.age) === 'puppy' && !dog.vaccinated) return 'puppy';
    return null;
  }

  function overlap(a, b) {
    return a.filter(function (x) { return b.indexOf(x) >= 0 && x !== 'none'; });
  }

  function union(a, b) {
    var all = a.concat(b).filter(function (x) { return x !== 'none'; });
    return all.filter(function (x, i) { return all.indexOf(x) === i; });
  }

  /* Soft score out of 100, plus short plain-language reasons. */
  function softScore(me, dog) {
    var score = 0;
    var reasons = [];

    var eDiff = Math.abs(me.energy - dog.energy);
    score += 30 - eDiff * 15;
    if (eDiff === 0) reasons.push('Both ' + ENERGY[me.energy] + ' energy');

    var shared = overlap(me.play, dog.play);
    var all = union(me.play, dog.play);
    score += all.length ? Math.round((shared.length / all.length) * 30) : 15;
    if (shared.length) {
      reasons.push('Both enjoy ' + shared.map(function (p) { return PLAY_PHRASE[p]; }).join(' and '));
    }

    var iDiff = Math.abs(me.intensity - dog.intensity);
    score += 20 - iDiff * 10;
    if (iDiff === 0) reasons.push('Same play intensity (' + INTENSITY[me.intensity] + ')');

    var gDiff = Math.abs(GROUP_ORDER.indexOf(me.group) - GROUP_ORDER.indexOf(dog.group));
    score += gDiff === 0 ? 10 : gDiff === 1 ? 5 : 0;
    if (gDiff === 0) reasons.push('Both like ' + GROUP_LABEL[me.group]);

    var aDiff = Math.abs(STAGES.indexOf(stageOf(me.age)) - STAGES.indexOf(stageOf(dog.age)));
    score += aDiff === 0 ? 10 : aDiff === 1 ? 5 : 0;
    if (aDiff === 0) reasons.push('Similar life stage');

    return { score: score, reasons: reasons };
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
    ENERGY: ENERGY,
    INTENSITY: INTENSITY,
    PLAY_PHRASE: PLAY_PHRASE,
    GROUP_LABEL: GROUP_LABEL,
    stageOf: stageOf,
    blockedReason: blockedReason,
    softScore: softScore,
    fitLabel: fitLabel,
    rank: rank
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PikesMatch = api;
})(typeof window !== 'undefined' ? window : globalThis);
