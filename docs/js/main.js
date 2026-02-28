document.addEventListener('DOMContentLoaded', () => {
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	// Slider section: init only above mobile (≤767); if 3 slides — show 3 (fill width); else desktop 4, tablet 2; on mobile no slider, cards stacked
	const sliderEl = document.querySelector('.slider-section .slider-section__slider');
	const MOBILE_MAX = 767;

	function updateSliderSectionDotsVisibility(sliderElement) {
		const section = sliderElement?.closest('.slider-section');
		if (!section || typeof window.$ === 'undefined') return;
		const $slider = window.$(sliderElement);
		if (!$slider.hasClass('slick-initialized')) return;
		const slideCount = parseInt(section.dataset.slideCount, 10) || 0;
		const slidesToShow = $slider.slick('slickGetOption', 'slidesToShow');
		const dotsEl = section.querySelector('.slider-section__dots');
		if (!dotsEl) return;
		dotsEl.style.display = slideCount <= slidesToShow ? 'none' : '';
	}

	function initSliderSection() {
		if (!sliderEl || typeof window.$ === 'undefined' || !window.$.fn.slick) return;
		const $slider = window.$(sliderEl);
		if (window.innerWidth <= MOBILE_MAX) {
			if ($slider.hasClass('slick-initialized')) $slider.slick('unslick');
			return;
		}
		if ($slider.hasClass('slick-initialized')) return;
		const slideCount = sliderEl.querySelectorAll('.slider-section__slide').length;
		const isThreeSlides = slideCount === 3;
		const section = sliderEl.closest('.slider-section');
		if (section) section.dataset.slideCount = String(slideCount);
		$slider.slick({
			slidesToShow: isThreeSlides ? 3 : 4,
			slidesToScroll: 1,
			dots: true,
			appendDots: '.slider-section__dots',
			arrows: false,
			infinite: isThreeSlides ? false : true,
			responsive: [
				{
					breakpoint: 1281,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				}
			]
		});
		if (isThreeSlides) {
			section?.classList.add('slider-section--three-cards');
		}
		updateSliderSectionDotsVisibility(sliderEl);
	}
	if (sliderEl) {
		initSliderSection();
		window.addEventListener('resize', function onSliderResize() {
			clearTimeout(window._sliderResizeTimer);
			window._sliderResizeTimer = setTimeout(function () {
				initSliderSection();
				updateSliderSectionDotsVisibility(sliderEl);
			}, 100);
		});
	}

	// Lokale Werte: logo slider (one slide, custom arrows, dots)
	const lokaleSliderEl = document.querySelector('.lokale-werte__slider');
	if (lokaleSliderEl && typeof window.$ !== 'undefined' && window.$.fn.slick) {
		const $lokale = window.$(lokaleSliderEl);
		if (!$lokale.hasClass('slick-initialized')) {
			$lokale.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				dots: true,
				appendDots: '.lokale-werte__dots',
				arrows: true,
				prevArrow: window.$(lokaleSliderEl).siblings('.lokale-werte__prev'),
				nextArrow: window.$(lokaleSliderEl).siblings('.lokale-werte__next'),
				infinite: true
			});
		}
	}

	// Mobile/tablet: one menu — move list into panel when open, back when close
	const menuBtn = document.getElementById('menu-btn');
	const menuClose = document.getElementById('menu-close');
	const mobilePanel = document.getElementById('mobile-menu');
	const listSlot = document.querySelector('.header-nav__list-slot');
	const panelListContainer = document.getElementById('mobile-menu-list');
	const navList = document.querySelector('.header-nav__list');

	function openMenu() {
		if (navList && listSlot && panelListContainer) {
			panelListContainer.appendChild(navList);
		}
		mobilePanel.classList.add('is-open');
		mobilePanel.setAttribute('aria-hidden', 'false');
		if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
	}

	function closeMenu() {
		if (navList && listSlot && panelListContainer) {
			listSlot.appendChild(navList);
			navList.querySelectorAll('.header-nav__item--dropdown.is-open').forEach((li) => li.classList.remove('is-open'));
		}
		mobilePanel.classList.remove('is-open');
		mobilePanel.setAttribute('aria-hidden', 'true');
		if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
	}

	if (menuBtn && mobilePanel) {
		menuBtn.addEventListener('click', () => {
			if (mobilePanel.classList.contains('is-open')) closeMenu();
			else openMenu();
		});
		if (menuClose) menuClose.addEventListener('click', closeMenu);
		mobilePanel.addEventListener('click', (e) => {
			if (e.target === mobilePanel) closeMenu();
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && mobilePanel.classList.contains('is-open')) closeMenu();
		});
	}

	// In panel: click on dropdown link toggles mega (accordion), only one open at a time
	if (mobilePanel) {
		mobilePanel.addEventListener('click', (e) => {
			const link = e.target.closest('.header-nav__item--dropdown .header-nav__link');
			if (!link || !mobilePanel.contains(document.querySelector('.header-nav__list'))) return;
			e.preventDefault();
			const li = link.closest('.header-nav__item--dropdown');
			if (!li) return;
			// Close all other dropdowns (accordion: only one open)
			navList.querySelectorAll('.header-nav__item--dropdown').forEach((other) => {
				if (other !== li) {
					other.classList.remove('is-open');
					const otherBtn = other.querySelector('.header-nav__link');
					if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
				}
			});
			const isOpen = li.classList.toggle('is-open');
			link.setAttribute('aria-expanded', isOpen);
		});
	}

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