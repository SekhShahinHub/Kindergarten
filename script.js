(function(){
  "use strict";

  /* ---------- Loader Management ---------- */
  var loaderOverlay = document.getElementById('loaderOverlay');
  
  // Hide loader when page is fully loaded
  window.addEventListener('load', function(){
    if(loaderOverlay){
      setTimeout(function(){
        loaderOverlay.classList.add('hidden');
      }, 800);
    }
  });

  // Public API for manual loader control
  window.loaderAPI = {
    show: function(){
      if(loaderOverlay){
        loaderOverlay.classList.remove('hidden');
      }
    },
    hide: function(){
      if(loaderOverlay){
        loaderOverlay.classList.add('hidden');
      }
    }
  };

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  var onScroll = function(){
    if(window.scrollY > 12){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  };
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();



  /* ---------- Mobile nav ---------- */
  var burgerBtn = document.getElementById('burgerBtn');
  var closeBurger = document.getElementById('closeBurger');
  var mobileNav = document.getElementById('mobileNav');

  function openNav(){
    mobileNav.classList.add('open');
    burgerBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav(){
    mobileNav.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  burgerBtn.addEventListener('click', openNav);
  closeBurger.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeNav);
  });

  /* ---------- Scroll reveal (fade-up) ---------- */
  var revealEls = document.querySelectorAll('[data-aos]');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry, i){
        if(entry.isIntersecting){
          var el = entry.target;
          setTimeout(function(){ el.classList.add('aos-in'); }, (i % 4) * 90);
          io.unobserve(el);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('aos-in'); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('.stat-number');
  function animateCounter(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600;
    var startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + (progress >= 1 ? '+' : '');
      if(progress < 1){ requestAnimationFrame(step); }
      else{ el.textContent = target.toLocaleString() + '+'; }
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window && counters.length){
    var counterIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold:0.6 });
    counters.forEach(function(el){ counterIO.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Testimonial carousel ---------- */
  var track = document.getElementById('testTrack');
  var dotsWrap = document.getElementById('testDots');
  var prevBtn = document.getElementById('testPrev');
  var nextBtn = document.getElementById('testNext');
  if(track && dotsWrap){
    var cards = track.children.length;
    function perView(){
      var w = window.innerWidth;
      if(w <= 680) return 1;
      if(w <= 980) return 2;
      return 3;
    }
    var index = 0;
    var startX = 0;
    var dragX = 0;
    var isDragging = false;

    function pages(){ return Math.max(1, cards - perView() + 1); }

    function getTrackStep(){
      var firstCard = track.children[0];
      var cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.gap || style.columnGap || 26) || 26;
      return cardWidth + gap;
    }

    function renderDots(){
      dotsWrap.innerHTML = '';
      var total = pages();
      for(var i=0;i<total;i++){
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
        if(i === index) b.classList.add('active');
        (function(idx){
          b.addEventListener('click', function(){ goTo(idx); });
        })(i);
        dotsWrap.appendChild(b);
      }
    }

    function goTo(i){
      var total = pages();
      index = Math.max(0, Math.min(i, total - 1));
      track.style.transform = 'translateX(-' + (index * getTrackStep()) + 'px)';
      Array.prototype.forEach.call(dotsWrap.children, function(dot, di){
        dot.classList.toggle('active', di === index);
      });
    }

    renderDots();
    goTo(0);

    if(prevBtn){
      prevBtn.addEventListener('click', function(){
        goTo(index - 1);
      });
    }
    if(nextBtn){
      nextBtn.addEventListener('click', function(){
        goTo(index + 1);
      });
    }

    track.addEventListener('pointerdown', function(event){
      isDragging = true;
      startX = event.clientX;
      dragX = 0;
      track.setPointerCapture && track.setPointerCapture(event.pointerId);
    });

    track.addEventListener('pointermove', function(event){
      if(!isDragging) return;
      dragX = event.clientX - startX;
    });

    track.addEventListener('pointerup', function(event){
      if(!isDragging) return;
      isDragging = false;
      if(Math.abs(dragX) > 50){
        goTo(dragX < 0 ? index + 1 : index - 1);
      }
    });

    track.addEventListener('pointerleave', function(){
      if(!isDragging) return;
      isDragging = false;
      if(Math.abs(dragX) > 50){
        goTo(dragX < 0 ? index + 1 : index - 1);
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        index = 0;
        renderDots();
        goTo(0);
      }, 150);
    });

    var autoplay = setInterval(function(){
      var total = pages();
      goTo((index + 1) % total);
    }, 2000);

    var testimonialsSection = track.closest('.testimonials');
    testimonialsSection.addEventListener('mouseenter', function(){ clearInterval(autoplay); });
    testimonialsSection.addEventListener('mouseleave', function(){
      clearInterval(autoplay);
      autoplay = setInterval(function(){
        var total = pages();
        goTo((index + 1) % total);
      }, 2000);
    });
  }

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function(){ ripple.remove(); }, 650);
    });
  });

  /* ---------- Video play button ---------- */
  var playBtn = document.querySelector('.play-btn');
  var pauseBtn = document.querySelector('.video-pause-btn');
  var videoFrame = document.querySelector('.video-feature__embed iframe');
  if(playBtn && pauseBtn && videoFrame){
    var player;
    var playerReady = false;
    var isVideoPlaying = false;
    var playerId = videoFrame.id || 'videoFrame';
    videoFrame.id = playerId;

    function updateVideoButtons(){
      if(isVideoPlaying){
        playBtn.classList.add('is-hidden');
        pauseBtn.classList.add('is-visible');
      } else {
        playBtn.classList.remove('is-hidden');
        pauseBtn.classList.remove('is-visible');
      }
    }

    function createPlayer(){
      if(!window.YT || !window.YT.Player){ return; }
      player = new window.YT.Player(playerId, {
        events: {
          onReady: function(){
            playerReady = true;
          },
          onStateChange: function(event){
            isVideoPlaying = event.data === window.YT.PlayerState.PLAYING;
            updateVideoButtons();
          }
        }
      });
    }

    if(!window.YT){
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else if(window.YT.Player){
      createPlayer();
    }

    playBtn.addEventListener('click', function(e){
      e.preventDefault();
      playBtn.style.transform = 'translate(-50%,-50%) scale(0.9)';
      setTimeout(function(){ playBtn.style.transform = ''; }, 200);

      if(playerReady && player && typeof player.playVideo === 'function'){
        if(isVideoPlaying){
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      } else {
        var src = videoFrame.getAttribute('src');
        if(src && src.indexOf('autoplay=1') === -1){
          videoFrame.setAttribute('src', src + (src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1');
        }
        isVideoPlaying = true;
        updateVideoButtons();
      }
    });

    pauseBtn.addEventListener('click', function(e){
      e.preventDefault();
      if(playerReady && player && typeof player.pauseVideo === 'function'){
        player.pauseVideo();
      }
    });
  }

  /* ---------- Nav active link on scroll ---------- */
  var sections = ['top','about','programs','admissions','blog'];
  var navLinks = document.querySelectorAll('.nav-links a');
  var isHomePage = window.location.pathname.indexOf('about.html') === -1;

  if(isHomePage && 'IntersectionObserver' in window){
    var navIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.id;
          navLinks.forEach(function(a){
            var href = a.getAttribute('href');
            if(href === '#' + id || href === 'index.html#' + id){
              a.classList.add('active');
            } else if(href !== 'about.html') {
              a.classList.remove('active');
            }
          });
        }
      });
    }, { threshold:0.4 });
    sections.forEach(function(id){
      var el = document.getElementById(id);
      if(el) navIO.observe(el);
    });
  }

})();

