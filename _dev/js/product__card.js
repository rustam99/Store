(function () { // Подгружает значение карточки
	var obj = locStorage.getProduct('temporary');
	if (obj.img.split('/')[1] == '..') {
		var img = obj.img.split('/');
		img.splice(0, 1);
		obj.img = img.join('/');
	}
	var ProductViewBox = $('.Product__view__Box .Product__img');
	var ProductPrice = $('.Product__price');
	var ProductTitle = $('.Product__title');
	var productBox = $('.Product__box');
	ProductPrice.text(obj.price);
	productBox.attr('id', obj.id);
	ProductViewBox.attr('src', obj.img);
	ProductTitle.text(obj.name);
	var arr = locStorage.getProduct('cart');
	if (!arr) return;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].id == obj.id) {
			if (arr[i].quantity) {
				ProductPrice.text(parseInt(obj.price) * parseInt(arr[i].quantity) + 'р');
				$('.result__input').val(arr[i].quantity);
			}
			$('.Product__btn').text('Удалить');
		}
	}
}());

var AddedFlag = true;

ProductBtn.on('click', (e) => {
	var target = $(e.target);
	var container = target.closest('.Product__box');
	var id = container.attr('id');
	var imgUrl = container
		.find('.Product__view__Box .Product__img')
		.attr('src');
	var price = container
		.find('.Product__price')
		.text();
	var quantity = container
		.find('.result__input')
		.val();
	var name = $('.Product__title').text();
	var productData = {
		id: id,
		img: imgUrl,
		price: price,
		name: name,
		quantity: quantity
	};

	if (AddedFlag) {
		operationProduct(container, productData, addProduct, 'cart');
	} else {
		locStorage.setProduct([productData], 'cart');
		$('.Product__btn').text('Удалить');
		AddedFlag = true;
	}
});

// Выводит картинки в большой вид
var ProductViewList = $('.Product__view__List');
var ProductViewBox = $('.Product__view__Box').find('img');

ProductViewList.on('click', (e) => {
	var target = $(e.target);
	getCurrentProductImg(target);
});

function getCurrentProductImg(target) {
	if (target.hasClass('Product__img')) {
		var product = target.parent('.Product__view__Item');
		var productActiveAttr = target.parent(product).data();

		if (productActiveAttr.productactive == undefined) {
			product.attr('data-productActive', '');
			var ProdcutImgSrc = target.attr('src');
			ProductViewBox.attr('src', ProdcutImgSrc);
			product
				.siblings()
				.removeAttr('data-productActive');
		}
	}
}

// Устанавливает цвет
var Colors = {
	'Черный': '#585d61',
	'Красный': '#b51616',
	'Синий': '#0b19a6',
	'Зеленый': '#1c880e',
	'Желтый': '#bec41f'
};

var CurrentColorBlock = $('.CurrentColor');
var ColorList = $('.ColorList');
var ColorCircles = $('.ColorCircle');
var ColorNames = $('.ColorName');
var ChooseElem = $('.ChooseElem');

for (var i = 0; i < ColorNames.length; i++) {
	if (Colors.hasOwnProperty(ColorNames[i].innerText)) {
		ColorCircles[i].style =
			'background-color: ' + Colors[ColorNames[i].innerText];
	}
}

var CurrentColor = CurrentColorBlock
	.find('.ColorName')[0];
var CurrentColorCircle = CurrentColorBlock
	.find('.ColorCircle')[0];

CurrentColorBlock.on('click', SlideList);

ColorList.on('click', (e) => {
	var target = $(e.target);
	SetColor(target);
});

function SlideList() {
	if (!ColorList.hasClass('ColorList--active')) {
		ColorList.slideDown(() => {
			ColorList.addClass('ColorList--active');
			ColorList[0].style = '';
			ChooseElem[0].style = 'border-top-color: #ff974e';
			CurrentColorBlock[0].style = 'border-color: #ff974e';
		});
	} else {
		ColorList.slideUp(() => {
			ColorList.removeClass('ColorList--active');
			ColorList[0].style = '';
			ChooseElem[0].style = '';
			CurrentColorBlock[0].style = '';
			CurrentColorBlock[0].style = '';
		});
	}
}

