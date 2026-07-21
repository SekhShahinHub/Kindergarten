(function(){
  "use strict";

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
  if(track && dotsWrap){
    var cards = track.children.length;
    function perView(){
      var w = window.innerWidth;
      if(w <= 680) return 1;
      if(w <= 980) return 2;
      return 3;
    }
    var index = 0;

    function pages(){ return Math.max(1, cards - perView() + 1); }

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
      var cardWidth = track.children[0].getBoundingClientRect().width;
      var gap = 26;
      track.style.transform = 'translateX(-' + (index * (cardWidth + gap)) + 'px)';
      Array.prototype.forEach.call(dotsWrap.children, function(dot, di){
        dot.classList.toggle('active', di === index);
      });
    }

    renderDots();
    goTo(0);

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
    track.closest('.testimonials').addEventListener('mouseenter', function(){ clearInterval(autoplay); });
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

  /* ---------- Video play button (visual only) ---------- */
  var playBtn = document.querySelector('.play-btn');
  if(playBtn){
    playBtn.addEventListener('click', function(){
      playBtn.style.transform = 'translate(-50%,-50%) scale(0.9)';
      setTimeout(function(){ playBtn.style.transform = ''; }, 200);
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

/*=============== SEARCH BAR JS ===============*/
const toggleSearch = (search, button) =>{
   const searchBar = document.getElementById(search),
         searchButton = document.getElementById(button)

   searchButton.addEventListener('click', () =>{
       // We add the show-search class, so that the search bar expands
       searchBar.classList.toggle('show-search')
   })
}
toggleSearch('search-bar', 'search-button')