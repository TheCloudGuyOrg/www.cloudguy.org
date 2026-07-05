// All available photos in the photography folder
const allPhotos = [
  'Lily-1.jpg', 'Lily-2.jpg', 'Lily-3.jpg', 'Lily-4.jpg', 'Lily-5.jpg',
  'Lily-6.jpg', 'Lily-7.jpg', 'Lily-8.jpg', 'Lily-9.jpg', 'Lily-10.jpg',
  'Lily-11.jpg', 'Lily-12.jpg', 'Lily-13.jpg', 'Lily-14.jpg', 'Lily-15.jpg',
  'Lily-16.jpg', 'Lily-17.jpg', 'Lily-18.jpg', 'Lily-19.jpg', 'Lily-20.jpg',
  'Lily-21.jpg', 'Lily-22.jpg', 'Lily-23.jpg', 'Lily-24.jpg', 'Lily-25.jpg',
  'Lily-26.jpg', 'Lily-27.jpg', 'Lily-28.jpg', 'Lily-29.jpg', 'Lily-30.jpg',
  'Lily-31.jpg', 'Lily-32.jpg', 'Lily-33.jpg', 'Lily-34.jpg', 'Lily-35.jpg',
  'Lily-36.jpg', 'Lily-37.jpg', 'Lily-38.jpg', 'Lily-39.jpg', 'Lily-40.jpg',
  'Lily-41.jpg', 'Lily-42.jpg', 'Lily-43.jpg', 'Lily-44.jpg', 'Lily-45.jpg',
  'Lily-46.jpg', 'Lily-47.jpg', 'Lily-48.jpg'
];

// Shuffle array using Fisher-Yates algorithm
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Pick 12 random photos and render them into the grid
function loadGallery() {
  const grid = document.querySelector('.photo-grid');
  if (!grid) return;

  const selected = shuffle(allPhotos).slice(0, 24);

  grid.innerHTML = selected.map(photo => `
    <div class="photo-item">
      <img src="../images/photography/${photo}" alt="Landscape photograph" loading="lazy">
    </div>
  `).join('');

  // After images load, apply aspect ratio classes
  grid.querySelectorAll('.photo-item img').forEach(img => {
    img.addEventListener('load', () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const item = img.parentElement;
      if (ratio > 1.4) {
        item.classList.add('photo-wide');
      } else {
        item.classList.add('photo-square');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', loadGallery);