function SetColor(target) {
	var ColorName = target
		.closest('li')
		.find('.ColorName')[0]
		.innerText;
	if (Colors.hasOwnProperty(ColorName)) {
		CurrentColor.innerText = ColorName;
		CurrentColorCircle.style =
			'background-color: ' + Colors[ColorName];
		ColorList.slideUp(() => {
			ColorList.removeClass('ColorList--active');
			ColorList[0].style = '';
			ChooseElem[0].style = '';
			CurrentColorBlock[0].style = '';
		});
	}
}

// Устанавливает стоимость продукта по количеству
var ProductQuantity = $('.Product__quantity');
var QuantityResult = $('.result__input');
var QuantityResultValue = QuantityResult.val();
var ProductPrice = $('.Product__price');
var StatickPrice = parseFloat(locStorage.getProduct('temporary').price);
var ProductPriceValue = parseFloat(ProductPrice.text());

ProductQuantity.on('click', (e) => {
	var target = $(e.target);
	getCurrentPrice(target);
});

var QuantityArr = [];
QuantityArr.push(parseInt(QuantityResult[0].value));

QuantityResult.on('keyup', (e) => {
	var key = e.key;
	QuantityResultValue = parseFloat(QuantityResult.val());
	QuantityArr.push(QuantityResultValue);
	if (QuantityResultValue > 10) {
		QuantityResultValue = 10;
		QuantityResult.val(10);
	}
	if (QuantityResult.val() === '' || QuantityResultValue <= 0) {
		QuantityArr.splice(QuantityArr.indexOf(''), 1);
		QuantityResultValue = QuantityArr[0];
	}
	if (key === '+' || key === '-' || key === '.') {
		QuantityResult.val(QuantityArr[0]);
	}
	if (!isInteger(QuantityResultValue) && QuantityResult.val() !== '') {
		QuantityResultValue = QuantityArr[0];
		QuantityArr[QuantityArr.length - 1] = QuantityResultValue;
		QuantityResult.val(QuantityResultValue);
	}
	QuantityArr[0] = QuantityArr[QuantityArr.length - 1];
	ProductPrice.text(StatickPrice * QuantityResultValue + 'р');
	if (checkAddedProduct()) {
		$('.Product__btn').text('Добавить');
		AddedFlag = false;
	}
});

function checkAddedProduct() {
	var ProductBtnText = $('.Product__btn').text();
	if (ProductBtnText === 'Удалить') {
		return true;
	}
}

function getCurrentPrice(target) {
	QuantityArr.push(QuantityResultValue);
	if (QuantityResult.val() === '' || QuantityResultValue <= 0) {
		QuantityArr.splice(QuantityArr.indexOf(''), 1);
		QuantityResultValue = QuantityArr[0];
	}
	QuantityArr[0] = QuantityArr[QuantityArr.length - 1];
	if (target.hasClass('minus')) {
		QuantityResultValue--;

		if (QuantityResultValue <= 1) {
			QuantityResultValue = 1;
		}

		if (QuantityResultValue != 1) {
			ProductPrice.text(StatickPrice * QuantityResultValue + 'р');
		} else {
			ProductPrice.text(ProductPriceValue + 'р');
		}

		QuantityResult.val(QuantityResultValue);

		if (checkAddedProduct()) {
			$('.Product__btn').text('Добавить');
			AddedFlag = false;
		}
	}

	if (target.hasClass('plus')) {
		QuantityResultValue++;

		if (QuantityResultValue >= 10) {
			QuantityResultValue = 10;
		}

		if (QuantityResultValue != 1) {
			ProductPrice.text(StatickPrice * QuantityResultValue + 'р');
		} else {
			ProductPrice.text(ProductPriceValue + 'р');
		}

		QuantityResult.val(QuantityResultValue);

		if (checkAddedProduct()) {
			$('.Product__btn').text('Добавить');
			AddedFlag = false;
		}
	}
}

