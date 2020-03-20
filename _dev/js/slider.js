$(document).ready(function () {
	slider($('.Slider'));

	function slider(obj, params) {
		// Настройка -->
		var defaults = {
			dots: true,
			arrows: true,
			autoSwitch: 3,
			duration: 1,
			showSlide: 1,
			scrollSlide: 1,
			slideProgress: false,
			theme: 'default',
		}
		var settings = Object.assign(defaults, params);
		// <-- Настройка

		// Обарачиваем контент в список и создаём первичные настройки -->
		if (!obj) {
			console.error('Необходимо передать объект первым аргументом');
			return;
		}

		var slider = obj;
		var sliderContent = slider.find('.Slider__content');

		$('<ul class="Slider__list">').appendTo(slider);

		var sliderList = slider.find('.Slider__list');

		sliderContent.wrap('<li class="Slider__item">');

		var sliderItem = slider.find('.Slider__item');

		var sliderArray = [];

		slider.each(function () {
			var self = $(this);
			var sliderItems = self.find('.Slider__item');

			sliderArray.push(sliderItems.length);
			self
				.find('.Slider__list')
				.append(sliderItems);

			self
				.find('.Slider__item')
				.eq(0)
				.nextAll()
				.addClass('Slider__item--hidden');
		});

		if (settings.dots) {
			$('<ul class="Slider__dots">').appendTo(slider);

			var sliderDots = $('.Slider__dots');

			sliderDots.each(function (index) {
				var self = $(this);

				for (var i = 0; i < sliderArray[index]; i++) {
					self.append($('<li class="Slider__dot">'));
				}

				self
					.find('.Slider__dot')
					.eq(0)
					.addClass('Slider__dot--active');
			});
		}

		if (settings.arrows) {
			$('<div class="Slider__arrow Slider__arrow--prev">').appendTo(slider);
			$('<div class="Slider__arrow Slider__arrow--next">').appendTo(slider)

			var sliderArrows = $('.Slider__arrow');
		}

		var slides = [];

		for (var i = 0; i < sliderArray.length; i++) {
			slides.push(0);
		}

		var sliderMoveFlags = [];

		for (var i = 0; i < sliderArray.length; i++) {
			sliderMoveFlags.push(true);
		}
		// <-- Обарачиваем контент в список и создаём первичные настройки

		// Функционал дотов -->
		if (settings.dots) {
			sliderDots.on('click', (e) => {
				var target = $(e.target);
				var container = target.parent().parent();

				if (target.hasClass('Slider__dot')) {
					var sliderIndex = obj.index(container);

					if (sliderMoveFlags[slides[sliderIndex]]) {
						if (slides[sliderIndex] < target.index()) {
							sliderMove(target.index(), container, 'right');
						} else if (slides[sliderIndex] > target.index()) {
							sliderMove(target.index(), container, 'left');
						}

						slides[sliderIndex] = target.index();
					}
				}
			});
		}
		// <-- Функционал дотов

		// Функционал стрелок -->
		if (settings.arrows) {
			sliderArrows.on('click', (e) => {
				var target = $(e.target);
				var container = target.parent();
				var sliderIndex = obj.index(container);
				var countSlides = container
					.find('.Slider__item')
					.children().length;

				if (sliderMoveFlags[slides[sliderIndex]]) {
					if (target.hasClass('Slider__arrow--prev')) {
						if (slides[sliderIndex] === 0) {
							slides[sliderIndex] = countSlides - 1;
						} else {
							slides[sliderIndex] -= 1;
						}

						sliderMove(slides[sliderIndex], container, 'left');
					} else if (target.hasClass('Slider__arrow--next')) {
						if (slides[sliderIndex] === countSlides - 1) {
							slides[sliderIndex] = 0;
						} else {
							slides[sliderIndex] += 1;
						}
						sliderMove(slides[sliderIndex], container, 'right');
					}
				}
			});
		}
		// <-- Функционал стрелок

		// Функционал автоматического переключения слайдов -->
		if (settings.autoSwitch) {
			var duration = settings.autoSwitch.toString().split('');

			if (duration.indexOf('.') === -1) {
				duration = parseInt(duration[0] + '000');
			} else {
				duration.splice(duration.indexOf('.'), 1);
				duration[1] += '00';
				duration = parseInt(duration.join(''));
			}

			obj.each(function (i) { // Сделать отдельную очередь для объектов!!!
				var self = $(this);

				setInterval(() => {

					if (sliderMoveFlags[slides[i]]) {
						slides[i]++;

						if (slides[i] >= sliderArray[i]) {
							slides[i] = 0;
						}

						sliderMove(slides[i], self, 'right');
					}
				}, duration);
			});
		}
		// <-- Функционал автоматического переключения слайдов

		function sliderMove(index, container, direction) {
			sliderMoveFlags[index] = false;
			var targetItem = container
				.find('.Slider__item')
				.eq(index);

			var pastItem = container.find('.Slider__item:not(.Slider__item--hidden)');

			var transformPercents = {
				zero: 0,
				hundred: -100,
			}

			if (direction === 'right') {
				transformPercents.hundred = 100;
				targetItem
					.css({
						'transform': 'translateX(100%)',
						'visibility': 'visible',
					});
			} else if (direction === 'left') {
				targetItem
					.css({
						'transform': 'translateX(-100%)',
						'visibility': 'visible',
					});
			}

			if (settings.dots) {
				container
					.find('.Slider__dot')
					.eq(index)
					.addClass('Slider__dot--active')
					.siblings()
					.removeClass('Slider__dot--active');
			}

			var move = setInterval(() => {
				if (direction === 'right') {
					transformPercents.zero--;
					transformPercents.hundred--;
				} else if (direction === 'left') {
					transformPercents.zero++;
					transformPercents.hundred++;
				}

				targetItem.css('transform', `translateX(${transformPercents.hundred}%)`);
				pastItem.css('transform', `translateX(${transformPercents.zero}%)`);

				if (transformPercents.hundred === 0) {
					clearInterval(move);
					move = 0;
					pastItem
						.addClass('Slider__item--hidden')
						.removeAttr('style');
					targetItem
						.removeClass('Slider__item--hidden')
						.removeAttr('style');

					sliderMoveFlags[index] = true;
				}
			}, 12);
		}
	}
});
