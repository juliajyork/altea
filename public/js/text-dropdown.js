document.querySelectorAll('.dropdown-header').forEach(header => {
	header.addEventListener('click', function() {
		this.parentElement.classList.toggle('active');
	});
	header.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			this.click();
		}
	});
});