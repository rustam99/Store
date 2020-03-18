(function () { // -> Наполняем продукты
	var arr = JSON.parse(localStorage.getItem('cart'));
	for (var i = 0; i < arr.length; i++) {
		createProduct(
			arr[i].id,
			arr[i].img,
			arr[i].name,
			arr[i].price,
			arr[i].quantity);
	}

	$('.Product__ship__Box')
		.find('span')
		.text(arr[0].ship);

	function createProduct(id, img, name, price, quantity) {
		if (img.split('/')[1] == '..') {
			var image = img.split('/');
			image.splice(0, 1);
			img = image.join('/');
		} else if (img.split('/')[0] != '..') {
			img = '../' + img;
		}
		if (!quantity) {
			quantity = 1;
		} else {
			price = parseFloat(price);
			quantity = parseFloat(quantity);
		}
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
				<div class="Order__quantity">${quantity}</div>
				<div class="Product__desc__Price--bigFormat">${price}р</div>
			</div>
		`).appendTo($('.Products'));
	}
	var ProductTotalSum = $('.Product__desc__Price--bigFormat');
	var SubtotalSum = 0;
	for (var i = 0; i < ProductTotalSum.length; i++) {
		SubtotalSum += parseFloat(ProductTotalSum[i].innerText);
	}
	var ShipPrice = $('.Product__ship__Box').find('span').text();
	var cupon = arr[0].cupon;
	if (!cupon) {
		cupon = 0;
	} else {
		$('.Product__total')
			.find('span')
			.css('display', 'block');
	}
	ShipPrice.split(' ').map(i => {
		parseFloat(i);
		if (parseFloat(i)) {
			ShipPrice = parseFloat(i);
		}
	});
	$('.Product__subtotal__Sum').text(SubtotalSum - cupon + 'р');
	if (typeof ShipPrice === 'number') {
		$('.Product__total__Sum').text(SubtotalSum + ShipPrice - cupon + 'р');
	} else {
		$('.Product__total__Sum').text(SubtotalSum - cupon + 'р');
	}
}()); // <- Наполняем продукты

var form = $('.Checkout__form'); // -> Валидация формы

form.focusout(function (e) {
	var target = $(e.target);
	if (target.attr('id') === 'name' || target.attr('id') === 'surname') {
		if (target.val().length >= 3) {
			addValid(target);
			target.next().slideUp(300);
		} else {
			addInvalid(target);
			var text;
			if (target.attr('id') === 'name') {
				text = 'Имя должно быть не менее 3-х символов';
			} else {
				text = 'Фамилия должна быть не менее 3-х символов';
			}
			target
				.next()
				.text(text)
				.slideDown(300);
		}
	} else if (target.attr('id') === 'email') {
		if (checkEmail(target).flag === 4) {
			addValid(target);
			target.next().slideUp(300);
		} else {
			addInvalid(target);
			var text = checkEmail(target).cause;
			target
				.next()
				.text(text)
				.slideDown(300);
		}
	} else if (target.attr('id') === 'tel') {
		if (target.val().length < 19) {
			addInvalid(target);
			target
				.next()
				.text('Номер должен состоять из 11 цифр')
				.slideDown(300);
		} else {
			addValid(target);
			target.next().slideUp(300);
		}
	} else if (target.attr('id') === 'adress') {
		if (isLatinic(target.val())) {
			addInvalid(target);
			target
				.next()
				.text('Адресс должен быть написан на кирилице')
				.slideDown(300);
		} else {
			addValid(target);
			target.next().slideUp(300);
		}
	}
}); // <- Валидация формы

(function () { // -> Маска для телефона
	var tel = document.querySelector('.Checkout__tel input');
	var maskOptions = {
		mask: '8 ( 000 ) 000_00_00'
	};
	var mask = IMask(tel, maskOptions);
}()); // <- Маска для телефона

function addValid(target) {
	target.removeClass('Checkout__input--invalid');
	target.addClass('Checkout__input--valid');
}

function addInvalid(target) {
	target.removeClass('Checkout__input--valid');
	target.addClass('Checkout__input--invalid');
}

function checkEmail(target) {
	var at = target.val().split('').indexOf('@');
	var CorrectEmail = 0;
	var cause;
	if (target.val().split(' ').length === 1) {
		CorrectEmail++;
		if (at != -1) {
			CorrectEmail++;
			var characters = target.val().split('');
			var symbols = ['.', ',', '!', '@', '#', '"', '`', '~', '№', '$', ';', '%', '^', ':', '&', '?', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '\'', '\\', '|', '/', '<', '>', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
			if (!symbols.includes(characters[at + 1])) {
				var dotPosition;
				var count = 0;
				CorrectEmail++;
				for (var i = at + 1; i < characters.length; i++) {
					if (characters[i] === '.') {
						dotPosition = i;
						for (var j = dotPosition + 1; j < characters.length; j++) {
							count++;
						}
					}
				}
				if (count > 1) {
					CorrectEmail++;
				} else {
					cause = 'Доменая зона не может быть короче 2-х символов';
				}
			} else {
				cause = 'Первый символ после символа @ не должен быть цифрой или спецсимволом';
			}
		} else {
			cause = 'Email должен содержать символ @';
		}
	} else {
		cause = 'Email не должен содержать пробелов';
	}

	return {
		flag: CorrectEmail,
		cause: cause
	}
}

function isLatinic(text) {
	return /[a-z]/i.test(text);
}
