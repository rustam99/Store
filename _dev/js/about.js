var sliderArrows = $('.About__slider__Arrow'); // Слайдер ->
var sliderList = $('.About__slider__list');
var sliderFlag = true;

sliderArrows.on('click', (e) => {
	var target = $(e.target);

	if (target.hasClass('next')) {
		if (sliderFlag) {
			sliderFlag = false;
			moveSlide('right');
		}
	} else if (target.hasClass('previus')) {
		if (sliderFlag) {
			sliderFlag = false;
			moveSlide('left');
		}
	}
});

function moveSlide(direction) {
	var currentPos = 0;
	var currentSlide = sliderList.find('.About__slider__item--active');

	if (direction === 'right') {
		var nextPos = 100;
		var nextSlide = currentSlide.next();

		nextSlide
			.addClass('About__slider__item--active')
			.css('left', '100%');
	} else if (direction === 'left') {
		var nextSlide = currentSlide.prev();
		var nextPos = -100;

		nextSlide
			.addClass('About__slider__item--active')
			.css('left', '-100%');
	}
	if (!nextSlide.length) {
		if (direction === 'right') {
			nextSlide = sliderList
				.children()
				.eq(0)
				.addClass('About__slider__item--active');
		} else if (direction === 'left') {
			nextSlide = sliderList
				.children()
				.eq(sliderList.children().length - 1)
				.addClass('About__slider__item--active');
		}

	}

	var intervalSlide = setInterval(() => {
		if (direction === 'right') {
			currentPos--;
			nextPos--;
		} else if ('left') {
			currentPos++;
			nextPos++;
		}

		currentSlide
			.css('left', currentPos + '%');
		nextSlide
			.css('left', nextPos + '%');

		if (direction === 'right') {
			if (currentPos === -100 && nextPos === 0) {
				cleanStyle(currentSlide, nextSlide);
				clearInterval(intervalSlide);
				intervalSlide = 0;
				sliderFlag = true;
			}
		} else if (direction === 'left') {
			if (currentPos === 100 && nextPos === 0) {
				cleanStyle(currentSlide, nextSlide);
				clearInterval(intervalSlide);
				intervalSlide = 0;
				sliderFlag = true;
			}
		}
	}, 8);
}

function cleanStyle(currentSlide, nextSlide) {
	currentSlide
		.removeClass('About__slider__item--active')
		.removeAttr('style')
	currentSlide = nextSlide;
} // <- Слайдер

var container = $('.About__reviews__Box'); // Комментарии клиентов ->
var dots = container.find('.About__reviews__Dots');
var Clientmessage = container.find('.About__reviews__Desc');
var Clientphoto = container.find('.About__reviews__PhotoImg');
var Clientname = container.find('.About__reviews__Name');

$.ajax({ // Подгружаем первый комментарий ->
	method: 'GET',
	url: '../json/Comments.json',
	success: function (data) {
		Clientmessage.text(data['0'].message);
		Clientphoto.attr('src', data['0'].img);
		Clientname.text(data['0'].name);
	}
}); // <- Подгружаем первый комментарий

dots.on('click', (e) => {
	var target = $(e.target);
	if (target.hasClass('About__reviews__Dot') &&
		!target.hasClass('About__reviews__Dot--active')) {
		var index = dots.children().index(target);
		target
			.addClass('About__reviews__Dot--active')
			.siblings()
			.removeClass('About__reviews__Dot--active');
		$.ajax({
			method: 'GET',
			url: '../json/Comments.json',
			success: function (data) {
				Clientmessage.text(data[index].message);
				Clientphoto.attr('src', data[index].img);
				Clientname.text(data[index].name);
			}
		});
	}
}); // <- Комментарии клиентов

var video = document.querySelector('.About__videoPlayer'); // Плеер ->
var timeDuration;
var durationMinutes;
var durationSeconds;

video.addEventListener('canplay', function () {
	timeDuration = Math.floor(video.duration);
	durationMinutes = Math.floor(timeDuration / 60);
	durationSeconds = Math.floor(timeDuration - durationMinutes * 60);

	$('.Controls__duration')
		.text(durationMinutes + ':' + durationSeconds);
});

var playPause = $('.Controls__playPause'); // Плэй, пауза ->
var playPauseFlag = true;

