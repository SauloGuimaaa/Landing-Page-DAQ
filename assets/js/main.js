document.addEventListener('DOMContentLoaded', function() {
  // Seleção dos elementos do carrossel
  const carrossel = document.querySelector('.depoimentos-carrossel');
  const cards = document.querySelectorAll('.depoimento-card');
  const prevBtn = document.querySelector('.carrossel-btn.prev');
  const nextBtn = document.querySelector('.carrossel-btn.next');
  const dotsContainer = document.querySelector('.carrossel-dots');

  // Se não encontrar os elementos necessários, interrompe a execução
  if (!carrossel || !cards.length) return;

  // Variáveis de controle
  let currentIndex = 0;
  let visibleCards = 3;
  let cardWidth = 0;
  let carrosselWidth = 0;
  let autoScrollInterval;

  // Atualiza a quantidade de cards visíveis e suas dimensões
  function updateVisibleCards() {
    // Define quantos cards são visíveis baseado no tamanho da tela
    if (window.innerWidth >= 992) {
      visibleCards = 3;
    } else if (window.innerWidth >= 768) {
      visibleCards = 2;
    } else {
      visibleCards = 1;
    }
    
    // Calcula a largura do container do carrossel
    carrosselWidth = carrossel.offsetWidth;
    // Calcula a largura efetiva de cada card (incluindo margens)
    cardWidth = carrosselWidth / visibleCards;
    
    // Ajusta a largura dos cards para preencher o espaço corretamente
    cards.forEach(card => {
      card.style.width = `${cardWidth - 30}px`; // Subtrai o padding
      card.style.margin = '0 15px'; // Margem uniforme
      card.style.flexShrink = '0'; // Evita que os cards encolham
    });
  }

  // Atualiza a posição do carrossel
  function updateCarrossel() {
    const translateValue = -currentIndex * carrosselWidth;
    carrossel.style.transform = `translateX(${translateValue}px)`;
    updateDots();
    updateButtons();
  }

  // Cria os indicadores (dots) de navegação
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

  // Atualiza o estado dos dots
  function updateDots() {
    const dots = document.querySelectorAll('.carrossel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Atualiza o estado dos botões de navegação
  function updateButtons() {
    const totalCards = cards.length;
    const maxIndex = Math.ceil(totalCards / visibleCards) - 1;
    
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  // Inicia o scroll automático
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

  // Para o scroll automático
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Event listeners para os botões de navegação
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

  // Atualiza o carrossel quando a janela é redimensionada
  window.addEventListener('resize', () => {
    updateVisibleCards();
    updateCarrossel();
    createDots();
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
          if (answer) {
            answer.style.maxHeight = '0';
            answer.style.padding = '0 25px';
          }
        }
      });
      
      // Alterna o item atual
      question.setAttribute('aria-expanded', !isExpanded);
      const answer = document.getElementById(question.getAttribute('aria-controls'));
      
      if (answer) {
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.padding = '0 25px 25px';
        } else {
          answer.style.maxHeight = '0';
          answer.style.padding = '0 25px';
        }
      }
    });
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