document.addEventListener('DOMContentLoaded', () => {
	// Поточний рік у футері
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	// Мобільне меню (якщо є стилі під .active)
	const menuBtn = document.querySelector('.menu-btn');
	const headerNav = document.querySelector('.header__nav');
	if (menuBtn && headerNav) {
		menuBtn.addEventListener('click', () => {
			menuBtn.classList.toggle('active');
			headerNav.classList.toggle('active');
		});
	}

	// Модальне вікно (опціонально)
	const modal = document.querySelector('.modal-window');
	if (modal) {
		const closeBtn = modal.querySelector('.modal-window__content-close button');
		const hide = () => modal.classList.remove('active');

		if (closeBtn) closeBtn.addEventListener('click', hide);
		modal.addEventListener('click', (e) => {
			if (e.target === modal) hide();
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') hide();
		});
	}
});