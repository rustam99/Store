$(document).ready(function () {
	// Фильтры
	var Catalogfilter = $('.Catalog__filter');
	var FilterList = $('.Filter__list');
	var FilterText = $('.Filter__text');
	var FilterFlags = {
		PriceFlag: true,
		BrandFlag: true,
		CupBrandFlag: true,
		CupQuantityFlag: true,
		RamQuantityFlag: true,
		VideoTypeFlag: true,
		HardSizeFlag: true,
		SSDHardSizeFlag: true,
		DVDFlag: true
	}
	var params = {
		price: {
			from: '',
			to: '',
			range: ''
		},
		brand: [],
		CupBrand: [],
		CupQuantity: [],
		RamQuantity: [],
		VideoType: [],
		HardSize: [],
		SSDHardSize: [],
		DVD: []
	}
	var Filters = {
		price: (target, index) => {
			var PriceSettings = $('.PriceSettings');
			var PriceRange = $('.PriceRange');
			var PriceCircle = $('.PriceCircle');
			var maxPrice = $('.maxPrice');
			var currentPrice = $('.currentPrice');
			if (FilterFlags.PriceFlag) {
				FilterFlags.PriceFlag = false;
				PriceSettings.slideDown(300, () => {
					PriceSettings.css('display', 'flex');
				});
				PriceRange.slideDown(300);
			} else {
				PriceSettings.slideUp(300, () => {
					FilterText.eq(index).removeClass('Filter__text--active');
					FilterFlags.PriceFlag = true;
				});
				PriceRange.slideUp(300);
			}

			PriceSettings.on('input', (e) => {
				var target = $(e.target);
				target.val(target.val().replace(/\D/, ''));
				if (target.closest('div').hasClass('PriceFrom')) {
					params.price.from = target.val();;
				} else if (target.closest('div').hasClass('PriceTo')) {
					params.price.to = target.val();
				}
			});

			var maxPriceValue = parseInt(maxPrice.text());
			var currentPriceValue = parseInt(currentPrice.text());
			currentPrice.text(Math.round(maxPriceValue / 200) + 'р');

			PriceRange.on('mousedown', (e) => {
				movePrice(e);
				$(document).on('mousemove', movePrice);
			});

			function movePrice(e) {
				var offset = PriceRange.offset();
				var x = e.pageX - offset.left;

				if (x >= 200) {
					PriceCircle.css('left', '196px');
					currentPriceValue = maxPriceValue;
					currentPrice.text(Math.round(maxPriceValue) + 'р');
				} else if (x <= 0) {
					PriceCircle.css('left', '0');
					currentPriceValue = Math.round(maxPriceValue / 200);
					currentPrice.text(Math.round(maxPriceValue / 200) + 'р');
				} else {
					PriceCircle.css('left', x + 'px');
					currentPriceValue = x * Math.round(maxPriceValue / 200);
					currentPrice.text(Math.round(currentPriceValue) + 'р');
				}

				params.price.range = currentPriceValue;
			}

			$(document).on('mouseup', function () {
				$(this).off('mousemove', movePrice);
			});
		},
		brand: (target, index) => {
			var BrandList = $('.BrandList');
			var BrandListHide = $('.BrandList--hide');
			var showAllListText = $('.ShowAllBrands');
			var ChooseAllBrands = $('.js--ChooseAll');
			if (FilterFlags.BrandFlag) {
				FilterFlags.BrandFlag = false;
				BrandList.slideDown(300);
				showAllListText.slideDown(300, () => {
					showAllListText.removeAttr('style');
					showAllListText.removeClass('ShowAllBrands--hide');
				});
			} else {
				BrandList.slideUp(300, () => {
					BrandList.removeAttr('style');
					FilterText.eq(index).removeClass('Filter__text--active');
					FilterFlags.BrandFlag = true;
				});
				BrandListHide.slideUp(300, () => {
					BrandListHide.removeAttr('style');
				});
				showAllListText.slideUp(300, () => {
					showAllListText
						.removeAttr('style')
						.text('Показать все')
						.addClass('ShowAllBrands--hide');
				});
			}

			showAllListText.on('click', () => {
				if (showAllListText.text() == 'Показать все') {
					BrandListHide.slideDown(300, () => {
						showAllListText.text('Свернуть');
					});
				} else {
					BrandListHide.slideUp(300, () => {
						BrandListHide.removeAttr('style');
						showAllListText.text('Показать все');
					});
				}
			});

			ChooseAllBrands.on('click', function () {
				var $this = $(this);
				var container = $this.closest('ul');
				if ($this.find('.BrandCheckbox--first').prop('checked')) {
					$this
						.find('.CustomCheckbox--first')
						.addClass('CustomCheckbox--active');
					$this
						.closest('ul')
						.find('.CustomCheckbox')
						.addClass('CustomCheckbox--active');
					$this
						.closest('ul')
						.find('.BrandCheckbox')
						.prop('checked', true);
					$this
						.closest('.Filter__item')
						.find('.BrandList--hide')
						.children()
						.find('.CustomCheckbox')
						.addClass('CustomCheckbox--active');
					$this
						.closest('.Filter__item')
						.find('.BrandList--hide')
						.children()
						.find('.BrandCheckbox')
						.prop('checked', true);
					for (var i = 1; i < container.children().length; i++) {
						params.brand.push(container
							.children()[i]
							.children[0]
							.children[2]
							.innerText);
					}
					for (var i = 0; i < container.next().children().length; i++) {
						params.brand.push(container
							.next()
							.children()[i]
							.children[0]
							.children[2]
							.innerText
						);
					}
				} else {
					$this
						.find('.CustomCheckbox--first')
						.removeClass('CustomCheckbox--active');
					$this
						.closest('ul')
						.find('.CustomCheckbox')
						.removeClass('CustomCheckbox--active');
					$this
						.closest('ul')
						.find('.BrandCheckbox')
						.prop('checked', false);
					$this
						.closest('.Filter__item')
						.find('.BrandList--hide')
						.children()
						.find('.CustomCheckbox')
						.removeClass('CustomCheckbox--active');
					$this
						.closest('.Filter__item')
						.find('.BrandList--hide')
						.children()
						.find('.BrandCheckbox')
						.prop('checked', false);
					params.brand.length = 0;
				}
			});

			BrandList.on('click', (e) => {
				var target = $(e.target);
				chooseCheckbox(target);
			});

			BrandListHide.on('click', (e) => {
				var target = $(e.target);
				chooseCheckbox(target);
			});

			function chooseCheckbox(target) {
				if (target.hasClass('BrandName') || target.hasClass('CustomCheckbox')) {
					if (!target
						.closest('label')
						.find('.CustomCheckbox')
						.hasClass('CustomCheckbox--active')) {
						target
							.closest('label')
							.find('.CustomCheckbox')
							.addClass('CustomCheckbox--active');
					} else {
						if (target
							.closest('.Filter__item')
							.find('.BrandCheckbox--first')
							.prop('checked')) {
							target
								.closest('.Filter__item')
								.find('.BrandCheckbox--first')
								.prop('checked', false)
								.next()
								.removeClass('CustomCheckbox--active');
						}
						target
							.closest('label')
							.find('.CustomCheckbox')
							.removeClass('CustomCheckbox--active');
					}
				}
				initParams(target, params.brand);
			}
		},
		CupBrand: (target, index) => {
			var CupBrandList = $('.CupBrandList');
			if (FilterFlags.CupBrandFlag) {
				FilterFlags.CupBrandFlag = false;
				CupBrandList.slideDown(300);
			} else {
				CupBrandList.slideUp(300);
				FilterText.eq(index).removeClass('Filter__text--active');
				setTimeout(() => {
					FilterFlags.CupBrandFlag = true;
				}, 300);
			}

			CupBrandList.on('click', (e) => {
				var target = $(e.target);
				initParams(target, params.CupBrand);
			});
		},
		CupQuantity: (target, index) => {
			var CupQuantityList = $('.CupQuantityList');
			if (FilterFlags.CupQuantityFlag) {
				FilterFlags.CupQuantityFlag = false;
				CupQuantityList.slideDown(300);
			} else {
				CupQuantityList.slideUp(300, () => {
					FilterText.eq(index).removeClass('Filter__text--active');
					FilterFlags.CupQuantityFlag = true;
				});
			}

			CupQuantityList.on('click', (e) => {
				var target = $(e.target);
				initParams(target, params.CupQuantity);
			});
		},
		RamQuantity: (target, index) => {
			var RamQuantityList = $('.RamQuantityList');
			if (FilterFlags.RamQuantityFlag) {
				FilterFlags.RamQuantityFlag = false;
				RamQuantityList.slideDown(300);
			} else {
				RamQuantityList.slideUp(300, () => {
					FilterText.eq(index).removeClass('Filter__text--active');
					FilterFlags.RamQuantityFlag = true;
				});
			}

			RamQuantityList.on('click', (e) => {
				var target = $(e.target);
				initParams(target, params.RamQuantity);
			});
		},
		VideoType: (target, index) => {
			var VideoTypeList = $('.VideoTypeList');
			if (FilterFlags.VideoTypeFlag) {
				FilterFlags.VideoTypeFlag = false;
				VideoTypeList.slideDown(300);
			} else {
				VideoTypeList.slideUp(300, () => {
					FilterText.eq(index).removeClass('Filter__text--active');
					FilterFlags.VideoTypeFlag = true;
				});
			}

			VideoTypeList.on('click', (e) => {
				var target = $(e.target);
				initParams(target, params.VideoType);
			});
		},
		HardSize: (target, index) => {
			var HardSizeList = $('.HardSizeList');
			if (FilterFlags.HardSizeFlag) {
				FilterFlags.HardSizeFlag = false;
				HardSizeList.slideDown(300);
			} else {
				HardSizeList.slideUp(300, () => {
					FilterText.eq(index).removeClass('Filter__text--active');
					FilterFlags.HardSizeFlag = true;
				});
			}

			HardSizeList.on('click', (e) => {
				var target = $(e.target);
				initParams(target, params.HardSize);
			});
		},
		SSDHardSize: (target, index) => {
			var SSDHardSizeList = $('.SSDHardSizeList');
			if (FilterFlags.SSDHardSizeFlag) {
				FilterFlags.SSDHardSizeFlag = false;
				SSDHardSizeList.slideDown(300);
			} else {
				SSDHardSizeList.slideUp(300, () => {
					FilterText.eq(index).removeClass('Filter__text--active');
					FilterFlags.SSDHardSizeFlag = true;
				});
			}

			SSDHardSizeList.on('click', (e) => {
				var target = $(e.target);
				initParams(target, params.SSDHardSize);
			});
		},
		DVD: (target, index) => {
			var DVDList = $('.DVDList');
			if (FilterFlags.DVDFlag) {
				FilterFlags.DVDFlag = false;
				DVDList.slideDown(300);
			} else {
				DVDList.slideUp(300, () => {
					FilterText.eq(index).removeClass('Filter__text--active');
					FilterFlags.DVDFlag = true;
				});
			}

			DVDList.on('click', (e) => {
				var target = $(e.target);
				initParams(target, params.DVD);
			});
		}
	}

	function initParams(target, arr) {
		var brandName = target
			.closest('label')
			.find('.BrandName')
			.text();
		if (target.hasClass('BrandCheckbox')) {
			if (target[0].checked) {
				arr.push(brandName);
			} else {
				var index = arr.indexOf(brandName);
				arr.splice(index, 1);
			}
		}
	}
	var CatalogFlag = true;

	Catalogfilter.on('click', (e) => {
		var target = $(e.target);
		if (target.hasClass('Catalog__filter') ||
			target.hasClass('Fitler__img') ||
			target.hasClass('Catalog__filter__text')) {
			if (CatalogFlag) {
				CatalogFlag = false;
				FilterList.slideDown(300);
			} else {
				FilterList.slideUp(300);
				CatalogFlag = true;
			}
		}
	});

	FilterList.on('click', (e) => {
		var target = $(e.target);
		var Text = target
			.closest('li')
			.find('span')
			.attr('data-filter');
		var index = FilterText.index(target.closest('li').find('.Filter__text'));
		if (target.hasClass('Filter__text') || target.prop('tagName') == 'SPAN') {
			FilterText.eq(index).addClass('Filter__text--active');
			Filters[Text](target, index);
		}
		if (target.hasClass('SearchBtn') || target.hasClass('SearchBtn__text')) {
			if (params.price.from == '' &&
				params.price.to == '' &&
				params.price.range == '' &&
				params.brand.length == 0 &&
				params.VideoType.length == 0 &&
				params.SSDHardSize.length == 0 &&
				params.RamQuantity.length == 0 &&
				params.HardSize.length == 0 &&
				params.DVD.length == 0 &&
				params.CupQuantity.length == 0 &&
				params.CupBrand.length == 0) {
				return;
			}
			var request = JSON.stringify(params);
			$.ajax({
				method: 'POST',
				url: 'check.php',
				contentType: "application/json",
				data: { params: request },
				success: function (data) {
					console.log(data);
				}
			});
		}
	});

	// Сортиовка
	var Sort = $('.Sort');
	var SortList = $('.Sort__list');
	var SortFlag = true;
	Sort.on('click', (e) => {
		var target = $(e.target);
		if (SortFlag) {
			SortFlag = false;
			SortList.slideDown(300);
		} else {
			var Text = target.closest('li').find('span').text();
			switch (Text) {
				case 'По новинкам':
					Text = 'news';
					break;
				case 'По популярности':
					Text = 'popularity';
					break;
				case 'По возрастающей цене':
					Text = 'risingPrice';
					break;
				case 'По понижающей цене':
					Text = 'loweringPrice';
					break;
			}
			if (Text != '') {
				$.ajax({
					method: 'POST',
					url: 'check.php',
					data: { sort: Text },
					success: function (data) {
						console.log(data);
					}
				});
			}
			SortList.slideUp(300, () => {
				SortFlag = true;
			});
		}
	});
});
