var SliderList = $('.Slider__list');
var SliderDots = $('.Slider__dots');
var LineToNextSlide = $('.ProgressLine');
var index = 0;
var Flag = true;

AnimNextSlide(6);

LineToNextSlide.on('animationend', Slider);

SliderDots.on('click', (e) => {
	var target = $(e.target);
	if (Flag) NexSlideMouseClick(target);
});

function Slider() {
	AnimNextSlide(6);
	getNextSlide();
}

function NexSlideMouseClick(target) {
	Flag = false;
	if (target.hasClass('Slider__dot')) {
		index = SliderDots.children().index(target);
		SliderDots.children().siblings().removeClass('Slider__dot--active');
		SliderList.children().eq(index).fadeOut(300).removeAttr('style');
		SliderList.children().siblings().removeClass('Slider__item--active');
		target.addClass('Slider__dot--active');
		SliderList.children().eq(index).fadeIn(300).removeAttr('style');
		SliderList.children().eq(index).addClass('Slider__item--active');
		AnimNextSlide(6);
		setTimeout(() => {
			Flag = true;
		});
	}
}

function AnimNextSlide(ms) {
	LineToNextSlide.removeClass('letAnimation');
	if (ms) {
		setTimeout(() => {
			LineToNextSlide.css({ 'animation': `SlideProgress ${ms}s linear` });
		});
		LineToNextSlide.removeAttr('style');
	} else {
		setTimeout(() => {
			LineToNextSlide.addClass('letAnimation');
		});
	}
}

function getNextSlide() {
	SliderList.children().eq(index).fadeOut(300).removeAttr('style');
	SliderList.children().eq(index).removeClass('Slider__item--active');
	SliderDots.children().eq(index).removeClass('Slider__dot--active');
	index = (index + 1) % SliderList.children().length;
	SliderList.children().eq(index).fadeIn(300).removeAttr('style');
	SliderList.children().eq(index).addClass('Slider__item--active');
	SliderDots.children().eq(index).addClass('Slider__dot--active');
}
