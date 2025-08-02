document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = toggle.closest('.dropdown-card');
    const content = card.querySelector('.dropdown-content');
    const arrow = toggle.querySelector('.arrow');

    const isOpen = content.classList.contains('open');

    document.querySelectorAll('.dropdown-content.open').forEach(c => {
      if (c !== content) {
        c.classList.remove('open');
        c.previousElementSibling.classList.remove('open');
      }
    });

    content.classList.toggle('open', !isOpen);
    toggle.classList.toggle('open', !isOpen);
  });
});