playPause.on('click', function () {
	var $this = $(this);
	if (playPauseFlag) {
		playPauseFlag = false;
		video.play();
		$this.fadeOut(50, () => {
			$this.addClass('Controls__playPause--pause');
			$this.fadeIn(300);
		});
	} else {
		$this.fadeOut(50, () => {
			video.pause();
			$this.removeClass('Controls__playPause--pause');
			$this.fadeIn(300);
			playPauseFlag = true;
		});
	}
}); // <- Плэй, пауза

var volumeLine = $('.Controls__volome__line'); // Звук ->
var volumeLineDot = $('.Controls__volome__lineDot');
var volumeImage = $('.Controls__volome');

volumeImage.on('click', function () {
	var $this = $(this);
	if ($this.hasClass('Controls__volome--muted')) {
		video.volume = 1;
		volumeLineDot.css({
			'left': 100 + '%',
			'transform': 'translateY(-50%) translateX(-50%)'
		});
		$this.removeClass('Controls__volome--muted');
	} else {
		$this.addClass('Controls__volome--muted');
		video.volume = 0;
		volumeLineDot.css('left', '0');
	}
});

volumeLine.on('mousedown', function (e) {
	var $this = $(this);
	var clickPos = Math.floor((e.pageX - $this.offset().left) / $this.width() * 100);

	volumeImage.css('background-image', 'url(/img/dest/player__controls__hover.png)');

	if (clickPos <= 0) {
		clickPos = 0;
		volumeImage.addClass('Controls__volome--muted');
	} else if (clickPos > 0) {
		volumeImage.removeClass('Controls__volome--muted');
	} else if (clickPos > 100) {
		clickPos = 100;
	}

	video.volume = clickPos / 100;
	volumeLineDot.css({
		'left': clickPos + '%',
		'transform': 'translateY(-50%) translateX(-50%)'
	});

	$(document).on('mousemove', moveVolume);
});

$(document).on('mouseup', function () {
	$(this).off('mousemove', moveVolume);
	$(this).off('mousemove', moveProgressLine);

	volumeLine.removeAttr('style');
	volumeImage.removeAttr('style');
	$(document.body).css('cursor', 'default');
});

function moveVolume(e) {
	var movePos = Math.floor((e.pageX - volumeLine.offset().left) / volumeLine.width() * 100);

	volumeLine.css({
		'opacity': '1',
		'visibility': 'visible',
	});

	$(document.body).css('cursor', 'pointer');

	if (movePos <= 0) {
		movePos = 0;
		volumeImage.addClass('Controls__volome--muted');
	} else if (movePos > 0 && movePos <= 100) {
		volumeImage.removeClass('Controls__volome--muted');
	} else if (movePos > 100) {
		movePos = 100;
	}

	video.volume = movePos / 100;
	volumeLineDot.css({
		'left': movePos + '%',
		'transform': 'translateY(-50%) translateX(-50%)'
	});
} // <- Звук

var timeLine = $('.Controls__timeLine'); // Прогресс линия и время ->
var time = $('.Controls__time');
var progressLine = $('.Controls__progressLine');

video.addEventListener('timeupdate', function () {
	timeDuration = video.duration;
	var pastTime = video.currentTime;
	var pastMinutes = Math.floor(pastTime / 60);
	var pastSeconds = Math.floor(pastTime - pastMinutes * 60);
	var progress = pastTime / timeDuration;

	if (pastSeconds < 10) {
		pastSeconds = '0' + pastSeconds;
	}

	progressLine.width(progress * 100 + '%');

	time
		.find('.Controls__pastTime')
		.text(pastMinutes + ':' + pastSeconds);

	timeLine.on('mousedown', function (e) {
		if (e.which === 1) {
			var $this = $(this);
			var clickPos = Math.floor((e.pageX - $this.offset().left) / $this.width() * 100);
			var trackPos = video.duration / 100 * clickPos;

			video.currentTime = trackPos;

			$(document).on('mousemove', moveProgressLine);
		}
	});
});

function moveProgressLine(e) {
	var movePos = Math.floor((e.pageX - timeLine.offset().left) / timeLine.width() * 100);
	var trackPos = video.duration / 100 * movePos;

	video.currentTime = trackPos;
}

var fullscreen = $('.Controls__fullscreen');

fullscreen.on('click', () => {
	if (!document.fullscreenElement) {
		document.querySelector('.About__video__box').requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
