// Добавлять скрипты только те которые используется не на одной страницы!!!

// Вывод категорий
var categories = $('.Nav__sub__Item--categories');
var categoriesList = $('.js-headerCategories');
var categoriesFlag = true;

categories.on('click', () => {
	if (categoriesFlag) {
		categoriesFlag = false;
		categoriesList.fadeIn(300);
		setTimeout(() => { // Не через колбэк потому-что нужен flex
			categoriesList.addClass('categoriesActive');
			categoriesList.removeAttr('style');
		});
	} else {
		categoriesList.fadeOut(300, () => {
			categoriesList.removeClass('categoriesActive');
			categoriesFlag = true;
		});
	}
});

function hideCategories(target) {
	if (!target.hasClass('Nav__link Nav__link--arrow')) {
		categoriesList.fadeOut(300, () => {
			categoriesList.removeClass('categoriesActive');
			categoriesFlag = true;
		});
	}
}

// Передовать значение поиска на сервер
var searchInput = $('.search');
var searchInputValue;

searchInput.on('input', () => {
	searchInputValue = searchInput[0].value;
});

// Вывод личного кабинета
var profile = $('.Nav__icon__Item--profile');
var profileListAuth = $('.Profile__list--auth');
var profileListUnAuth = $('.Profile__list--unAuth');
var profileAuth = false; // Брать значение с сервера
var profileFlag = true;

profile.on('click', () => {
	if (profileAuth) {
		if (profileFlag) {
			profileFlag = false;
			profileListAuth.slideDown(300);
			profile.addClass('profileActive');
		} else {
			profileListAuth.slideUp(300, () => {
				profile.removeClass('profileActive');
				profileFlag = true;
			});
		}
	} else {
		if (profileFlag) {
			profileFlag = false;
			profileListUnAuth.slideDown(300);
			profile.addClass('profileActive');
		} else {
			profileListUnAuth.slideUp(300, () => {
				profile.removeClass('profileActive');
				profileFlag = true;
			});
		}
	}
});

function hideProfile(target) {
	if (!target.hasClass('Nav__icon__Item--profile')) {
		$('.Profile__list').slideUp(300, () => {
			profileFlag = true;
		});
	}
}

// Редиректим в корзину
var cart = $('.Nav__icon__Item--cart');

cart.on('click', () => {
	window.location.assign('layouts/cart.html');
});

// Открываем избранное
var wish = $('.Nav__icon__Item--like, .Profile__item--wish');
var wishBox = $('.WishBox');

wish.on('click', () => {
	wishBox.fadeIn(300);
});

function hideWish(key) {
	wishBox.fadeOut(300);
}

wishBox.on('click', (e) => {
	var target = $(e.target);
	if (target.hasClass('Product__delete--closeWishBox')) {
		wishBox.fadeOut(300);
	}
	if (target.hasClass('WishBox__item') ||
		target.hasClass('WishBox__item__Title') ||
		target.hasClass('WishBox__item__Price') ||
		target.hasClass('WishBox__item__Stoke') ||
		target.prop('tagName') == 'IMG') {
		location.assign('layouts/product_card.html');
	}
});

// Добавление товаров в избранное, корзину и карточку товара
var WishIco = $('.Icons--heart');
var WishBoxList = $('.WishBox__list');
var WishFlag;
var LikeInc = $('.Like__inc');

var CartProducts = $('.Products');
var CartIco = $('.Icons--plus');
var CartFlag;
var CartInc = $('.Cart__inc');
var ProductBtn = $('.Product__btn');

var ItemDetails = $('.Item__details');

class LocalStorage {
	constructor() { }
	getProduct(param) {
		var products = localStorage.getItem(param);
		return JSON.parse(products);
	}
	setProduct(product, key) {
		localStorage.setItem(key, JSON.stringify(product));
	}
}

var locStorage = new LocalStorage('product');
var wishProducts = locStorage.getProduct('wish');
var cartProducts = locStorage.getProduct('cart');

if (wishProducts == null) {
	wishProducts = [];
}

if (cartProducts == null) {
	cartProducts = [];
}

LikeInc.text(wishProducts.length);
CartInc.text(cartProducts.length);

for (var i = 0; i < wishProducts.length; i++) {
	WishProduct(
		locStorage.getProduct('wish')[i].id,
		locStorage.getProduct('wish')[i].img,
		locStorage.getProduct('wish')[i].name,
		locStorage.getProduct('wish')[i].price);
}

