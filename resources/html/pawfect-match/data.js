/*
 * Pawfect Match mockup: SAMPLE DATA ONLY.
 * Dogs and owners are made up. Places are example names to check later; hours and
 * rules are NOT verified (see SPEC.md). Health results below are invented.
 *
 * The demo dog is a female Australian Shepherd, so the sample dogs are mostly male
 * Australian Shepherds. A few extra dogs exist to show the filters at work.
 */
(function (root) {
  'use strict';

  /* H([vet, brucellosis, dna, joints, eyes, heart]) -> which health tests are reported */
  function H(a) {
    return { vet: !!a[0], brucellosis: !!a[1], dna: !!a[2], joints: !!a[3], eyes: !!a[4], heart: !!a[5] };
  }

  var AUSSIE = 'Australian Shepherd';

  var dogs = [
    { id: 'ranger', name: 'Ranger', owner: 'Sam', breed: AUSSIE, size: 'medium', age: 4, sex: 'M', registry: 'akc',
      experience: 'proven', ready: 'soon', health: H([1, 1, 1, 1, 1, 0]), vaccinated: true,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'reserved', fear: 'none', aggression: 'none',
      purpose: 'sport', comp: 'fee', healthNotes: '', area: 'Briargate', miles: 4.2,
      bio: 'Proven sire with clean hips and eyes. Lives for agility.', emoji: '🐕‍🦺', hue: 215, likesYou: true },
    { id: 'cooper', name: 'Cooper', owner: 'Priya', breed: AUSSIE, size: 'medium', age: 3, sex: 'M', registry: 'akc',
      experience: 'first', ready: 'now', health: H([1, 1, 1, 1, 0, 0]), vaccinated: true,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'mild', aggression: 'none',
      purpose: 'show', comp: 'discuss', healthNotes: '', area: 'Old North End', miles: 2.1,
      bio: 'Blue merle show boy, ready for his first litter.', emoji: '🐕', hue: 230, likesYou: true },
    { id: 'blue', name: 'Blue', owner: 'Marcus', breed: AUSSIE, size: 'medium', age: 5, sex: 'M', registry: 'ukc',
      experience: 'proven', ready: 'later', health: H([1, 1, 1, 0, 1, 0]), vaccinated: true,
      energy: 1, train: 'average', dogs: 'selective', kids: 'okay', strangers: 'reserved', fear: 'none', aggression: 'none',
      purpose: 'working', comp: 'pick', healthNotes: '', area: 'Rockrimmon', miles: 5.6,
      bio: 'Working stockdog with a calm head. Planning ahead.', emoji: '🐕', hue: 200, likesYou: false },
    { id: 'archer', name: 'Archer', owner: 'Luis', breed: AUSSIE, size: 'medium', age: 7, sex: 'M', registry: 'akc',
      experience: 'proven', ready: 'later', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 1, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'pick', healthNotes: '', area: 'Old Colorado City', miles: 3.9,
      bio: 'Fully tested and mellow. Not ready until later this year.', emoji: '🐕‍🦺', hue: 250, likesYou: false },
    { id: 'maverick', name: 'Maverick', owner: 'Jenna', breed: AUSSIE, size: 'medium', age: 6, sex: 'M', registry: 'ukc',
      experience: 'proven', ready: 'soon', health: H([1, 0, 0, 0, 0, 0]), vaccinated: true,
      energy: 2, train: 'average', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'discuss', healthNotes: '', area: 'Manitou Springs', miles: 7.9,
      bio: 'Sweet family dog with only a basic vet check. Shown when you allow any health testing.', emoji: '🐕', hue: 20, likesYou: false },
    { id: 'finn', name: 'Finn', owner: 'Hannah', breed: AUSSIE, size: 'medium', age: 1.5, sex: 'M', registry: 'akc',
      experience: 'first', ready: 'later', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'show', comp: 'discuss', healthNotes: '', area: 'Monument', miles: 8.8,
      bio: 'Too young for breeding in this sample, so he is hidden.', emoji: '🐶', hue: 160, likesYou: true },
    { id: 'koda', name: 'Koda', owner: 'Tom', breed: AUSSIE, size: 'medium', age: 5, sex: 'M', registry: 'akc',
      experience: 'proven', ready: 'now', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 2, train: 'independent', dogs: 'poor', kids: 'untested', strangers: 'wary', fear: 'significant', aggression: 'yes',
      purpose: 'working', comp: 'fee', healthNotes: 'Snapped at a stranger once', area: 'Cimarron Hills', miles: 6.0,
      bio: 'Hidden from everyone because of his aggression history.', emoji: '🐕‍🦺', hue: 10, likesYou: true },
    { id: 'rusty', name: 'Rusty', owner: 'Aisha', breed: AUSSIE, size: 'medium', age: 3, sex: 'M', registry: 'akc',
      experience: 'first', ready: 'now', health: H([1, 1, 1, 1, 1, 1]), vaccinated: false,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'discuss', healthNotes: 'Vaccines overdue', area: 'Fountain', miles: 9.4,
      bio: 'Hidden until his vaccines are up to date.', emoji: '🐕', hue: 25, likesYou: false },
    { id: 'tucker', name: 'Tucker', owner: 'Chris', breed: AUSSIE, size: 'medium', age: 4, sex: 'M', registry: 'akc',
      experience: 'first', ready: 'soon', health: H([1, 1, 1, 1, 1, 0]), vaccinated: true,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'sport', comp: 'discuss', healthNotes: '', area: 'Pueblo West', miles: 62,
      bio: 'Agility champion, but a long drive away. Shown only with a wider search.', emoji: '🐕‍🦺', hue: 215, likesYou: true },
    { id: 'daisy', name: 'Daisy', owner: 'Dana', breed: AUSSIE, size: 'medium', age: 4, sex: 'F', registry: 'akc',
      experience: 'proven', ready: 'soon', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'sport', comp: 'discuss', healthNotes: '', area: 'Falcon', miles: 9.5,
      bio: 'A female, so she is not shown to another female.', emoji: '🐕', hue: 330, likesYou: false },
    { id: 'jasper', name: 'Jasper', owner: 'Jordan', breed: 'Border Collie', size: 'medium', age: 3, sex: 'M', registry: 'akc',
      experience: 'proven', ready: 'soon', health: H([1, 1, 1, 1, 1, 1]), vaccinated: true,
      energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'reserved', fear: 'none', aggression: 'none',
      purpose: 'sport', comp: 'discuss', healthNotes: '', area: 'Black Forest', miles: 12.0,
      bio: 'Fully tested Border Collie. Shown only when you allow other breeds.', emoji: '🐕‍🦺', hue: 120, likesYou: true },
    { id: 'duke', name: 'Duke', owner: 'Evan', breed: 'Labrador Retriever', size: 'large', age: 4, sex: 'M', registry: 'akc',
      experience: 'first', ready: 'soon', health: H([1, 1, 1, 0, 1, 1]), vaccinated: true,
      energy: 1, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'friendly', fear: 'none', aggression: 'none',
      purpose: 'companion', comp: 'discuss', healthNotes: '', area: 'Security-Widefield', miles: 9.9,
      bio: 'Easygoing Lab. Shown only when you allow other breeds.', emoji: '🐕', hue: 60, likesYou: false }
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
    'Australian Shepherd', 'Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Standard Poodle', 'Miniature Poodle',
    'French Bulldog', 'Bulldog', 'Beagle', 'Rottweiler', 'Dachshund', 'Siberian Husky', 'Border Collie',
    'Cavalier King Charles Spaniel', 'Boxer', 'Pembroke Welsh Corgi', 'Great Dane', 'Doberman Pinscher',
    'Shih Tzu', 'Chihuahua', 'Yorkshire Terrier', 'Bernese Mountain Dog', 'Cocker Spaniel', 'Pomeranian'
  ];

  /* The demo "My Dog": a 3-year-old female Australian Shepherd. The photo is a web copy
     (resized, with all camera and location data removed). */
  var demoDog = {
    name: 'Grizzley', breed: AUSSIE, size: 'medium', age: 3, sex: 'F', registry: 'akc',
    experience: 'first', ready: 'soon', health: H([1, 1, 1, 1, 1, 0]), vaccinated: true,
    energy: 2, train: 'eager', dogs: 'friendly', kids: 'great', strangers: 'reserved', fear: 'none', aggression: 'none',
    purpose: 'sport', comp: 'discuss', healthNotes: '',
    bio: 'Smart, athletic and happiest with a job. Looking for the right match.',
    emoji: '🐕‍🦺', hue: 215, photo: 'grizzley.jpg'
  };

  root.PikesData = { dogs: dogs, places: places, breeds: breeds, demoDog: demoDog };
})(window);
