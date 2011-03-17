/**
* Doom Carousel
*
* A sliding carousel NOT only for images. :)
*
* @author Dumitru Glavan
* @link http://dumitruglavan.com
* @version 1.2
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
		this.config = {leftBtn:'a.doom-carousel-left-btn',
					   rightBtn:'a.doom-carousel-right-btn',
					   itemList:'ul.doom-carousel-list',
					   itemListCnt: 'div.doom-carousel-cnt',
					   numItemsToShow:1,
					   transitionType:'slide',
					   slideSpeed:'800',
					   easing:'swing',
					   autoSlide:true,
					   slideDuration:3000,
					   itemWidth:0, // Deprecated
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

		var totalItems = $('li', $self);
		this.config.itemWidth = this.config.itemWidth || totalItems.width();
		this.itemList.width(totalItems.length * this.config.itemWidth);

		this.config.numItemsToShow = this.config.numItemsToShow || this.itemListCnt.width() / this.config.itemWidth;

		if (this.config.showCaption) {
			this.itemLinks = $('a', self.itemListCnt);
			this.itemLinks.each(function (index, el) {
				var title = $(el).attr('title').replace('{#', '<').replace('#}', '>').replace('!#', '"');
				$(el).attr('title', title.replace(/(<([^>]+)>)/ig,""));
				$('<div class="doom-pic-title">' + title + '</div>').appendTo(el);
			});
		}

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

		return this;
	},

	$.fn.slideCarousel = function (to) {
		var self = this;
		var $itemListCnt = self.itemListCnt;
		
		to = typeof(to) !== 'string' ? 'right' : to;
		to = to === 'left' ? '-' : '+';
		var moveSize = (self.itemList.width() === ($itemListCnt.scrollLeft() + (self.config.itemWidth * self.config.numItemsToShow))) ? 0 : self.config.itemWidth;

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