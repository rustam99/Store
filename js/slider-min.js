"use strict";$(document).ready(function(){!function(i){var d=Object.assign({dots:!0,arrows:!0,autoSwitch:!1,showSlide:1,scrollSlide:1},i),e=$(".Slider"),r=e.find(".Slider__content");$('<ul class="Slider__list">').appendTo(e);e.find(".Slider__list");r.wrap('<li class="Slider__item">');e.find(".Slider__item");var l=[];if(e.each(function(){var i=$(this),d=i.find(".Slider__item");l.push(d.length),i.find(".Slider__list").append(d),i.find(".Slider__item").eq(0).nextAll().addClass("Slider__item--hidden")}),d.dots){$('<ul class="Slider__dots">').appendTo(e);var _=$(".Slider__dots");_.each(function(i){for(var d=$(this),e=0;e<l[i];e++)d.append($('<li class="Slider__dot">'));d.find(".Slider__dot").eq(0).addClass("Slider__dot--active")})}if(d.arrows){$('<div class="Slider__arrow Slider__arrow--prev">').appendTo(e),$('<div class="Slider__arrow Slider__arrow--next">').appendTo(e);$(".Slider__arrow")}}()});