const toggleSearch = (search, button) =>{
   const searchBar = document.getElementById(search);
   const searchButton = document.getElementById(button);
   const searchInput = searchBar ? searchBar.querySelector('.search__input') : null;

   if (!searchBar || !searchButton || !searchInput) return;

   searchButton.addEventListener('click', (event) => {
     event.preventDefault();
     const isOpen = searchBar.classList.toggle('show-search');
     if (isOpen) {
       searchInput.focus();
     } else {
       searchInput.blur();
     }
   });

   searchBar.addEventListener('submit', (event) => {
     if (!searchInput.value.trim()) {
       event.preventDefault();
       searchBar.classList.add('show-search');
       searchInput.focus();
     }
   });
}
toggleSearch('search-bar', 'search-button')


// Site wide cursor
const cursor = document.querySelector('[data-cursor]');

if (cursor) {
  const prefersFinePointer = window.matchMedia('(pointer: fine)');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let activeEl = null;

  function showCursor() {
    if (!prefersFinePointer.matches) return;
    cursor.style.opacity = '1';
    cursor.style.visibility = 'visible';
  }

  function hideCursor() {
    cursor.style.opacity = '0';
    cursor.style.visibility = 'hidden';
  }

  function moveCursor() {
    if (!prefersFinePointer.matches) {
      hideCursor();
      return;
    }

    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    if (activeEl) {
      const rect = activeEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      cursorX += (centerX - cursorX) * 0.08;
      cursorY += (centerY - cursorY) * 0.08;
    }

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(moveCursor);
  }

  function updatePointerPosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    showCursor();
  }

  window.addEventListener('pointermove', updatePointerPosition);
  window.addEventListener('pointerleave', hideCursor);
  window.addEventListener('blur', hideCursor);
  window.addEventListener('touchstart', hideCursor, { passive: true });

  document.querySelectorAll('a, button, .btn, .burger, .search__button, .icon-btn').forEach(function(el){
    el.addEventListener('mouseenter', function(){
      cursor.classList.add('is-hovering');
      activeEl = el;
    });
    el.addEventListener('mouseleave', function(){
      cursor.classList.remove('is-hovering');
      activeEl = null;
    });
    el.addEventListener('mousedown', function(){
      cursor.classList.add('is-clicking');
    });
    el.addEventListener('mouseup', function(){
      cursor.classList.remove('is-clicking');
    });
  });

  moveCursor();
}


