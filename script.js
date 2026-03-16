/* ============================================================
   한미약품 이은환 MR 자기소개 홈페이지 — JavaScript
   ============================================================ */

// ---- Navbar Scroll Effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// ---- Active Nav Link ----
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    closeMobileMenu();
  }
});

// ---- Scroll Reveal (AOS-like) ----
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  observer.observe(el);
});

// ---- Smooth Scroll for Nav Links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Toast Notification ----
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ---- Request Form ----
function sendRequest() {
  const checked = document.querySelectorAll('.request-items input[type="checkbox"]:checked');
  const memo = document.querySelector('.request-memo textarea').value;

  if (checked.length === 0 && !memo.trim()) {
    showToast('⚠️ 요청 항목을 선택하거나 내용을 입력해 주세요.');
    return;
  }

  const items = Array.from(checked).map(cb => {
    return cb.nextElementSibling.textContent.trim();
  });

  let message = '안녕하세요! 한미약품 이은환입니다.\n\n요청 내용을 확인했습니다:\n';
  if (items.length > 0) {
    message += items.join(', ');
  }
  if (memo.trim()) {
    message += '\n추가 요청: ' + memo;
  }

  // 카카오톡 또는 이메일로 연결 (실제 배포 시 수정)
  const kakaoUrl = 'https://open.kakao.com/o/placeholder';
  
  showToast('✅ 요청이 이은환에게 전달되었습니다! 곧 연락드리겠습니다.');
  
  // 체크박스 초기화
  checked.forEach(cb => cb.checked = false);
  document.querySelector('.request-memo textarea').value = '';
}

// ---- Vote System ----
let selectedVote = null;
const voteData = {
  coffee: 45,
  sandwich: 30,
  dessert: 15,
  fruit: 10
};

function selectVote(el, type) {
  document.querySelectorAll('.vote-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  el.classList.add('selected');
  selectedVote = type;
}

function submitVote() {
  if (!selectedVote) {
    showToast('⚠️ 원하시는 간식을 선택해 주세요!');
    return;
  }

  // 투표 수 업데이트 (시뮬레이션)
  const total = Object.values(voteData).reduce((a, b) => a + b, 0) + 1;
  voteData[selectedVote] += 1;

  // 퍼센트 재계산 및 UI 업데이트
  const voteOptions = document.querySelectorAll('.vote-option');
  const keys = ['coffee', 'sandwich', 'dessert', 'fruit'];
  
  voteOptions.forEach((opt, i) => {
    const key = keys[i];
    const pct = Math.round((voteData[key] / total) * 100);
    const bar = opt.querySelector('.vote-bar');
    const count = opt.querySelector('.vote-count');
    if (bar) bar.style.width = pct + '%';
    if (count) count.textContent = pct + '%';
  });

  const labels = {
    coffee: '☕ 커피 & 음료',
    sandwich: '🥪 샌드위치 & 베이커리',
    dessert: '🍰 케이크 & 디저트',
    fruit: '🍱 도시락 & 식사'
  };

  showToast(`✅ "${labels[selectedVote]}" 투표 완료! 이은환이 준비해 갈게요!`);
  selectedVote = null;
  document.querySelectorAll('.vote-option').forEach(opt => opt.classList.remove('selected'));
}

// ---- Board Submit ----
function submitBoard() {
  const input = document.querySelector('.board-input');
  const textarea = document.querySelector('.board-textarea');
  const isSecret = document.getElementById('secretCheck').checked;

  if (!input.value.trim() || !textarea.value.trim()) {
    showToast('⚠️ 병원명/성함과 요청 내용을 모두 입력해 주세요.');
    return;
  }

  const secretText = isSecret ? ' (비밀글)' : '';
  showToast(`✅ 요청이 전달되었습니다${secretText}! 이은환이 빠르게 연락드리겠습니다.`);

  input.value = '';
  textarea.value = '';
  document.getElementById('secretCheck').checked = false;
}

// ---- Number Counter Animation ----
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

// ---- Parallax Effect (subtle) ----
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg-grid');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  
  // Trigger initial AOS check
  setTimeout(() => {
    document.querySelectorAll('[data-aos]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('aos-animate');
      }
    });
  }, 100);
});
