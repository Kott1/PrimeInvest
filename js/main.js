$(function() {

  const TIMER_DURATION = 15 * 60;
  const $timerDisplay = $('#countdown-timer');
  const $ctaButtons = $('.cta-btn-target');

  let timeLeft = sessionStorage.getItem('timer_left')
    ? parseInt(sessionStorage.getItem('timer_left'), 10)
    : TIMER_DURATION;

  function updateTimer() {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      $timerDisplay.text("00:00");
      $ctaButtons.text("Останній шанс");
      return;
    }

    timeLeft--;
    sessionStorage.setItem('timer_left', timeLeft);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');
    $timerDisplay.text(`${displayMinutes}:${displaySeconds}`);
  }

  const timerInterval = setInterval(updateTimer, 1000);
  updateTimer();


  const $stickyCta = $('#stickyCta');
  const $hero = $('.hero');

  $(window).on('scroll', function() {
    if ($(window).scrollTop() > $hero.outerHeight()) {
      $stickyCta.addClass('sticky-cta--visible');
    } else {
      $stickyCta.removeClass('sticky-cta--visible');
    }
  });


  const $track = $('#slider-track');
  const $slides = $track.children('.slider__slide');
  const $dotsContainer = $('#slider-dots');
  let currentIndex = 0;

  $slides.each(function(index) {
    const $dot = $('<div>').addClass('slider__dot');
    if (index === 0) $dot.addClass('slider__dot--active');

    $dot.on('click', function() {
      moveToSlide(index);
    });
    $dotsContainer.append($dot);
  });

  const $dots = $dotsContainer.children('.slider__dot');

  function moveToSlide(index) {
    if (index < 0) index = $slides.length - 1;
    if (index >= $slides.length) index = 0;

    $track.css('transform', `translateX(-${index * 100}%)`);
    $dots.removeClass('slider__dot--active').eq(index).addClass('slider__dot--active');
    currentIndex = index;
  }

  $('#slide-next').on('click', function() { moveToSlide(currentIndex + 1); });
  $('#slide-prev').on('click', function() { moveToSlide(currentIndex - 1); });

  let startX = 0;
  $track.on('touchstart', function(e) {
    startX = e.originalEvent.touches[0].clientX;
  });
  $track.on('touchend', function(e) {
    const endX = e.originalEvent.changedTouches[0].clientX;
    if (startX - endX > 50) moveToSlide(currentIndex + 1);
    if (endX - startX > 50) moveToSlide(currentIndex - 1);
  });


  $('.accordion__header').on('click', function() {
    const $currentCollapse = $(this).next('.accordion__collapse');
    const $currentItem = $(this).parent();

    $('.accordion__collapse').not($currentCollapse).slideUp(300)
      .parent().removeClass('accordion__item--active');

    $currentCollapse.slideToggle(300, function() {
      $currentItem.toggleClass('accordion__item--active', $(this).is(':visible'));
    });
  });


  const $form = $('#multistepForm');
  const $step1 = $('[data-step="1"]');
  const $step2 = $('[data-step="2"]');
  const $phoneInput = $('#userPhone');

  $phoneInput.on('input', function() {
    let matrix = "+380 (__) ___-__-__",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, "");
    if (def.length >= val.length) val = def;
    this.value = matrix.replace(/./g, function(a) {
      return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
    });
  });

  function toggleError($inputEl, $errorEl, isError) {
    $inputEl.toggleClass('form-group__input--error', isError);
    $errorEl.toggle(isError);
  }

  function validateStep1() {
    const $name = $('#userName');
    const $email = $('#userEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if ($name.val().trim().length < 2) {
      toggleError($name, $('#error-name'), true);
      isValid = false;
    } else {
      toggleError($name, $('#error-name'), false);
    }

    if (!emailRegex.test($email.val().trim())) {
      toggleError($email, $('#error-email'), true);
      isValid = false;
    } else {
      toggleError($email, $('#error-email'), false);
    }

    return isValid;
  }

  function validateStep2() {
    const $phone = $('#userPhone');
    const $agreement = $('#userAgreement');
    let isValid = true;

    if ($phone.val().replace(/\D/g, "").length < 12) {
      toggleError($phone, $('#error-phone'), true);
      isValid = false;
    } else {
      toggleError($phone, $('#error-phone'), false);
    }

    if (!$agreement.is(':checked')) {
      $('#error-agreement').show();
      isValid = false;
    } else {
      $('#error-agreement').hide();
    }

    return isValid;
  }

  $('#nextStepBtn').on('click', function() {
    if (validateStep1()) {
      $step1.removeClass('multistep-form__step--active');
      $step2.addClass('multistep-form__step--active');
    }
  });

  $('#prevStepBtn').on('click', function() {
    $step2.removeClass('multistep-form__step--active');
    $step1.addClass('multistep-form__step--active');
  });

  $form.on('submit', function(e) {
    e.preventDefault();

    if (validateStep2()) {
      const formData = {
        name: $('#userName').val(),
        email: $('#userEmail').val(),
        phone: $phoneInput.val()
      };

      console.log('Дані успішно відправлені через jQuery:', formData);

      $('#successModal').addClass('modal--open');
      $form[0].reset();
      $step2.removeClass('multistep-form__step--active');
      $step1.addClass('multistep-form__step--active');
    }
  });


  const $modal = $('#successModal');

  $('#closeModalBtn').on('click', function() {
    $modal.removeClass('modal--open');
  });

  $modal.on('click', function(e) {
    if ($(e.target).is($modal)) {
      $modal.removeClass('modal--open');
    }
  });
});