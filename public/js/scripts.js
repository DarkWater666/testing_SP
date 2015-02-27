var autoScroll, parallax, preloaderOff, scrollToAnchor, start, timeLoad;

autoScroll = function(topoffset) {
  var scrollTop;
  if (topoffset == null) {
    topoffset = 20;
  }
  scrollTop = $(window).scrollTop() + topoffset;
  return $('.item').each(function(i) {
    var offset, target;
    offset = $(this).offset().top;
    if ((offset + 500) > scrollTop) {
      target = $(this).data('aim');
      scrollToAnchor(target);
      return false;
    }
  });
};

scrollToAnchor = function(target, speed, topoffset) {
  var animation, destination, height, tag;
  if (speed == null) {
    speed = 2000;
  }
  if (topoffset == null) {
    topoffset = 20;
  }
  height = $(window).height();
  if (height > 800) {
    topoffset = topoffset + 150;
  }
  animation = 'easeInOutExpo';
  tag = $("div[id='" + target + "']");
  destination = tag.offset().top - topoffset;
  $('#navigation').animate({
    marginTop: (topoffset + 20) + 'px'
  }, speed, animation);
  $("html,body").animate({
    scrollTop: destination
  }, speed, animation, function() {
    if (target !== 'default') {
      window.location.hash = target;
    }
    return setTimeout((function() {
      $('#navigation').stop(true);
      return $("html,body").stop(true);
    }), 2500);
  });
  return false;
};

parallax = function(elem, coeff) {
  var coords, yPos;
  if (coeff == null) {
    coeff = 1;
  }
  yPos = $(window).scrollTop() / elem.data('speed');
  coords = 'center ' + (coeff * yPos) + 'px';
  return elem.css('background-position', coords);
};

preloaderOff = function() {
  $('.fill').css('width', '310px');
  $('.bar').fadeOut('slow');
  $('.fill').fadeOut('slow');
  return $('#preloader').delay(500).fadeOut('slow');
};

start = new Date;

timeLoad = null;

$(window).load(function() {
  var change, width;
  $('.fill').css('width', 0 + 'px');
  timeLoad = new Date - start;
  width = null;
  change = Math.floor(timeLoad / 10);
  return window.setInterval((function() {
    width = width + change;
    if (width > 310) {
      preloaderOff();
      return false;
    } else {
      return $('.fill').css('width', width + 'px');
    }
  }), 30);
});

$(function() {
  var music, scrollTimeout, scrollbeginHandler, scrollendDelay, scrollendHandler, target;
  music = new Audio('../img/sound_1.mp3');
  music.play();
  target = window.location.hash.substring(1);
  scrollTimeout = null;
  scrollendDelay = 500;
  $('#navigation').animate({
    'opacity': 1
  }, 2000, function() {
    return $('#content').animate({
      'opacity': 1
    }, 1000);
  });
  scrollbeginHandler = function() {};
  scrollendHandler = function() {
    autoScroll();
    scrollTimeout = null;
  };
  if (!target || target === 'player') {
    scrollToAnchor('default', 1000, 20);
  }
  $('a.menu_item').click(function() {
    var audio;
    if ($(this).hasClass('player')) {
      audio = $(this).children('li#audio');
      if (audio.hasClass('off')) {
        music.play();
      } else {
        music.pause();
      }
      return audio.toggleClass('off');
    } else {
      target = $(this).data('link');
      return scrollToAnchor(target);
    }
  });
  $(window).scroll(function() {
    parallax($('.cloud'), 3);
    if (scrollTimeout === null) {
      scrollbeginHandler();
    } else {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(scrollendHandler, scrollendDelay);
    return false;
  });
  return $(window).resize(function() {
    target = window.location.hash.substring(1);
    if (!target) {
      target = 'default';
    }
    return scrollToAnchor(target, 1000, 20);
  });
});
