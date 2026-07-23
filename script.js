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

  // Hide loader on DOMContentLoaded (faster for some cases)
  document.addEventListener('DOMContentLoaded', function(){
    // Loader will hide when window.load fires
  });

  // Public API for manual loader control
  window.loaderAPI = {
    show: function(){
      if(loaderOverlay){
        loaderOverlay.classList.remove('hidden');
      }
    },
    hide: function(){
      if(loaderDynamicText){
        loaderDynamicText.stop();
      }
      if(loaderOverlay){
        loaderOverlay.classList.add('hidden');
      }
    },
    setTitle: function(title){
      var titleEl = loaderOverlay.querySelector('.loader-title');
      if(titleEl) titleEl.textContent = title;
    },
    setSubtitle: function(subtitle){
      var subtitleEl = loaderOverlay.querySelector('.loader-subtitle');
      if(subtitleEl) subtitleEl.textContent = subtitle;
    },
    setSize: function(size){
      var container = loaderOverlay.querySelector('.loader-container');
      if(container){
        container.classList.remove('sm', 'md', 'lg');
        container.classList.add(size);
      }
    }
  };

  /* ---------- Dynamic Text Cycling in Loader ---------- */
  var loaderDynamicText = null;
  
  function initDynamicText(){
    if(typeof DynamicText !== 'undefined' && !loaderDynamicText){
      loaderDynamicText = new DynamicText('dynamicText', {
        greetings: [
          { text: 'Getting things ready...', language: 'English' },
          { text: 'Loading learning materials...', language: 'English' },
          { text: 'Preparing your adventure...', language: 'English' },
          { text: 'Brightening young minds...', language: 'English' },
          { text: 'Setting up the fun zone...', language: 'English' },
          { text: 'Almost there...', language: 'English' }
        ],
        animationDuration: 300,
        displayDuration: 2500
      });
    }
  }
  
  // Wait a tick to ensure DynamicText class is available
  setTimeout(initDynamicText, 10);

  /* ---------- Dynamic Text for Page Sections ---------- */
  var sectionDynamicTexts = {};
  
  function initSectionDynamicTexts(){
    if(typeof DynamicText === 'undefined') return;
    
    // Hero section dynamic text
    if(!sectionDynamicTexts.hero){
      var heroElement = document.getElementById('heroDynamicText');
      if(heroElement){
        sectionDynamicTexts.hero = new DynamicText('heroDynamicText', {
          greetings: [
            { text: 'Safe & Nurturing', language: 'English' },
            { text: 'Creative Learning', language: 'English' },
            { text: 'Play-Based Education', language: 'English' },
            { text: 'Expert Care', language: 'English' },
            { text: 'Happy Smiles', language: 'English' }
          ],
          animationDuration: 400,
          displayDuration: 3500
        });
      }
    }
    
    // About section dynamic text
    if(!sectionDynamicTexts.about){
      var aboutElement = document.getElementById('aboutDynamicText');
      if(aboutElement){
        sectionDynamicTexts.about = new DynamicText('aboutDynamicText', {
          greetings: [
            { text: 'Nurturing Growth', language: 'English' },
            { text: 'Building Confidence', language: 'English' },
            { text: 'Fostering Creativity', language: 'English' },
            { text: 'Developing Skills', language: 'English' },
            { text: 'Creating Memories', language: 'English' }
          ],
          animationDuration: 400,
          displayDuration: 3500
        });
      }
    }
  }
  
  // Initialize section dynamic texts when page loads
  document.addEventListener('DOMContentLoaded', initSectionDynamicTexts);
  setTimeout(initSectionDynamicTexts, 100);
  var originalShow = window.loaderAPI.show;
  window.loaderAPI.show = function(){
    if(loaderOverlay){
      loaderOverlay.classList.remove('hidden');
      if(loaderDynamicText){
        loaderDynamicText.reset();
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

    function moveBy(delta){
      var total = pages();
      goTo(index + delta);
      if(index >= total - 1 && delta > 0){
        index = total - 1;
      }
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
  var sections = ['top','about','programs','teachers','testimonials','blog'];
  var navLinks = document.querySelectorAll('.nav-links a');
  if('IntersectionObserver' in window){
    var navIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.id;
          navLinks.forEach(function(a){
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
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

