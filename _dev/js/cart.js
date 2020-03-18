$(document).ready(function () {
	var CartProduct = $('.Cart__Product');
	var QuantityCartProduct = CartProduct.length;
	var ProductQuantity = $('.Product__quantity');
	var QuantityResult;
	var QuantityResultValue;
	var ProductPrice;
	var ProductPriceValue;
	var StaticProductPrice;
	var ProductPriceSum = $('.Product__desc__Price--bigFormat');
	var ProductSubtotalSum = $('.Product__subtotal__Sum');
	var ProductTotalSum = $('.Product__total__Sum');
	var ProductShip = $('.Product__ship__Box');
	var SubtotalSum = 0;
	var ChoosedShipPrice = 0;
	var ProductControls = $('.Product__Controls');
	var ProductCuponInput = $('.Product__cupon__Input');
	var CuponNotice = $('.CuponNotice');
	var ProductCuponVal;
	var cupon = 'Rustam';
	var CuponPrice = 0;
	var CuponFlag = true;
	var ProductDelete = $('.Product__delete');
	var ProductDeleteFlag = true;
	var DeletedProductPrice = 0;
	var TotalDeletedProductPrice = 0;

	// Проверка пустой корзины
	if (!CartProduct.length) {
		$('.EmptyCartTitle').fadeIn(300);
		$('.EmptyCartImg').fadeIn(300);
	}

	// Устанавливает начальное значение промежуточной и итоговой стоимости
	for (var i = 0; i < ProductPriceSum.length; i++) {
		SubtotalSum += parseFloat(ProductPriceSum[i].innerText);
	}
	ProductSubtotalSum.text(SubtotalSum + 'р');
	ProductTotalSum.text(ProductSubtotalSum.text());

	// Вытягиваем начальную доставку
	var historyShip = $('.Product__ship__Box')
		.find('input:checked')
		.closest('label')
		.find('span')
		.text();

	historyShip.split(' ').map(i => {
		if (parseFloat(i)) {
			ChoosedShipPrice = parseFloat(i);
		}
	});

	if (typeof ChoosedShipPrice === 'number') {
		$('.Product__total__Sum').text(
			parseFloat($('.Product__total__Sum').text()) + ChoosedShipPrice + 'р'
		);
	}

	// Вытягиваем начальный купон
	var startCuponFlag = true;
	if (locStorage.getProduct('cart').length) {
		var locCupon = locStorage.getProduct('cart')[0].cupon;
		if (locCupon) {
			startCuponFlag = false;
			$('.Product__cupon__Btn')
				.prop('disabled', true)
				.addClass('BtnDisabled');
			ProductSubtotalSum
				.text(parseFloat(ProductSubtotalSum.text()) - locCupon + 'р');
			ProductTotalSum
				.closest('.Product__total')
				.find('span')
				.fadeIn(300);
			ProductTotalSum.text(
				parseFloat(ProductTotalSum.text()) - locCupon + 'р'
			);
		}
	}

	// Обработчик изменений количетсво
	var QuantityArr = [];
	for (var i = 0; i < ProductQuantity.find('.result__input').length; i++) {
		QuantityArr.push(parseInt(ProductQuantity.find('.result__input')[i].value));
	}

	ProductQuantity.on('click', (e) => {
		var target = $(e.target);
		var container = target.closest('.Cart__Product');
		QuantityResult = $('.result__input');
		ProductPrice = $('.Product__desc__Price--bigFormat');
		StaticProductPrice = $('.Product__desc__Price');
		var QuantityResultIndex = QuantityResult
			.index(target
				.closest('.Product__quantity')
				.find('.result__input'));
		var ProductPriceIndex = ProductPrice
			.index(container
				.find('.Product__desc__Price--bigFormat'));
		var StaticProductPriceIndex = StaticProductPrice
			.index(container
				.find('.Product__desc__Price'));
		QuantityResult = QuantityResult.eq(QuantityResultIndex);
		QuantityResultValue = QuantityResult.val();
		ProductPrice = ProductPrice.eq(ProductPriceIndex);
		StaticProductPrice = StaticProductPrice.eq(StaticProductPriceIndex);
		ProductPriceValue = parseFloat(StaticProductPrice.text());

		getCurrentPrice(target);
	});

	ProductQuantity.on('keyup', (e) => {
		var target = $(e.target);
		var key = e.key;
		if (locCupon) {
			var cuponPrice = locCupon;
		} else {
			var cuponPrice = CuponPrice;
		}
		var ProductPrice = target
			.closest('.Product__quantity')
			.next();
		var StaticPrice = parseFloat(
			target
				.closest('.Cart__Product')
				.find('.Product__desc__Price')
				.text()
		);
		var QuantityVal = parseFloat(target.val());
		if (QuantityVal >= 10) {
			QuantityVal = 10;
			target.val(QuantityVal);
		}
		QuantityArr.push(QuantityVal);
		var index = $('.result__input').index(target);
		if (target.val() === '' || QuantityVal <= 0) {
			QuantityArr.splice(QuantityArr.indexOf(''), 1);
			QuantityVal = QuantityArr[index];
		}
		if (key === '+' || key === '-' || key === '.') {
			target.val(QuantityArr[index]);
		}
		if (!isInteger(QuantityVal) && target.val() !== '') {
			QuantityVal = QuantityArr[index];
			QuantityArr[QuantityArr.length - 1] = QuantityVal;
			target.val(QuantityVal);
		}
		QuantityArr[index] = QuantityArr[QuantityArr.length - 1];
		ProductPrice.text(StaticPrice * QuantityVal + 'р');
		if (parseFloat(ProductSubtotalSum.text()) - StaticPrice < 0) {
			ProductSubtotalSum
				.text(parseFloat(ProductSubtotalSum.text()) + cuponPrice + 'р');
			ProductTotalSum
				.text(parseFloat(ProductTotalSum.text()) + cuponPrice + 'р');
			cancelCupon();
			}
		getSubAndTotalSum();
	});

	// Обработчик выбора доставки
	ProductShip.on('input', (e) => {
		var target = $(e.target);
		var container = target.closest('label');
		var ShipPrice = container
			.find('span')
			.text();
		ShipPrice
			.split(' ')
			.map(i => {
				parseFloat(i);
				if (parseFloat(i)) {
					ShipPrice = parseFloat(i);
				}
			});
		if (typeof ShipPrice === 'number') {
			ProductTotalSum
				.text(parseFloat(ProductTotalSum.text()) + ShipPrice + 'р');
			ChoosedShipPrice = parseFloat(ShipPrice);
		} else {
			ChoosedShipPrice = 0;
			ProductTotalSum
				.text(ProductSubtotalSum.text());
		}
		if (ProductShip.find('input:checked')) {
			ProductShip.removeClass('Product__ship__Box--active');
		}
	});

	// Обрабатываем значение купона
	ProductCuponInput.on('input', () => {
		ProductCuponVal = ProductCuponInput.val();
	});

	// Проверяем и применяем купон
	ProductControls.on('click', (e) => {
		var target = $(e.target);
		if (target.hasClass('Product__cupon__Btn')) applyCupon(target);
		if (target.hasClass('CartUpdateBtn')) {
			var arr = locStorage.getProduct('cart');
			for (var i = 0; i < arr.length; i++) {
				arr[i].cupon = 0;
			}
			locStorage.setProduct(arr, 'cart');
			location.reload();
		}
	});

	$(document).on('keypress', (e) => {
		var key = e.key;
		if (startCuponFlag) {
			if (key === 'Enter') applyCupon();
		}
	});

	// Удаляем товар из корзины
	ProductDelete.on('click', (e) => {
		if (locCupon) {
			var cuponPrice = locCupon;
		} else {
			var cuponPrice = CuponPrice;
		}
		var target = $(e.target);
		var DeletedProduct = target.closest('.Cart__Product');
		if (ProductDeleteFlag) {
			ProductDeleteFlag = false;
			DeletedProductPrice = parseFloat(DeletedProduct.find('.Product__desc__Price--bigFormat').text());
			TotalDeletedProductPrice += DeletedProductPrice;
			setTimeout(() => { // Ждем пока коммон не удалит товар
				QuantityCartProduct--;
				if (parseFloat(ProductSubtotalSum.text()) - DeletedProductPrice < 0) {
					ProductSubtotalSum
						.text(parseFloat(ProductSubtotalSum.text()) - DeletedProductPrice + cuponPrice + 'р');
					ProductTotalSum
						.text(parseFloat(ProductTotalSum.text()) - DeletedProductPrice + cuponPrice + 'р');
					cancelCupon();
				} else {
					ProductSubtotalSum
						.text(parseFloat(ProductSubtotalSum.text()) - DeletedProductPrice + 'р');
					ProductTotalSum
						.text(parseFloat(ProductTotalSum.text()) - DeletedProductPrice + 'р');
				}
				if (parseFloat(ProductSubtotalSum.text()) < 0) {
					ProductSubtotalSum
						.text(parseFloat(ProductSubtotalSum.text()) + cuponPrice + 'р');
					ProductTotalSum
						.text(parseFloat(ProductTotalSum.text()) + cuponPrice + 'р');
					cancelCupon();
				}
				if (!QuantityCartProduct) {
					$('.EmptyCartTitle').fadeIn(300);
					$('.EmptyCartImg').fadeIn(300);
				}
				ProductDeleteFlag = true;
			}, 300);
		}
	});

	function applyCupon(target) {
		if (ProductCuponVal === cupon) {
			CuponPrice = 2000;
			if (CuponFlag) {
				if (parseFloat(ProductSubtotalSum.text()) - CuponPrice < 0) {
					CuponNotice.find('.Cupon__price').text(CuponPrice + 'р');
					CuponPrice = 0;
					CuponNotice.slideDown(300);
				} else {
					CuponFlag = false;
					ProductSubtotalSum
						.text(parseFloat(ProductSubtotalSum.text()) - CuponPrice + 'р');
					ProductTotalSum
						.text(parseFloat(ProductTotalSum.text()) - CuponPrice + 'р');
					CuponNotice.slideUp(300);
					ProductTotalSum
						.closest('.Product__total')
						.find('span')
						.fadeIn(300);
					ProductCuponInput.val('');
					ProductCuponInput.blur();
					if (target) {
						target.prop('disabled', true);
						target.addClass('BtnDisabled');
					} else {
						let Btn = $('.Product__cupon__Btn');
						Btn.prop('disabled', true);
						Btn.addClass('BtnDisabled');
					}
				}
			}
		}
	}

	function cancelCupon() {
		CuponPrice = 0;
		locCupon = 0;
		CuponFlag = true;
		startCuponFlag = true;
		ProductControls
			.find('.Product__cupon__Btn')
			.prop('disabled', false)
			.removeClass('BtnDisabled');
		ProductTotalSum
			.closest('.Product__total')
			.find('span')
			.fadeOut(300);
	}

	function getCurrentPrice(target) {
		QuantityArr.push(QuantityResultValue);
		var QuantityValue = target
			.closest('.Product__quantity')
			.find('.result__input');
		var index = $('.result__input').index(QuantityValue);
		if (QuantityValue.val() === '' || QuantityResultValue <= 0) {
			QuantityArr.splice(QuantityArr.indexOf(''), 1);
			QuantityResultValue = QuantityArr[index];
		}
		QuantityArr[index] = QuantityArr[QuantityArr.length - 1];
		if (locCupon) {
			var cuponPrice = locCupon;
		} else {
			var cuponPrice = CuponPrice;
		}
		if (target.hasClass('minus')) {
			QuantityResultValue--;
			if (QuantityResultValue <= 1) {
				QuantityResultValue = 1;
			}
			if (parseFloat(ProductSubtotalSum.text()) - ProductPriceValue < 0) {
				ProductSubtotalSum
					.text(parseFloat(ProductSubtotalSum.text()) + cuponPrice + 'р');
				ProductTotalSum
					.text(parseFloat(ProductTotalSum.text()) + cuponPrice + 'р');
				cancelCupon();
			}
			if (QuantityResultValue !== 1) {
				ProductPrice
					.text((ProductPriceValue * QuantityResultValue) + 'р');
			} else {
				ProductPrice
					.text(ProductPriceValue + 'р');
			}
			QuantityResult.val(QuantityResultValue);
		}
		if (target.hasClass('plus')) {
			QuantityResultValue++;
			if (QuantityResultValue >= 10) {
				QuantityResultValue = 10;
			}
			if (QuantityResultValue !== 1) {
				ProductPrice
					.text((ProductPriceValue * QuantityResultValue) + 'р');
			} else {
				ProductPrice
					.text(ProductPriceValue + 'р');
			}
			QuantityResult.val(QuantityResultValue);
		}
		getSubAndTotalSum();
	}

	function getSubAndTotalSum() {
		if (locCupon) {
			var cuponPrice = locCupon;
		} else {
			var cuponPrice = CuponPrice;
		}
		SubtotalSum = 0;
		for (var i = 0; i < ProductPriceSum.length; i++) {
			SubtotalSum += parseFloat(ProductPriceSum[i].innerText);
		}
		SubtotalSum -= (TotalDeletedProductPrice + cuponPrice);
		ProductSubtotalSum.text(SubtotalSum + 'р');
		ProductTotalSum
			.text(parseFloat(ProductSubtotalSum.text()) + parseFloat(ChoosedShipPrice) + 'р');
	}

	// Редиректим на покупку
	var Checkout = $('.ProductBuy');
	var AnimFlag = true;
	Checkout.on('click', () => {
		if (!$('.Cart__Product').length) {
			if (AnimFlag) {
				AnimFlag = false;
				$('.EmptyCartTitle').addClass('EmptyCartTitle--active');
				setTimeout(() => {
					$('.EmptyCartTitle').removeClass('EmptyCartTitle--active');
					AnimFlag = true;
				}, 1000);
			}
			return;
		}
		if (!ProductShip.find('input:checked').length) {
			ProductShip.addClass('Product__ship__Box--active');
			return;
		}
		var Ship = ProductShip
			.find('input:checked')
			.parent()
			.find('span')[0].innerText;
		var arr = JSON.parse(localStorage.getItem('cart'));
		var quantity = $('.result__input');
		for (var i = 0; i < arr.length; i++) {
			arr[i].quantity = quantity[i].value;
			arr[i].price = ProductPriceSum[i].innerText;
			arr[i].ship = Ship;
			if (CuponPrice) {
				arr[i].cupon = CuponPrice;
			}
		}
		localStorage.setItem('cart', JSON.stringify(arr));
		location.assign('checkout.html');
	});

});