// Кнопка подробнее
var MoreInforamtionBtn = $('.more');
var AddInforamtion = $('.Product__configuration__Desc span');
var InforamtionFlag = true;
if (AddInforamtion[0].clientHeight < 126) {
	MoreInforamtionBtn.css('display', 'none');
} else {
	MoreInforamtionBtn.on('click', () => {
		if (InforamtionFlag) {
			InforamtionFlag = false;
			AddInforamtion.css('max-height', '800px');
			MoreInforamtionBtn.text('Скрыть');
		} else {
			MoreInforamtionBtn.text('Подробнее');
			AddInforamtion.css('max-height', '126px');
			InforamtionFlag = true;
		}
	});
}

//Выводит дополнительную информацию о продукте
var ProductAdditionalDescBlock = $('.Product__additionalDesc');
var AdditionalDescTextBlock = $('.AdditionalDesc__text');
var AmountReviewsBlock = $('.AmountReviews');
var AmountReviews = 2;
AmountReviewsBlock.text('(' + AmountReviews + ')');
var ProductAdditionalInit = { // Переписать на JQuery
	Desc: () => {
		var DescBlock = document.createElement('span');
		DescBlock.classList.add('AdditionalDesc__text__Block');
		DescBlock.innerText = 'asdasdaas';

		AdditionalDescTextBlock.append(DescBlock);
	},
	AddittionalDesc: () => {
		var DescBlock = document.createElement('span');
		DescBlock.classList.add('AdditionalDesc__text__Block');
		DescBlock.innerText = 'asdasdaas';

		AdditionalDescTextBlock.append(DescBlock);
	},
	reviews: () => {
		var Comment = document.createElement('div');
		var Person = document.createElement('div');
		var Like = document.createElement('div');
		var ShowTime = document.createElement('span');
		var Reviews = document.createElement('div');
		var Time = new Date();
		var Hours = Time.getHours();
		var Minutes = Time.getMinutes();
		var Incriment = document.createElement('div');
		var CurrentInc = '1';
		var Flag = true;
		if (Minutes < 10) {
			Minutes = '0' + Minutes;
		}
		Comment.classList.add('Comment');
		Person.classList.add('Person');
		Like.classList.add('Like');
		Reviews.classList.add('Reviews');
		ShowTime.classList.add('Time');
		Incriment.classList.add('Incriment');
		Person.innerText = 'Rustam';
		Like.innerText = 'Нравится';
		Reviews.innerText = 'asdasdasdasd';
		Incriment.innerText = CurrentInc;
		ShowTime.innerText = Hours + ':' + Minutes;
		Person.append(Incriment);
		Person.append(Like);
		Person.append(ShowTime);
		AdditionalDescTextBlock.append(Comment);
		Comment.append(Person);
		Comment.append(Reviews);
		Person.addEventListener('click', (e) => {
			var target = e.target;
			if (target.classList.contains('Like')) {
				if (Flag) {
					Flag = false;
					Incriment.innerText = +Incriment.innerText + 1;
				} else {
					Incriment.innerText = CurrentInc;
					Flag = true;
				}
			}
		});
	}
}

ProductAdditionalInit.Desc();
ProductAdditionalInit.Desc();

ProductAdditionalDescBlock.on('click', (e) => {
	var target = $(e.target);
	ShowAdditionalDesc(target);
});

function ShowAdditionalDesc(target) {
	if (target.hasClass('AdditionalDesc__title')) {
		if (!target.hasClass('AdditionalDesc__title--active')) {
			target
				.addClass('AdditionalDesc__title--active')
				.siblings()
				.removeClass('AdditionalDesc__title--active');

			if (target.text() == 'Описание') {
				AdditionalDescTextBlock.css('display', 'flex');
				AdditionalDescTextBlock.empty();
				ProductAdditionalInit.Desc();
				ProductAdditionalInit.Desc();
			} else if (target.text() == 'Дополнительная информация') {
				AdditionalDescTextBlock.css('display', 'flex');
				AdditionalDescTextBlock.empty();
				ProductAdditionalInit.AddittionalDesc();
				ProductAdditionalInit.AddittionalDesc();
			} else {
				AdditionalDescTextBlock.css('display', 'block');
				AdditionalDescTextBlock.empty();

				for (var i = 0; i < AmountReviews; i++) {
					ProductAdditionalInit.reviews();
				}
			}
		}
	}
}
