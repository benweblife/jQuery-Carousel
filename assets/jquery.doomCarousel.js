/**
* Doom Carousel
*
* A sliding carousel for images.
*
* @author Dumitru Glavan
* @version 1.0
* @requires jQuery v1.3.2 or later
*
* Examples and documentation at: https://github.com/doomhz/jQuery-Carousel
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/
;(function ($) {
	$.fn.doomCarousel = function (options) {
		this.config = {leftBtn:'.doom-carousel-left-btn',
					   rightBtn:'.doom-carousel-right-btn',
					   transitionType:'slide',
					   slideSpeed:'800',
					   easing:'swing',
					   autoSlide:true,
					   slideDuration:3000,
					   imgWidth:0,
					   showNav:true,
					   showCaption:true,
					   onLoad:null
					  };
		$.extend(this.config, options);

		var self = this;
		var $self = $(this);

		if (this.config.showNav) {
			this.leftBtn = $(this.config.leftBtn, $self).insertBefore($self);
			this.rightBtn = $(this.config.rightBtn, $self).insertAfter($self);
			this.leftBtn.click(function () {
				if (self.slideInterval) {clearInterval(self.slideInterval);}
				self.slideCarousel('left');
				self.setSlideInterval();
				return false;
			});

			this.rightBtn.click(function () {
				if (self.slideInterval) {clearInterval(self.slideInterval);}
				self.slideCarousel('right');
				self.setSlideInterval();
				return false;
			});
		} else {
			$(this.config.leftBtn, $self).remove();
			$(this.config.rightBtn, $self).remove();
		}

		this.imgList = $('ul:first', $self);

		var totalImages = $('img', $self);
		this.config.imgWidth = this.config.imgWidth || totalImages.width();
		this.imgList.width(totalImages.length * this.config.imgWidth);

		if (this.config.showCaption) {
			this.imgLinks = $('a', $self);
			this.imgLinks.each(function (index, el) {
				var title = $(el).attr('title').replace('{#', '<').replace('#}', '>').replace('!#', '"');
				$(el).attr('title', title.replace(/(<([^>]+)>)/ig,""));
				$('<div class="doom-pic-title">' + title + '</div>').appendTo(el);
			});
		}

		self.setSlideInterval();

		$.isFunction(this.config.onLoad) && this.config.onLoad(this);

		return this;
	},

	$.fn.slideCarousel = function (to) {
		var self = this;
		var $self = $(this);
		
		to = typeof(to) !== 'string' ? 'right' : to;
		to = to === 'left' ? '-' : '+';
		var moveSize = (self.imgList.width() === ($self.scrollLeft() + self.config.imgWidth)) ? 0 : self.config.imgWidth;

		switch (self.config.transitionType) {
			case 'slide':
				moveSize = moveSize ? to + '=' + moveSize : moveSize;
				$self.animate({'scrollLeft':moveSize}, self.config.slideSpeed, self.config.easing);
				break;
			case 'fade':
				moveSize = moveSize ? $self.scrollLeft() + ~~(+ (to + moveSize)) : moveSize;
				self.imgList.fadeTo(self.config.easing, 0, function () {$self.scrollLeft(moveSize);self.imgList.fadeTo(self.config.easing, 1)});
				break;
			default:
				moveSize = moveSize ? $self.scrollLeft() + ~~(+ (to + moveSize)) : moveSize;
				$self.scrollLeft(moveSize);
				break;
		}
	},

	$.fn.setSlideInterval = function () {
		if (this.config.autoSlide) {
			var self = this;
			self.slideInterval = setInterval(function () {self.slideCarousel('right');}, self.config.slideDuration);
		}
	}
})(jQuery);