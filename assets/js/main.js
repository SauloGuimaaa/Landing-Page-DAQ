document.addEventListener('DOMContentLoaded', function() {
  const carrossel = document.querySelector('.depoimentos-carrossel');
  const cards = document.querySelectorAll('.depoimento-card');
  const prevBtn = document.querySelector('.carrossel-btn.prev');
  const nextBtn = document.querySelector('.carrossel-btn.next');
  const dotsContainer = document.querySelector('.carrossel-dots');
  const container = document.querySelector('.depoimentos-container');

  if (!carrossel || !cards.length) return;

  let currentIndex = 0;
  let visibleCards = 3;
  let autoScrollInterval;
  let isAnimating = false;

  // Função para forçar o alinhamento dos cards
  function forceAlignment() {
    cards.forEach(card => {
      card.style.transform = 'none'; // Remove qualquer transformação residual
      const content = card.querySelector('.depoimento-content');
      if (content) {
        content.style.margin = '0 auto'; // Centraliza horizontalmente
      }
    });
  }

  function updateVisibleCards() {
    if (window.innerWidth >= 992) {
      visibleCards = 3;
    } else if (window.innerWidth >= 768) {
      visibleCards = 2;
    } else {
      visibleCards = 1;
    }
    forceAlignment();
  }

  function updateCarrossel() {
    if (isAnimating) return;
    isAnimating = true;

    const cardWidth = container.offsetWidth / visibleCards;
    const newPosition = -currentIndex * cardWidth * visibleCards;
    
    carrossel.style.transition = 'transform 0.5s ease';
    carrossel.style.transform = `translateX(${newPosition}px)`;
    
    // Garante que o alinhamento seja aplicado após a animação
    setTimeout(() => {
      forceAlignment();
      isAnimating = false;
    }, 500);
    
    updateDots();
    updateButtons();
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = Math.ceil(cards.length / visibleCards);
    
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carrossel-dot');
      dot.setAttribute('aria-label', `Ir para slide ${i+1}`);
      if (i === currentIndex) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarrossel();
      });
      
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = document.querySelectorAll('.carrossel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function updateButtons() {
    const totalSlides = Math.ceil(cards.length / visibleCards);
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalSlides - 1;
  }

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      const totalSlides = Math.ceil(cards.length / visibleCards);
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarrossel();
    }, 5000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Event listeners
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarrossel();
    }
    stopAutoScroll();
  });

  nextBtn.addEventListener('click', () => {
    const totalSlides = Math.ceil(cards.length / visibleCards);
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateCarrossel();
    }
    stopAutoScroll();
  });

  window.addEventListener('resize', () => {
    updateVisibleCards();
    updateCarrossel();
    createDots();
  });

  // Inicialização
  updateVisibleCards();
  createDots();
  updateButtons();
  forceAlignment(); // Alinhamento inicial forçado
  startAutoScroll();

  // Pausa auto-scroll ao interagir
  carrossel.addEventListener('mouseenter', stopAutoScroll);
  carrossel.addEventListener('mouseleave', startAutoScroll);

  // Configuração do FAQ Accordion (mantido original)
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      faqQuestions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
          const answer = document.getElementById(q.getAttribute('aria-controls'));
          answer.style.maxHeight = '0';
          answer.style.padding = '0 25px';
        }
      });
      
      question.setAttribute('aria-expanded', !isExpanded);
      const answer = document.getElementById(question.getAttribute('aria-controls'));
      
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.padding = '0 25px 25px';
      } else {
        answer.style.maxHeight = '0';
        answer.style.padding = '0 25px';
      }
    });
  });
});