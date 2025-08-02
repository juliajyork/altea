let currentIndex = 0;
let isAnimating = false;
let lastItemsPerView = getItemsPerView();
let originalItemsCache = [];

function getItemsPerView() {
  return window.innerWidth < 768 ? 1 : 2;
}

function initializeCarousel() {
  const reviewContainer = document.querySelector('.review-container');
  if (!reviewContainer) return;

  reviewContainer.innerHTML = '';

  const itemsPerView = getItemsPerView();

  // CLONE INFINITE EFFECT
  const clonesBefore = originalItemsCache.slice(-itemsPerView).map(item => item.cloneNode(true));
  const clonesAfter = originalItemsCache.slice(0, itemsPerView).map(item => item.cloneNode(true));
  const fullSet = [...clonesBefore, ...originalItemsCache.map(item => item.cloneNode(true)), ...clonesAfter];

  fullSet.forEach(item => reviewContainer.appendChild(item));

  updateItemWidths();

  // SET POSITION
  currentIndex = 0;
  reviewContainer.style.transition = 'none';
  reviewContainer.style.transform = `translateX(-${(currentIndex + itemsPerView) * (100 / itemsPerView)}%)`;
  reviewContainer.offsetHeight;
  reviewContainer.style.transition = 'transform 0.4s ease-in-out';

  updateActiveStates();
  setupSeeMoreToggle(); 
}

function updateItemWidths() {
  const reviewItems = document.querySelectorAll('.review-item');
  const itemsPerView = getItemsPerView();
  reviewItems.forEach(item => {
    item.style.flex = `0 0 ${100 / itemsPerView}%`;
  });
}

function showReviews() {
  if (isAnimating) return;
  isAnimating = true;

  const reviewContainer = document.querySelector('.review-container');
  const itemsPerView = getItemsPerView();
  const totalItems = originalItemsCache.length;

  const offset = -(currentIndex + itemsPerView) * (100 / itemsPerView);
  reviewContainer.style.transform = `translateX(${offset}%)`;

  reviewContainer.addEventListener('transitionend', function handler() {
    reviewContainer.removeEventListener('transitionend', handler);

    if (currentIndex < 0) {
      currentIndex = totalItems - itemsPerView;
      reviewContainer.style.transition = 'none';
      reviewContainer.style.transform = `translateX(-${(currentIndex + itemsPerView) * (100 / itemsPerView)}%)`;
      reviewContainer.offsetHeight;
      reviewContainer.style.transition = 'transform 0.4s ease-in-out';
    }

    if (currentIndex >= totalItems) {
      currentIndex = 0;
      reviewContainer.style.transition = 'none';
      reviewContainer.style.transform = `translateX(-${itemsPerView * (100 / itemsPerView)}%)`;
      reviewContainer.offsetHeight;
      reviewContainer.style.transition = 'transform 0.4s ease-in-out';
    }

    isAnimating = false;
    updateActiveStates();
  });
}

function updateActiveStates() {
  const items = document.querySelectorAll('.review-item');
  const itemsPerView = getItemsPerView();

  items.forEach((item, i) => {
    item.classList.remove('active');
    if (i >= currentIndex + itemsPerView && i < currentIndex + itemsPerView + itemsPerView) {
      item.classList.add('active');
    }
  });
}

function setupSeeMoreToggle() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textBlock = btn.closest('.collapsible-text');
      textBlock.classList.toggle('expanded');
      btn.textContent = textBlock.classList.contains('expanded') ? 'See less' : 'See more';
    });
  });
}

// INITIALIZE 
document.addEventListener('DOMContentLoaded', () => {
  // ORIGINAL CACHE
  originalItemsCache = Array.from(document.querySelectorAll('.review-container .review-item'));
  originalItemsCache.forEach(item => item.classList.add('original'));

  initializeCarousel();

  document.getElementById('prevRev')?.addEventListener('click', () => {
    if (!isAnimating) {
      currentIndex -= getItemsPerView();
      showReviews();
    }
  });

  document.getElementById('nextRev')?.addEventListener('click', () => {
    if (!isAnimating) {
      currentIndex += getItemsPerView();
      showReviews();
    }
  });

  window.addEventListener('resize', () => {
    const newItemsPerView = getItemsPerView();
    if (newItemsPerView !== lastItemsPerView) {
      lastItemsPerView = newItemsPerView;
      initializeCarousel();
    }
  });
});