for (var i = 0; i < cartProducts.length; i++) {
	CartProduct(
		locStorage.getProduct('cart')[i].id,
		locStorage.getProduct('cart')[i].img,
		locStorage.getProduct('cart')[i].name,
		locStorage.getProduct('cart')[i].price,
		locStorage.getProduct('cart')[i].quantity);
}

for (var i = 0; i < wishProducts.length; i++) {
	var id = wishProducts[i].id;
	WishIco
		.closest('ul')
		.find(`#${id}`)
		.find('.WishText')
		.text('Удалить из избранных');
	WishIco
		.closest('ul')
		.find(`#${id}`)
		.find('.Icons--heart')
		.removeClass('Icons--heart')
		.addClass('Icons--heartActive');
}

for (var i = 0; i < cartProducts.length; i++) {
	var id = cartProducts[i].id;
	CartIco
		.closest('ul')
		.find(`#${id}`)
		.find('.CartText')
		.text('Удалить из корзины');
	CartIco
		.closest('ul')
		.find(`#${id}`)
		.find('.Icons--plus')
		.removeClass('Icons--plus')
		.addClass('Icons--plusActive');
}

// Избрранное
WishIco.on('click', (e) => {
	var target = $(e.target);
	var container = target.closest('li');
	var id = container.attr('id');
	var imgUrl = container
		.find('img')
		.attr('src');
	var price = container
		.find('.Item__price')
		.text();
	var name = container
		.find('.Item__desc')
		.text();
	var productData = {
		id: id,
		img: imgUrl,
		price: price,
		name: name
	};
	operationProduct(container, productData, addProduct, 'wish');
});

WishBoxList.on('click', (e) => {
	var target = $(e.target);
	if (target.hasClass('Product__delete')) {
		var id = target.closest('li').attr('id');
		var obj = { id: id };

		operationProduct(null, obj, null, 'wish');

		WishIco
			.closest('ul')
			.find(`#${id}`)
			.find('.WishText')
			.text('Добавить в избранное');
		WishIco
			.closest('ul')
			.find(`#${id}`)
			.find('.Icons--heartActive')
			.removeClass('Icons--heartActive')
			.addClass('Icons--heart');
		WishFlag = true;
	}
});

// Корзина
CartIco.on('click', (e) => {
	var target = $(e.target);
	var container = target.closest('li');
	var id = container.attr('id');
	var imgUrl = container
		.find('img')
		.attr('src');
	var name = container
		.find('.Item__desc')
		.text();
	var price = container
		.find('.Item__price')
		.text();
	var productData = {
		id: id,
		img: imgUrl,
		price: price,
		name: name
	};

	operationProduct(container, productData, addProduct, 'cart');
});

CartProducts.on('click', (e) => {
	var target = $(e.target);
	if (target.hasClass('Product__delete')) {
		var id = target.closest('.Cart__Product').attr('id');
		var obj = { id: id };

		operationProduct(null, obj, null, 'cart');

		CartIco
			.closest('ul')
			.find(`#${id}`)
			.find('.CartText')
			.text('Добавить в корзину');
		CartIco
			.closest('ul')
			.find(`#${id}`)
			.find('.Icons--plus')
			.removeClass('Icons--plusActive')
			.addClass('Icons--plus');
		CartFlag = true;
	}
});

// карточка товара
ItemDetails.on('click', (e) => {
	var target = $(e.target);
	var container = target.closest('li');
	var id = container.attr('id');
	var imgUrl = container
		.find('img')
		.attr('src');
	var name = container
		.find('.Item__desc')
		.text();
	var price = container
		.find('.Item__price')
		.text();
	var productData = {
		id: id,
		img: '../' + imgUrl,
		name: name,
		price: price
	}
	locStorage.setProduct(productData, 'temporary');
});

function operationProduct(container, obj, fn, type) {
	if (type == 'wish') {
		WishFlag = true;
		var arr = wishProducts;
	} else if (type == 'cart') {
		CartFlag = true;
		var arr = cartProducts;
	}
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].id === obj.id) {
			var deleteProduct = locStorage.getProduct(type);
			deleteProduct.splice(i, 1);
			locStorage.setProduct(deleteProduct, type);
			if (type == 'wish') {
				wishProducts = locStorage.getProduct(type);
				arr = wishProducts;
			} else if (type == 'cart') {
				cartProducts = locStorage.getProduct(type);
				arr = cartProducts;
			}
			if (type == 'wish') {
				WishBoxList
					.find(`#${obj.id}`)
					.remove();
			} else {
				CartProducts
					.find(`#${obj.id}`)
					.fadeOut(300, function () {
						$(this).remove();
					});
			}
			if (container && type == 'wish') {
				changeTextAndIco(type, 'Добавить в избранное', container);

			} else if (container && type == 'cart') {
				changeTextAndIco(type, 'Добавить в корзину', container);
			}
			if (type == 'wish') {
				LikeInc.text(arr.length);
				WishFlag = false;
			} else if (type == 'cart') {
				CartInc.text(arr.length);
				ProductBtn.text('Добавить');
				CartFlag = false;
			}
		}
	}
	if (fn) fn(obj, container, type);
}

