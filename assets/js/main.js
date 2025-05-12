document.addEventListener('DOMContentLoaded', function() {
  const carrossel = document.querySelector('.depoimentos-carrossel');
  const cards = document.querySelectorAll('.depoimento-card');
  const prevBtn = document.querySelector('.carrossel-btn.prev');
  const nextBtn = document.querySelector('.carrossel-btn.next');
  const dotsContainer = document.querySelector('.carrossel-dots');

  if (!carrossel || !cards.length) return;

  let currentIndex = 0;
  let cardWidth = cards[0].offsetWidth + 30; // Inclui a margem
  let visibleCards = 3;
  let autoScrollInterval;

  function updateVisibleCards() {
    if (window.innerWidth >= 992) {
      visibleCards = 3;
    } else if (window.innerWidth >= 768) {
      visibleCards = 2;
    } else {
      visibleCards = 1;
    }
  }

  function updateCarrossel() {
    const translateValue = -currentIndex * cardWidth * visibleCards;
    carrossel.style.transform = `translateX(${translateValue}px)`;
    updateDots();
    updateButtons();
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    const totalCards = cards.length;
    const dotCount = Math.ceil(totalCards / visibleCards);
    
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carrossel-dot');
      dot.setAttribute('aria-label', `Ir para depoimento ${i+1}`);
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarrossel();
      });
      
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = document.querySelectorAll('.carrossel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function updateButtons() {
    const totalCards = cards.length;
    const maxIndex = Math.ceil(totalCards / visibleCards) - 1;
    
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      const totalCards = cards.length;
      const maxIndex = Math.ceil(totalCards / visibleCards) - 1;
      
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      
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
    const totalCards = cards.length;
    const maxIndex = Math.ceil(totalCards / visibleCards) - 1;
    
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarrossel();
    }
    stopAutoScroll();
  });

  window.addEventListener('resize', () => {
    updateVisibleCards();
    cardWidth = cards[0].offsetWidth + 30;
    updateCarrossel();
    createDots();
  });

  // Inicialização
  updateVisibleCards();
  createDots();
  updateButtons();
  startAutoScroll();

  // Pausa o auto-scroll quando o mouse está sobre o carrossel
  carrossel.addEventListener('mouseenter', stopAutoScroll);
  carrossel.addEventListener('mouseleave', startAutoScroll);
});


// Configuração do FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
  
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Fecha todos os outros itens
    faqQuestions.forEach(q => {
      if (q !== question) {
        q.setAttribute('aria-expanded', 'false');
        const answer = document.getElementById(q.getAttribute('aria-controls'));
        answer.style.maxHeight = '0';
        answer.style.padding = '0 25px';
      }
    });
    
    // Alterna o item atual
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