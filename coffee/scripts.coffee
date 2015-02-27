autoScroll = (topoffset = 20) ->
  scrollTop = $(window).scrollTop() + topoffset
  $('.item').each (i) ->
    offset = $(this).offset().top
    if (offset+500) > scrollTop
      target = $(this).data('aim')
      scrollToAnchor target
      return false

scrollToAnchor = (target, speed = 2000, topoffset = 20) ->
  height = $(window).height()
  if height > 800
    topoffset = topoffset + 150
  animation = 'easeInOutExpo'
  tag = $("div[id='" + target + "']")
  destination = tag.offset().top - topoffset
  $('#navigation').animate { marginTop: (topoffset+20) + 'px' }, speed, animation
  $("html,body").animate { scrollTop: destination }, speed, animation, ->
    if target != 'default'
      window.location.hash = target
    setTimeout (->
      $('#navigation').stop(true)
      $("html,body").stop(true)
    ), 2500
  return false

parallax = (elem, coeff = 1) ->
  yPos = ($(window).scrollTop() / elem.data('speed'))
  coords = 'center ' + (coeff * yPos) + 'px'
  elem.css('background-position', coords)

preloaderOff = ->
  $('.fill').css('width', '310px')
  $('.bar').fadeOut 'slow'
  $('.fill').fadeOut 'slow'
  $('#preloader').delay(500).fadeOut 'slow'

start = new Date
timeLoad = null
$(window).load ->
  $('.fill').css('width', 0 + 'px')
  timeLoad = (new Date - start)
  width = null
  change = Math.floor(timeLoad/10)
  window.setInterval (->
    width = width + change
    if width > 310
      preloaderOff()
      return false
    else
      $('.fill').css('width', width + 'px')
  ), 30

$ ->
  music = new Audio('../img/sound_1.mp3')
  music.play()
  target = window.location.hash.substring(1)
  scrollTimeout = null
  scrollendDelay = 500

  $('#navigation').animate {'opacity': 1}, 2000, ->
    $('#content').animate {'opacity': 1}, 1000

  scrollbeginHandler = ->
    return

  scrollendHandler = ->
    autoScroll()
    scrollTimeout = null
    return

  if !target || target == 'player'
    scrollToAnchor 'default', 1000, 20

  $('a.menu_item').click ->
    if $(this).hasClass('player')
      audio = $(this).children('li#audio')
      if audio.hasClass('off')
        music.play()
      else
        music.pause()
      audio.toggleClass('off')
    else
      target = $(this).data('link')
      scrollToAnchor target


  $(window).scroll ->
    parallax $('.cloud'), 3
    if scrollTimeout == null
      scrollbeginHandler()
    else
      clearTimeout scrollTimeout
    scrollTimeout = setTimeout(scrollendHandler, scrollendDelay)
    return false

  $(window).resize ->
    target = window.location.hash.substring(1)
    if !target
      target = 'default'
    scrollToAnchor target, 1000, 20