function addProduct(obj, container, type) {
	if (type == 'wish') {
		var flag = WishFlag;
		var arr = wishProducts;
	} else {
		var flag = CartFlag;
		var arr = cartProducts;
	}
	if (flag) {
		arr.push(obj);
		locStorage.setProduct(arr, type);
		if (type == 'wish') {
			WishProduct(obj.id, obj.img, obj.name, obj.price);
			changeTextAndIco(type, 'Удалить из избранных', container);
			LikeInc.text(wishProducts.length);
		} else if (type == 'cart') {
			CartProduct(obj.id, obj.img, obj.name, obj.price, obj.quantity);
			changeTextAndIco(type, 'Удалить из корзины', container);
			CartInc.text(cartProducts.length);
			ProductBtn.text('Удалить');
		}
	}
}

function changeTextAndIco(type, text, container) {
	if (type == 'wish') {
		var objFindText = 'WishText';
		if (text == 'Удалить из избранных') {
			var objFindIco = 'Icons--heart';
			var addClass = 'Icons--heartActive';
		} else {
			var objFindIco = 'Icons--heartActive';
			var addClass = 'Icons--heart';
		}
	} else {
		var objFindText = 'CartText';
		if (text == 'Удалить из корзины') {
			var objFindIco = 'Icons--plus';
			var addClass = 'Icons--plusActive';
		} else {
			var objFindIco = 'Icons--plusActive';
			var addClass = 'Icons--plus';
		}
	}
	container
		.find('.' + objFindText)
		.text(text);
	container
		.find('.' + objFindIco)
		.removeClass(objFindIco)
		.addClass(addClass);
}

function WishProduct(id, img, name, price) {
	var path = location.pathname.split('/').pop();
	if (path == 'index.html') {
		if (img.split('/')[0] == '..') {
			var tmp = img.split('/');
			tmp.splice(0, 1);
			img = tmp.join('/');
		}
	}
	$(`
		<li class="WishBox__item" id="${id}">
			<div class="Product__delete"></div>
			<div class="WishBox__item__Img">
				<img src="${img}" alt="Product">
			</div>
			<div class="WishBox__item__Desc">
				<div class="WishBox__item__Title">${name}</div>
				<div class="WishBox__item__Price">${price}</div>
				<div class="WishBox__item__Stoke">В наличии</div>
			</div>
		</li>
	`).appendTo(WishBoxList);
}

function CartProduct(id, img, name, price, quantity) {
	var path = location.pathname.split('/').pop();
	if (path == 'cart.html') {
		if (img.split('/')[0] != '..') {
			img = '../' + img;
		}
	} else if (path == 'index.html') {
		if (img.split('/')[0] == '..') {
			var tmp = img.split('/');
			tmp.splice(0, 1);
			img = tmp.join('/');
		}
	}
	if (!quantity) {
		quantity = 1;
	}
	price = parseFloat(price);
	quantity = parseFloat(quantity);
	$(`
		<div class="Cart__Product" id="${id}">
			<div class="Product__info">
				<div class="Cart__Product__img">
					<img src="${img}" alt="Product">
				</div>
				<div class="Cart__Product__desc">
					<div class="Product__desc__Name">${name}</div>
					<div class="Product__desc__Price">${price / quantity}р</div>
				</div>
			</div>
			<div class="Product__quantity">
				<span class="minus">&minus;</span>
				<span class="result">
					<input class="result__input" type="number" value="${quantity}">
				</span>
				<span class="plus">+</span>
			</div>
			<div class="Product__desc__Price--bigFormat">${price}р</div>
			<div class="Product__delete"></div>
		</div>
	`).appendTo(CartProducts);
}

// Скрывание DOM объектов по клику на document, передовать вызов функций
(function () {
	var doc = $(document);

	doc.on('click', (e) => {
		var target = $(e.target);
		hideProfile(target);
		hideCategories(target);
	});
}());

// Скрывание DOM объектов по Esc, передовать вызов функций
(function () {
	var doc = $(document);

	doc.on('keyup', (e) => {
		var key = e.key;
		hideWish(key);
	});
}());

// Общие функции
function isInteger(num) {
	return (num ^ 0) === num;
}
