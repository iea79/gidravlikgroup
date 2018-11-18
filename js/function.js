var TempApp = {
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device

$(document).ready(function() {

    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	if ('flex' in document.documentElement.style) {
		// Хак для UCBrowser
		if (navigator.userAgent.search(/UCBrowser/) > -1) {
			document.documentElement.setAttribute('data-browser', 'not-flex');
		} else {		
		    // Flexbox-совместимый браузер.
			document.documentElement.setAttribute('data-browser', 'flexible');
		}
	} else {
	    // Браузер без поддержки Flexbox, в том числе IE 9/10.
		document.documentElement.setAttribute('data-browser', 'not-flex');
	}

	// First screen full height
	function setHeiHeight() {
	    $('.full__height').css({
	        minHeight: $(window).height() + 'px'
	    });
	}
	setHeiHeight(); // устанавливаем высоту окна при первой загрузке страницы
	$(window).resize( setHeiHeight ); // обновляем при изменении размеров окна


	// Reset link whte attribute href="#"
	$('[href*="#"]').click(function(event) {
		event.preventDefault();
	});

	// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
	// $('#main__menu a[href^="#"]').click( function(){ 
	// 	var scroll_el = $(this).attr('href'); 
	// 	if ($(scroll_el).length != 0) {
	// 	$('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
	// 	}
	// 	return false;
	// });

	// Stiky menu // Липкое меню. При прокрутке к элементу #header добавляется класс .stiky который и стилизуем
    // $(document).ready(function(){

    // });
   	// setGridMatch($('[data-grid-match] .grid__item'));
   	gridMatch();
   	setTimeout(function() {
        if (!isXsWidth()) {
            $('#car').addClass('visibleAnim animated slideInRight')
        }
   	}, 1000);

    fontResize('body');
    repalceHeaderItem();
    // fontResize('.homeHead,.header');

    $('.header__toggle').on('click', function() {
        $('.header__mobile').toggleClass('open');
    });

    $('.slider').slick({
        
    })

    if ($('div').is('#map')) {
        ymaps.ready(init);
    }

    $('.sidebar__head').on('click', function(event) {
        event.preventDefault();
        var wrap = $(this).closest('.sidebar__item');
        $('.sidebar__item').not(wrap).removeClass('open');
        wrap.toggleClass('open');
    });

    $('.product__sm').on('click', function(event) {
        event.preventDefault();
        var id = $(this).data('product');
        $('.product__lg').removeClass('active');
        $('#'+id+'').addClass('active');
    });

    stiky();

});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

	checkOnResize()
});

function checkOnResize() {
   	// setGridMatch($('[data-grid-match] .grid__item'));
   	gridMatch();
    fontResize('body');
    repalceHeaderItem();
    // fontResize('.homeHead,.header');
}

function gridMatch() {
   	$('[data-grid-match] .grid__item').matchHeight({
   		byRow: true,
   	});
}

function stiky() {
    var Header = $('.header');
    var HeaderTop = Header.offset().top;
    var wrap = $('.wrapper');
    var HeaderStiky = $('.header').hasClass('stiky');
    
    $(window).scroll(function(){
        if( $(window).scrollTop() > HeaderTop ) {
            $('.header_gray').addClass('stiky');
            if (HeaderStiky) {
                wrap.css('paddingTop', $('.header').innerHeight());
            }
        } else {
            $('.header_gray').removeClass('stiky');
            if (HeaderStiky) {
                wrap.removeAttr('style');
            }
        }
    });
}

// function setGridMatch(columns) {
// 	var tallestcolumn = 0;
// 	columns.removeAttr('style');
// 	columns.each( function() {
// 		currentHeight = $(this).height();
// 		if(currentHeight > tallestcolumn) {
// 			tallestcolumn = currentHeight;
// 		}
// 	});
// 	setTimeout(function() {
// 		columns.css('minHeight', tallestcolumn);
// 	}, 100);
// }

function repalceHeaderItem() {
    var header = $('.header')
    var menu = $('.navbar');
    var mobMenu = $('.header__drop');
    var action = $('.header__action');
    if (!isXsWidth()) {
        menu.appendTo('.header__center');
        action.appendTo('.header__right');
    } else {
        action.prependTo(mobMenu);
        menu.prependTo(mobMenu);
    }
}

function fontResize(el) {
    var windowWidth = $(window).width();
    if (!isXsWidth()) {
    	var fontSize = windowWidth/19.05; // font-size 100% 1920x1080
    } else {
    	var fontSize = 60;
    }
	$(el).css('fontSize', fontSize + '%');
}


function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search',
        });

    myMap.behaviors.disable('scrollZoom');

    myMap.geoObjects
        .add(new ymaps.Placemark([55.961228068788635,37.53616699999996], {
            balloonContent: 'Россия, МО, городской округ Мытищи, деревня Грибки, ул. Складская, д. 5, павильон 28',
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'img/marker.png',
            iconImageSize: [24, 38],
            iconImageOffset: [-24, -24],
        }))
        .add(new ymaps.Placemark([55.57271429234571,37.6186468756714], {
            balloonContent: 'Россия, Москва, МКАД, 32-й километр, внешняя сторона, с1, АГМ «ТРАКТ», бокс 22'
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'img/marker.png',
            iconImageSize: [24, 38],
            iconImageOffset: [-24, -24],
        }));
}