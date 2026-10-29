/*
 * Pikes Pack mockup: SAMPLE DATA ONLY.
 * Dogs and owners are made up. Parks are example names to check later; hours,
 * fencing and rules are NOT verified (see SPEC.md section 7).
 */
(function (root) {
  'use strict';

  var dogs = [
    { id: 'maple', name: 'Maple', owner: 'Sam', breed: 'Golden Retriever', size: 'large', age: 'adult', sex: 'F', fixed: true, vaccinated: true,
      energy: 2, play: ['fetch', 'chase'], intensity: 1, comfort: ['medium', 'large'], greeting: 'eager', bite: 'none', reactive: 'no', guards: 'no',
      group: 'small', recall: 'reliable', limits: '', area: 'Briargate', miles: 4.2, bio: 'Will trade sniffs for tennis balls.', emoji: '🐕', hue: 35, likesYou: true },
    { id: 'biscuit', name: 'Biscuit', owner: 'Priya', breed: 'Corgi mix', size: 'medium', age: 'young', sex: 'M', fixed: true, vaccinated: true,
      energy: 2, play: ['chase', 'wrestle'], intensity: 1, comfort: ['small', 'medium', 'large'], greeting: 'eager', bite: 'none', reactive: 'no', guards: 'sometimes',
      group: 'small', recall: 'sometimes', limits: '', area: 'Old North End', miles: 2.1, bio: 'Short legs, big opinions.', emoji: '🐶', hue: 20, likesYou: true },
    { id: 'juniper', name: 'Juniper', owner: 'Marcus', breed: 'Border Collie', size: 'medium', age: 'adult', sex: 'F', fixed: true, vaccinated: true,
      energy: 2, play: ['chase', 'fetch'], intensity: 1, comfort: ['medium', 'large'], greeting: 'polite', bite: 'none', reactive: 'no', guards: 'no',
      group: 'one', recall: 'reliable', limits: '', area: 'Rockrimmon', miles: 5.6, bio: 'Needs a job. Frisbee counts.', emoji: '🐕‍🦺', hue: 200, likesYou: true },
    { id: 'otis', name: 'Otis', owner: 'Jenna', breed: 'Basset Hound', size: 'medium', age: 'senior', sex: 'M', fixed: true, vaccinated: true,
      energy: 0, play: ['gentle'], intensity: 0, comfort: ['small', 'medium'], greeting: 'polite', bite: 'none', reactive: 'no', guards: 'no',
      group: 'one', recall: 'leash', limits: 'Slow walker, no stairs', area: 'Manitou Springs', miles: 7.9, bio: 'Professional sniffer. Retired from running.', emoji: '🐶', hue: 28, likesYou: false },
    { id: 'pepper', name: 'Pepper', owner: 'Luis', breed: 'Chihuahua mix', size: 'small', age: 'adult', sex: 'F', fixed: true, vaccinated: true,
      energy: 1, play: ['chase', 'gentle'], intensity: 0, comfort: ['small'], greeting: 'shy', bite: 'none', reactive: 'sometimes', guards: 'sometimes',
      group: 'one', recall: 'leash', limits: '', area: 'Downtown', miles: 3.3, bio: 'Small dog friends only, please.', emoji: '🐕', hue: 340, likesYou: false },
    { id: 'bruno', name: 'Bruno', owner: 'Hannah', breed: 'German Shepherd', size: 'large', age: 'adult', sex: 'M', fixed: true, vaccinated: true,
      energy: 2, play: ['fetch', 'tug'], intensity: 2, comfort: ['medium', 'large'], greeting: 'selective', bite: 'minor', reactive: 'sometimes', guards: 'yes',
      group: 'one', recall: 'reliable', limits: 'Snapped once at a crowded park', area: 'Monument', miles: 8.8, bio: 'Loyal, serious, loves a good tug.', emoji: '🐕‍🦺', hue: 10, likesYou: true },
    { id: 'waffles', name: 'Waffles', owner: 'Tom', breed: 'Labradoodle', size: 'large', age: 'puppy', sex: 'M', fixed: false, vaccinated: false,
      energy: 2, play: ['chase', 'wrestle', 'tug'], intensity: 1, comfort: ['small', 'medium', 'large'], greeting: 'eager', bite: 'none', reactive: 'no', guards: 'no',
      group: 'small', recall: 'leash', limits: 'Vaccine series in progress', area: 'Cimarron Hills', miles: 6.0, bio: 'All paws, no plan.', emoji: '🐩', hue: 45, likesYou: false },
    { id: 'luna', name: 'Luna', owner: 'Aisha', breed: 'Siberian Husky', size: 'large', age: 'young', sex: 'F', fixed: true, vaccinated: true,
      energy: 2, play: ['chase', 'wrestle'], intensity: 2, comfort: ['medium', 'large'], greeting: 'eager', bite: 'none', reactive: 'no', guards: 'no',
      group: 'busy', recall: 'sometimes', limits: '', area: 'Fountain', miles: 9.4, bio: 'Loud, fast, and very friendly.', emoji: '🐺', hue: 215, likesYou: true },
    { id: 'nacho', name: 'Nacho', owner: 'Chris', breed: 'Dachshund', size: 'small', age: 'adult', sex: 'M', fixed: true, vaccinated: true,
      energy: 1, play: ['chase', 'tug'], intensity: 1, comfort: ['small', 'medium'], greeting: 'eager', bite: 'none', reactive: 'no', guards: 'sometimes',
      group: 'small', recall: 'sometimes', limits: 'Back-friendly play only', area: 'Security-Widefield', miles: 9.9, bio: 'Long dog, short attention span.', emoji: '🐕', hue: 5, likesYou: false },
    { id: 'ziggy', name: 'Ziggy', owner: 'Dana', breed: 'Australian Shepherd', size: 'medium', age: 'young', sex: 'M', fixed: false, vaccinated: true,
      energy: 2, play: ['chase', 'fetch', 'wrestle'], intensity: 1, comfort: ['medium', 'large'], greeting: 'eager', bite: 'none', reactive: 'no', guards: 'no',
      group: 'small', recall: 'reliable', limits: '', area: 'Falcon', miles: 9.5, bio: 'Herds everything, including you.', emoji: '🐕‍🦺', hue: 265, likesYou: true },
    { id: 'poppy', name: 'Poppy', owner: 'Jordan', breed: 'Poodle mix', size: 'small', age: 'adult', sex: 'F', fixed: true, vaccinated: true,
      energy: 1, play: ['gentle', 'fetch'], intensity: 0, comfort: ['small', 'medium'], greeting: 'polite', bite: 'none', reactive: 'no', guards: 'no',
      group: 'small', recall: 'reliable', limits: '', area: 'Old Colorado City', miles: 3.9, bio: 'Polite, tidy, loves a small ball.', emoji: '🐩', hue: 300, likesYou: false },
    { id: 'rocky', name: 'Rocky', owner: 'Evan', breed: 'Boxer mix', size: 'large', age: 'adult', sex: 'M', fixed: true, vaccinated: true,
      energy: 2, play: ['wrestle', 'chase'], intensity: 2, comfort: ['medium', 'large'], greeting: 'eager', bite: 'none', reactive: 'no', guards: 'no',
      group: 'busy', recall: 'sometimes', limits: '', area: 'Cimarron Hills', miles: 8.0, bio: 'Wiggles from nose to tail.', emoji: '🐕', hue: 15, likesYou: false },
    { id: 'daisy', name: 'Daisy', owner: 'Mia', breed: 'Beagle', size: 'medium', age: 'adult', sex: 'F', fixed: true, vaccinated: true,
      energy: 1, play: ['chase', 'gentle'], intensity: 1, comfort: ['small', 'medium', 'large'], greeting: 'polite', bite: 'none', reactive: 'no', guards: 'no',
      group: 'small', recall: 'leash', limits: '', area: 'Black Forest', miles: 16.0, bio: 'Follows her nose, not commands.', emoji: '🐶', hue: 40, likesYou: false }
  ];

  var parks = [
    { id: 'cheyenne', name: 'Cheyenne Meadows Park' },
    { id: 'palmer', name: 'Palmer Park' },
    { id: 'rampart', name: 'Rampart Dog Park' },
    { id: 'antlers', name: 'Antlers Park' },
    { id: 'falcon', name: 'Falcon Dog Park' },
    { id: 'portal', name: 'Portal Park' }
  ];

  var demoDog = {
    name: 'Scout', breed: 'Mixed breed', size: 'medium', age: 'adult', sex: 'M', fixed: true, vaccinated: true,
    energy: 2, play: ['fetch', 'chase'], intensity: 1, comfort: ['small', 'medium', 'large'], greeting: 'polite', bite: 'none', reactive: 'no', guards: 'no',
    group: 'small', recall: 'sometimes', limits: '', bio: 'Loves tennis balls and new friends.', emoji: '🐕', hue: 150, inHeat: false
  };

  root.PikesData = { dogs: dogs, parks: parks, demoDog: demoDog };
})(window);
