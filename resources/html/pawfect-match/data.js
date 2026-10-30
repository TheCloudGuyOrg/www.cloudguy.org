/*
 * Pikes Pack mockup: SAMPLE DATA ONLY.
 * Dogs and owners are made up. Places are example names to check later; hours and
 * rules are NOT verified (see SPEC.md). Health results below are invented.
 */
(function (root) {
  'use strict';

  /* H([vet, brucellosis, dna, joints, eyes, heart]) -> which health tests are reported */
  function H(a) {
    return { vet: !!a[0], brucellosis: !!a[1], dna: !!a[2], joints: !!a[3], eyes: !!a[4], heart: !!a[5] };
  }

  var dogs = [
    { id: 'maple', name: 'Maple', owner: 'Sam', breed: 'Golden Retriever', size: 'large', age: 4, sex: 'F', registry: 'akc',
      experience: 'proven', ready: 'soon', health: H([1, 1, 1, 1, 1, 0]), vaccinated: true,
      energy: 1, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'pick', healthNotes: '', area: 'Briargate', miles: 4.2,
      bio: 'Gentle mom of two healthy litters. Easygoing and eager to please.', emoji: '🐕', hue: 35, likesYou: true },
    { id: 'honey', name: 'Honey', owner: 'Priya', breed: 'Golden Retriever', size: 'large', age: 3, sex: 'F', registry: 'akc',
      experience: 'first', ready: 'now', health: H([1, 1, 1, 1, 0, 0]), vaccinated: true,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'mild', aggression: 'none',
      purpose: 'show', comp: 'discuss', healthNotes: '', area: 'Old North End', miles: 2.1,
      bio: 'Show-line girl, ready for her first litter with the right match.', emoji: '🐶', hue: 28, likesYou: true },
    { id: 'willow', name: 'Willow', owner: 'Marcus', breed: 'Golden Retriever', size: 'large', age: 2, sex: 'F', registry: 'ukc',
      experience: 'first', ready: 'later', health: H([1, 1, 0, 1, 0, 0]), vaccinated: true,
      energy: 0, train: 'average', dogs: 'selective', kids: 'okay', strangers: 'reserved', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'pick', healthNotes: '', area: 'Rockrimmon', miles: 5.6,
      bio: 'Calm, a little shy, and still growing up. Planning ahead.', emoji: '🐕', hue: 45, likesYou: false },
    { id: 'sunny', name: 'Sunny', owner: 'Jenna', breed: 'Golden Retriever', size: 'large', age: 6, sex: 'F', registry: 'ukc',
      experience: 'proven', ready: 'later', health: H([1, 0, 0, 0, 0, 0]), vaccinated: true,
      energy: 1, train: 'average', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'discuss', healthNotes: '', area: 'Manitou Springs', miles: 7.9,
      bio: 'Sweet family dog. Only a basic vet check so far.', emoji: '🐕‍🦺', hue: 20, likesYou: false },
    { id: 'ruby', name: 'Ruby', owner: 'Luis', breed: 'Golden Retriever', size: 'large', age: 9, sex: 'F', registry: 'akc',
      experience: 'proven', ready: 'later', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 0, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'discuss', healthNotes: '', area: 'Downtown', miles: 3.3,
      bio: 'A senior lady. Too old for breeding in this sample.', emoji: '🐕', hue: 340, likesYou: false },
    { id: 'luna', name: 'Luna', owner: 'Hannah', breed: 'Golden Retriever', size: 'large', age: 5, sex: 'F', registry: 'akc',
      experience: 'proven', ready: 'now', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 2, train: 'independent', dogs: 'poor', kids: 'untested', strangers: 'wary', fear: 'significant', aggression: 'yes',
      purpose: 'working', comp: 'fee', healthNotes: 'Snapped at a stranger once', area: 'Monument', miles: 8.8,
      bio: 'Hidden from everyone because of her aggression history.', emoji: '🐕‍🦺', hue: 10, likesYou: true },
    { id: 'penny', name: 'Penny', owner: 'Tom', breed: 'Golden Retriever', size: 'large', age: 3, sex: 'F', registry: 'akc',
      experience: 'first', ready: 'now', health: H([1, 1, 1, 1, 1, 1]), vaccinated: false,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'discuss', healthNotes: 'Vaccines overdue', area: 'Cimarron Hills', miles: 6.0,
      bio: 'Hidden until her vaccines are up to date.', emoji: '🐶', hue: 45, likesYou: false },
    { id: 'gracie', name: 'Gracie', owner: 'Aisha', breed: 'Golden Retriever', size: 'large', age: 4, sex: 'F', registry: 'akc',
      experience: 'first', ready: 'soon', health: H([1, 1, 1, 1, 1, 0]), vaccinated: true,
      energy: 1, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'sport', comp: 'discuss', healthNotes: '', area: 'Pueblo West', miles: 62,
      bio: 'Agility girl, but a long drive away. Shown only with a wider search.', emoji: '🐕', hue: 215, likesYou: true },
    { id: 'bruno', name: 'Bruno', owner: 'Chris', breed: 'Golden Retriever', size: 'large', age: 4, sex: 'M', registry: 'akc',
      experience: 'proven', ready: 'now', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 1, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'fee', healthNotes: '', area: 'Falcon', miles: 9.5,
      bio: 'A male, so he is not shown to other males.', emoji: '🐕', hue: 5, likesYou: false },
    { id: 'daisy', name: 'Daisy', owner: 'Dana', breed: 'Labrador Retriever', size: 'large', age: 3, sex: 'F', registry: 'akc',
      experience: 'proven', ready: 'soon', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'sport', comp: 'discuss', healthNotes: '', area: 'Black Forest', miles: 12.0,
      bio: 'Fully tested Lab. Shown only when you allow other breeds.', emoji: '🐕', hue: 60, likesYou: true },
    { id: 'coco', name: 'Coco', owner: 'Jordan', breed: 'Standard Poodle', size: 'large', age: 4, sex: 'F', registry: 'akc',
      experience: 'first', ready: 'soon', health: H([1, 1, 1, 0, 1, 1]), vaccinated: true,
      energy: 1, train: 'eager', dogs: 'friendly', kids: 'okay', strangers: 'reserved', fear: 'none', aggression: 'none',
      purpose: 'show', comp: 'discuss', healthNotes: '', area: 'Old Colorado City', miles: 3.9,
      bio: 'Elegant and smart. Shown only when you allow other breeds.', emoji: '🐩', hue: 300, likesYou: false },
    { id: 'pepper', name: 'Pepper', owner: 'Evan', breed: 'Chihuahua', size: 'small', age: 3, sex: 'F', registry: 'akc',
      experience: 'first', ready: 'now', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 1, train: 'average', dogs: 'selective', kids: 'okay', strangers: 'wary', fear: 'mild', aggression: 'none',
      purpose: 'companion', comp: 'discuss', healthNotes: '', area: 'Security-Widefield', miles: 9.9,
      bio: 'Much smaller than a Golden, so the size gap keeps her hidden.', emoji: '🐕', hue: 330, likesYou: false }
  ];

  /* Sample first-meeting places. Not verified: confirm names, rules and leash requirements. */
  var places = [
    { id: 'acacia', name: 'Acacia Park (downtown)' },
    { id: 'monument', name: 'Monument Valley Park' },
    { id: 'memorial', name: 'Memorial Park' },
    { id: 'greenway', name: 'Pikes Peak Greenway trailhead' },
    { id: 'cafe', name: 'A dog-friendly cafe patio (to be chosen)' }
  ];

  var breeds = [
    'Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Standard Poodle', 'Miniature Poodle', 'French Bulldog',
    'Bulldog', 'Beagle', 'Rottweiler', 'Dachshund', 'Siberian Husky', 'Australian Shepherd', 'Border Collie',
    'Cavalier King Charles Spaniel', 'Boxer', 'Pembroke Welsh Corgi', 'Great Dane', 'Doberman Pinscher',
    'Shih Tzu', 'Chihuahua', 'Yorkshire Terrier', 'Bernese Mountain Dog', 'Cocker Spaniel', 'Pomeranian'
  ];

  var demoDog = {
    name: 'Scout', breed: 'Golden Retriever', size: 'large', age: 3, sex: 'M', registry: 'akc',
    experience: 'first', ready: 'soon', health: H([1, 1, 1, 1, 1, 0]), vaccinated: true,
    energy: 1, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
    purpose: 'companion', comp: 'discuss', healthNotes: '', bio: 'Loves tennis balls and people. Looking for the right match.',
    emoji: '🐕', hue: 150
  };

  root.PikesData = { dogs: dogs, places: places, breeds: breeds, demoDog: demoDog };
})(window);
