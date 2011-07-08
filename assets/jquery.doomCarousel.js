/**
* Doom Carousel
*
* A sliding carousel NOT only for images. :)
* Also works for multiple carousels on the same page $('.doom-carousel').doomCarousel();
*
* @author Dumitru Glavan
* @link http://dumitruglavan.com
* @version 1.3
* @requires jQuery v1.3.2 or later
*
* Examples and documentation at: http://dumitruglavan.com/jquery-doom-carousel-plugin/
* Official jQuery plugin page: http://plugins.jquery.com/project/doom-carousel
* Find source on GitHub: https://github.com/doomhz/jQuery-Carousel
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/
;(function ($) {
	$.fn.doomCarousel = function (options) {

		// Check if multiple elements and assign a carousel for everyone
		if ($(this).length > 1) {
			$(this).each(function (i, el) {
				$(el).doomCarousel(options);
			});
			return this;
		}

		this.config = {leftBtn:'a.doom-carousel-left-btn',
					   rightBtn:'a.doom-carousel-right-btn',
					   itemList:'ul.doom-carousel-list',
					   itemListCnt: 'div.doom-carousel-cnt',
					   itemStepper: 'div.doom-carousel-stepper',
					   transitionType:'slide',
					   slideSpeed:'800',
					   easing:'swing',
					   autoSlide:true,
					   slideDuration:3000,
					   itemWidth:0,
					   itemsToScroll:1,
					   showNav:true,
					   showCaption:true,
					   stopOnHover:true,
					   onLoad:null
					  };
		$.extend(this.config, options);

		var self = this;
		var $self = $(this);

		if (this.config.showNav) {
			this.leftBtn = $(this.config.leftBtn + ':first', $self);
			this.rightBtn = $(this.config.rightBtn + ':first', $self);
			this.leftBtn.click(function () {
				self.slideCarousel('left');
				return false;
			});

			this.rightBtn.click(function () {
				self.slideCarousel('right');
				return false;
			});
		} else {
			$(this.config.leftBtn, $self).remove();
			$(this.config.rightBtn, $self).remove();
		}
		
		this.itemListCnt = $(this.config.itemListCnt + ':first', $self);
		this.itemList = $(this.config.itemList + ':first', $self);
		this.itemStepper = $(this.config.itemStepper + ':first');

		this.totalItems = $('li', $self);
		this.config.itemWidth = this.config.itemWidth || this.totalItems.width();
		this.itemList.width(this.totalItems.length * this.config.itemWidth);

		if (this.config.showCaption) {
			this.itemLinks = $('a', self.itemListCnt);
			this.itemLinks.each(function (index, el) {
				var title = $(el).attr('title').replace('{#', '<').replace('#}', '>').replace('!#', '"');
				$(el).attr('title', title.replace(/(<([^>]+)>)/ig,""));
				$('<div class="doom-pic-title">' + title + '</div>').appendTo(el);
			});
		}
		
		// Contruct stepper
		this.itemStepper.html('<ul />');
		this.totalItems.each(function () {
			self.itemStepper.children('ul').append('<li>&nbsp;</li>');
		});
		$('ul li:first', this.itemStepper).addClass('on');

		this.itemListCnt.scrollLeft(0);

		self.setSlideInterval();

		$.isFunction(this.config.onLoad) && this.config.onLoad(this);

		if (this.config.autoSlide && this.config.stopOnHover) {
			$(this).mouseover(function () {
				self.clearSlideInterval();
			}).mouseout(function () {
				self.setSlideInterval();
			});
		}
		
		$('li', this.itemStepper).click(function () {
			var $this = $(this);
			self.clearSlideInterval();
			self.jumpToSlide($this.index());
		});

		return this;
	},

	$.fn.slideCarousel = function (to) {
		var self = this;
		var $itemListCnt = self.itemListCnt;
		var moveSize = (self.itemList.width() === ($itemListCnt.scrollLeft() + self.config.itemWidth * self.config.itemsToScroll)) ? 0 : self.config.itemWidth * self.config.itemsToScroll;
		
		self.transition(to, moveSize);
	},
	
	$.fn.jumpToSlide = function (index) {
		var self = this;
		var $itemListCnt = self.itemListCnt;
		var moveSize = (self.itemList.width() === ($itemListCnt.scrollLeft() + self.config.itemWidth * self.config.itemsToScroll)) ? 0 : $itemListCnt.scrollLeft() - self.config.itemWidth * self.config.itemsToScroll * index;
		var to = moveSize < 0 ? 'right' : 'left';
		
		self.transition(to, Math.abs(moveSize));
		self.setSlideInterval();
	},
	
	$.fn.transition = function (to, moveSize) {
		var self = this; 
		var $itemListCnt = self.itemListCnt;
		var $itemStepper = self.itemStepper;

		to = typeof(to) !== 'string' ? 'right' : to;
		to = to === 'left' ? '-' : '+';

		var indexStep = moveSize == 0 ? 0 : ($itemListCnt.scrollLeft() + (to == '-' ? -moveSize : +moveSize)) / self.totalItems.width();
		$('ul li', $itemStepper).removeClass();
		$('ul li:eq('+indexStep+')', $itemStepper).addClass('on');
		
		switch (self.config.transitionType) {
			case 'slide':
				moveSize = moveSize ? to + '=' + moveSize : moveSize;
				$itemListCnt.animate({'scrollLeft':moveSize}, self.config.slideSpeed, self.config.easing);
				break;
			case 'fade':
				moveSize = moveSize ? $itemListCnt.scrollLeft() + ~~(+ (to + moveSize)) : moveSize;
				self.itemList.fadeTo(self.config.easing, 0, function () {$itemListCnt.scrollLeft(moveSize);self.itemList.fadeTo(self.config.easing, 1)});
				break;
			default:
				moveSize = moveSize ? $itemListCnt.scrollLeft() + ~~(+ (to + moveSize)) : moveSize;
				$itemListCnt.scrollLeft(moveSize);
				break;
		}
	},

	$.fn.setSlideInterval = function () {
		if (this.config.autoSlide) {
			var self = this;
			self.slideInterval = setInterval(function () {self.slideCarousel('right');}, self.config.slideDuration);
			return self.slideInterval;
		}
		return false;
	},

	$.fn.clearSlideInterval= function () {
		if (this.slideInterval) {
			var intId = this.slideInterval;
			return clearInterval(intId);
		}
		return false;
	}
})(jQuery);