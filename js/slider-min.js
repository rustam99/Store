"use strict";$(document).ready(function(){!function(e,i){var r=Object.assign({dots:!0,arrows:!0,autoSwitch:3,duration:1,showSlide:1,scrollSlide:1,slideProgress:!1,theme:"default"},i);if(!e)return void console.error("Необходимо передать объект первым аргументом");var t=e,d=t.find(".Slider__content");$('<ul class="Slider__list">').appendTo(t);t.find(".Slider__list");d.wrap('<li class="Slider__item">');t.find(".Slider__item");var n=[];if(t.each(function(){var e=$(this),i=e.find(".Slider__item");n.push(i.length),e.find(".Slider__list").append(i),e.find(".Slider__item").eq(0).nextAll().addClass("Slider__item--hidden")}),r.dots){$('<ul class="Slider__dots">').appendTo(t);var a=$(".Slider__dots");a.each(function(e){for(var i=$(this),r=0;r<n[e];r++)i.append($('<li class="Slider__dot">'));i.find(".Slider__dot").eq(0).addClass("Slider__dot--active")})}if(r.arrows){$('<div class="Slider__arrow Slider__arrow--prev">').appendTo(t),$('<div class="Slider__arrow Slider__arrow--next">').appendTo(t);var l=$(".Slider__arrow")}for(var s=[],o=0;o<n.length;o++)s.push(0);for(var _=[],o=0;o<n.length;o++)_.push(!0);r.dots&&a.on("click",function(i){var r=$(i.target),t=r.parent().parent();if(r.hasClass("Slider__dot")){var d=e.index(t);_[s[d]]&&(s[d]<r.index()?f(r.index(),t,"right"):s[d]>r.index()&&f(r.index(),t,"left"),s[d]=r.index())}});r.arrows&&l.on("click",function(i){var r=$(i.target),t=r.parent(),d=e.index(t),n=t.find(".Slider__item").children().length;_[s[d]]&&(r.hasClass("Slider__arrow--prev")?(0===s[d]?s[d]=n-1:s[d]-=1,f(s[d],t,"left")):r.hasClass("Slider__arrow--next")&&(s[d]===n-1?s[d]=0:s[d]+=1,f(s[d],t,"right")))});if(r.autoSwitch){var c=r.autoSwitch.toString().split("");-1===c.indexOf(".")?c=parseInt(c[0]+"000"):(c.splice(c.indexOf("."),1),c[1]+="00",c=parseInt(c.join(""))),e.each(function(e){var i=$(this);setInterval(function(){_[s[e]]&&(s[e]++,s[e]>=n[e]&&(s[e]=0),f(s[e],i,"right"))},c)})}function f(e,i,t){_[e]=!1;var d=i.find(".Slider__item").eq(e),n=i.find(".Slider__item:not(.Slider__item--hidden)"),a={zero:0,hundred:-100};"right"===t?(a.hundred=100,d.css({transform:"translateX(100%)",visibility:"visible"})):"left"===t&&d.css({transform:"translateX(-100%)",visibility:"visible"}),r.dots&&i.find(".Slider__dot").eq(e).addClass("Slider__dot--active").siblings().removeClass("Slider__dot--active");var l=setInterval(function(){"right"===t?(a.zero--,a.hundred--):"left"===t&&(a.zero++,a.hundred++),d.css("transform","translateX(".concat(a.hundred,"%)")),n.css("transform","translateX(".concat(a.zero,"%)")),0===a.hundred&&(clearInterval(l),l=0,n.addClass("Slider__item--hidden").removeAttr("style"),d.removeClass("Slider__item--hidden").removeAttr("style"),_[e]=!0)},12)}}($(".Slider"))});