const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/* ---------- About Us Page Interactive Features ---------- */
document.addEventListener('DOMContentLoaded', function() {
  
  /* 1. Facility Gallery Filter Tabs */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterTabs.length && galleryItems.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /* 2. Lightbox Modal Preview */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const viewImgBtns = document.querySelectorAll('.view-img-btn');

  if (lightboxModal && lightboxImg && viewImgBtns.length) {
    viewImgBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const src = this.getAttribute('data-src');
        const title = this.getAttribute('data-title');
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', function(e) {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  /* 3. FAQ Accordion Toggle */
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  if (faqTriggers.length) {
    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const item = this.parentElement;
        const isActive = item.classList.contains('active');

        // Close other items
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* 4. Campus Tour Schedule Modal */
  const tourModal = document.getElementById('tourModal');
  const closeTourBtn = document.getElementById('closeTourModalBtn');
  const tourForm = document.getElementById('tourScheduleForm');

  const openTourModal = (e) => {
    if (e) e.preventDefault();
    if (tourModal) {
      tourModal.classList.add('active');
      tourModal.setAttribute('aria-hidden', 'false');
    }
  };

  const closeTourModal = () => {
    if (tourModal) {
      tourModal.classList.remove('active');
      tourModal.setAttribute('aria-hidden', 'true');
    }
  };

  document.querySelectorAll('#openTourModalBtn, #openTourModalBtn2, #openTourModalBtn3, .open-tour-trigger').forEach(btn => {
    btn.addEventListener('click', openTourModal);
  });
  if (closeTourBtn) closeTourBtn.addEventListener('click', closeTourModal);

  if (tourModal) {
    tourModal.addEventListener('click', function(e) {
      if (e.target === tourModal) closeTourModal();
    });
  }

  if (tourForm) {
    tourForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const parentNameInput = document.getElementById('parentName');
      const dateValInput = document.getElementById('preferredDate');
      const parentName = parentNameInput ? parentNameInput.value : 'Parent';
      const dateVal = dateValInput ? dateValInput.value : 'selected date';
      
      const submitBtn = tourForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting Request... <i class="ri-loader-4-line ri-spin"></i>';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert(`Thank you, ${parentName}! Your tour request for ${dateVal} has been scheduled. Our team will contact you shortly to confirm details! 🌟`);
        tourForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        closeTourModal();
      }, 1000);
    });
  }

  /* 5. Programs Page Filter Tabs */
  const progFilterTabs = document.querySelectorAll('[data-program-filter]');
  const progCards = document.querySelectorAll('[data-program-cat]');

  if (progFilterTabs.length && progCards.length) {
    progFilterTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        progFilterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const filterVal = this.getAttribute('data-program-filter');

        progCards.forEach(card => {
          const category = card.getAttribute('data-program-cat');
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /* 6. Program Application Modal */
  const programModal = document.getElementById('programModal');
  const closeProgBtn = document.getElementById('closeProgramModalBtn');
  const progForm = document.getElementById('programEnrollForm');

  const openProgModal = (e, targetProg) => {
    if (e) e.preventDefault();
    if (programModal) {
      if (targetProg) {
        const select = document.getElementById('progSelect');
        if (select) select.value = targetProg;
      }
      programModal.classList.add('active');
      programModal.setAttribute('aria-hidden', 'false');
    }
  };

  const closeProgModal = () => {
    if (programModal) {
      programModal.classList.remove('active');
      programModal.setAttribute('aria-hidden', 'true');
    }
  };

  document.querySelectorAll('#openProgramModalBtn, .open-program-modal-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const targetProg = this.getAttribute('data-program');
      openProgModal(e, targetProg);
    });
  });
  if (closeProgBtn) closeProgBtn.addEventListener('click', closeProgModal);
  if (programModal) {
    programModal.addEventListener('click', function(e) {
      if (e.target === programModal) closeProgModal();
    });
  }

  if (progForm) {
    progForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const parentNameInput = document.getElementById('progParentName');
      const progSelectInput = document.getElementById('progSelect');
      const parentName = parentNameInput ? parentNameInput.value : 'Parent';
      const progName = progSelectInput ? progSelectInput.value : 'selected';
      
      const submitBtn = progForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting Application... <i class="ri-loader-4-line ri-spin"></i>';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert(`Congratulations, ${parentName}! Your application for the ${progName} program has been received. Our admissions officer will contact you within 24 hours! 🌟`);
        progForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        closeProgModal();
      }, 1000);
    });
  }

  /* 7. Unique Hero Interactive Orbit & Age Selector */
  const agePills = document.querySelectorAll('.age-pill');
  const orbitBadges = document.querySelectorAll('.orbit-badge');
  const heroDynamicImg = document.getElementById('heroDynamicImg');
  const heroCaptionTag = document.getElementById('heroCaptionTag');
  const heroCaptionTitle = document.getElementById('heroCaptionTitle');
  const heroInteractiveCard = document.getElementById('heroInteractiveCard');
  const heroVisualContainer = document.getElementById('heroVisualInteractive');

  const ageData = {
    toddler: {
      img: 'images/about-1.png',
      tag: 'Toddler Care (1.5-3 yrs)',
      title: 'Sensory Play & Gentle Routines'
    },
    preschool: {
      img: 'images/kindergarten-img1.png',
      tag: 'Preschool (3-4 yrs)',
      title: 'Phonics, Sharing & Story Circles'
    },
    prek: {
      img: 'images/kids.png',
      tag: 'Pre-K Program (4-5 yrs)',
      title: 'Literacy, STEM & Early Math'
    },
    kindergarten: {
      img: 'images/HERO1IMG.png',
      tag: 'Kindergarten (5-6 yrs)',
      title: 'Elementary Readiness & Leadership'
    }
  };

  function updateHeroSpotlight(ageKey) {
    if (!ageData[ageKey]) return;

    // Update active states
    agePills.forEach(p => p.classList.toggle('active', p.getAttribute('data-age') === ageKey));
    orbitBadges.forEach(b => b.classList.toggle('active', b.getAttribute('data-spotlight') === ageKey));

    // Animate Image & Text Swap
    if (heroDynamicImg) {
      heroDynamicImg.style.opacity = '0.3';
      heroDynamicImg.style.transform = 'scale(0.96)';

      setTimeout(() => {
        heroDynamicImg.src = ageData[ageKey].img;
        if (heroCaptionTag) heroCaptionTag.textContent = ageData[ageKey].tag;
        if (heroCaptionTitle) heroCaptionTitle.textContent = ageData[ageKey].title;
        heroDynamicImg.style.opacity = '1';
        heroDynamicImg.style.transform = 'scale(1)';
      }, 200);
    }

    // Trigger Program Cards filter if tab exists
    const matchingTab = document.querySelector(`[data-program-filter="${ageKey}"]`);
    if (matchingTab) {
      matchingTab.click();
    }
  }

  agePills.forEach(pill => {
    pill.addEventListener('click', function() {
      const age = this.getAttribute('data-age');
      updateHeroSpotlight(age);
    });
  });

  orbitBadges.forEach(badge => {
    badge.addEventListener('click', function() {
      const age = this.getAttribute('data-spotlight');
      updateHeroSpotlight(age);
    });
  });

  /* Mouse 3D Parallax Tilt for Hero Card */
  if (heroVisualContainer && heroInteractiveCard) {
    heroVisualContainer.addEventListener('mousemove', function(e) {
      const rect = heroVisualContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 14;
      const rotateY = (x / rect.width) * 14;
      heroInteractiveCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroVisualContainer.addEventListener('mouseleave', function() {
      heroInteractiveCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

});

