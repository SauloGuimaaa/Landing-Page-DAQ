document.addEventListener('DOMContentLoaded', function() {
  // =============================================
  // FUNÇÕES DO FORMULÁRIO DE CAPTAÇÃO (ATUALIZADO)
  // =============================================

  /**
   * Formata o campo de telefone no padrão (00) 00000-0000
   * @param {HTMLInputElement} input - Campo de telefone
   */
  function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 11); // Limita a 11 dígitos
    
    // Formatação visual melhorada
    if (value.length > 6) {
      value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    } else if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    
    input.value = value;
  }

  /**
   * Exibe mensagens de feedback para o usuário (versão melhorada)
   */
  function mostrarFeedback(mensagem, tipo) {
    // Remove feedbacks anteriores
    document.querySelectorAll('.form-feedback').forEach(feedback => feedback.remove());
    
    // Cria novo feedback
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `form-feedback ${tipo}`;
    feedbackElement.innerHTML = `
      <i class="fas ${tipo === 'sucesso' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      ${mensagem}
    `;
    
    // Insere no formulário
    const form = document.getElementById('formNI');
    if (form) {
      form.insertBefore(feedbackElement, form.firstChild);
      feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Remove após 5 segundos (exceto para sucesso)
      if (tipo !== 'sucesso') {
        setTimeout(() => feedbackElement.remove(), 5000);
      }
    }
  }

  // Funções de modal (mantidas iguais)
  function mostrarFormulario() {
    const modal = document.getElementById("formulario-lead");
    if (modal) {
      modal.classList.add("active");
      document.body.classList.add("modal-aberto");
      document.getElementById("nome")?.focus();
    }
    return false;
  }

  function fecharFormulario() {
    const modal = document.getElementById("formulario-lead");
    if (modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-aberto");
    }
  }

  /**
   * Envia os dados do formulário (versão atualizada com validação melhorada)
   */
  async function enviarFormulario() {
    const nome = document.getElementById('nome')?.value.trim();
    let whatsapp = document.getElementById('whatsapp')?.value.replace(/\D/g, '');
    const submitBtn = document.querySelector('#formNI button[type="submit"]');

    // Validações robustas
    if (!nome || nome.length < 3) {
      mostrarFeedback('Por favor, insira seu nome completo (mínimo 3 letras)', 'erro');
      return;
    }

    // Validação flexível de telefone (aceita 10 ou 11 dígitos)
    if (!whatsapp || whatsapp.length < 10 || whatsapp.length > 11) {
      mostrarFeedback('WhatsApp deve ter 10 ou 11 dígitos (com DDD). Ex: (67) 99289-0679', 'erro');
      return;
    }

    if (whatsapp.length === 10) {
    whatsapp = '9' + whatsapp; // Adiciona o 9 na frente para números de 10 dígitos
}

    // Prepara para envio
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    const dadosLead = {
      name: nome,
      phone: `+55${whatsapp}`,
      email: null,
      notes: "Lead captada na Landing Page DAQ",
      tags: ["Mentoria DAQ 2025"]
    };

    try {
      const response = await fetch("https://api.notificacoesinteligentes.com/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5ub3RpZmljYWNvZXNpbnRlbGlnZW50ZXMuY29tOjg0NDMvb3JnYW5pemF0aW9ucy9hcGktdG9rZW4iLCJpYXQiOjE3NDU2MTYyNDYsIm5iZiI6MTc0NTYxNjI0NiwianRpIjoiQUxNeHZ1ZXlSaUNXbGk2NCIsInN1YiI6IjE0Njc2IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyIsIm9yZ2FuaXphdGlvbl9pZCI6MTQxODUsInVzZXJfaWQiOjE0Njc2LCJlbWFpbCI6InNhdWxvZ2cxMDBAZ21haWwuY29tIiwidHlwZSI6InVzZXIiLCJyb2xlIjoiYWRtaW4iLCJmZWF0dXJlX2NoYW5uZWwiOiJzdGFibGUiLCJvcmdhbml6YXRpb25fbmFtZSI6IlNPIFBPUiBRVUVTVE9FUyIsImp3dF90eXBlIjoiYXBpX3Rva2VuIn0.TMs5koJQejkjMlZQcqw2zmhAs4dLcZrP6OKF4D1RRGc" 
        },
        body: JSON.stringify(dadosLead)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao processar seu cadastro');
      }

      // Sucesso
      mostrarFeedback('✔️ Cadastro realizado! Entraremos em contato em breve.', 'sucesso');
      document.getElementById('formNI').reset();
      
      // Tracking e fechamento do modal
      if (typeof fbq !== 'undefined') fbq('track', 'Lead');
      if (typeof gtag !== 'undefined') gtag('event', 'conversion');
      setTimeout(fecharFormulario, 2000);

    } catch (error) {
      console.error('Erro no envio:', error);
      
      // Tratamento de erros específicos
      let mensagemErro;
    if (error.message.includes('token') || error.message.includes('authentication')) {
        mensagemErro = 'Erro de autenticação. Por favor, recarregue a página.';
    } else if (error.message.includes('phone') || error.message.includes('número')) {
        mensagemErro = 'Número inválido ou já cadastrado. Por favor, verifique ou use outro WhatsApp.';
    } else if (error.message.includes('validation')) {
        mensagemErro = 'Formato de número inválido. Use (DDD) + número com 9 dígitos.';
    } else {
        mensagemErro = 'Erro ao enviar. Tente novamente ou nos chame no WhatsApp.';
    }
      
      mostrarFeedback(mensagemErro, 'erro');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Quero me inscrever';
    }
  }

  // =============================================
  // CONFIGURAÇÃO DOS EVENT LISTENERS (ATUALIZADO)
  // =============================================

  // Configura todos os botões CTA
  document.querySelectorAll('[class*="cta"], .btn-primary').forEach(button => {
    button.addEventListener('click', function(e) {
      if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
        e.preventDefault();
        mostrarFormulario();
      }
    });
  });

  // Fechar modal ao clicar fora ou no X
  const modal = document.getElementById('formulario-lead');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this || e.target.classList.contains('close-btn')) {
        fecharFormulario();
      }
    });
  }

  // Configuração do campo de telefone com máscara dinâmica
  const whatsappInput = document.getElementById('whatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', function() {
      formatarTelefone(this);
    });
    
    // Placeholder dinâmico para mobile/desktop
    whatsappInput.placeholder = window.innerWidth < 768 ? '(67) 99289-0679' : '(DDD) 99999-9999';
  }

  // Configuração do envio do formulário
  const form = document.getElementById('formNI');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      enviarFormulario();
    });
  }

  // =============================================
  // EXPORTA FUNÇÕES PARA HTML
  // =============================================
  window.mostrarFormulario = mostrarFormulario;
  window.fecharFormulario = fecharFormulario;
  window.formatarTelefone = formatarTelefone;
  window.enviarFormulario = enviarFormulario;

});

document.addEventListener('DOMContentLoaded', function() {
  const carrossel = document.querySelector('.depoimentos-carrossel');
  const cards = document.querySelectorAll('.depoimento-card');
  const prevBtn = document.querySelector('.carrossel-btn.prev');
  const nextBtn = document.querySelector('.carrossel-btn.next');
  const dotsContainer = document.querySelector('.carrossel-dots');

  if (!carrossel || !cards.length) return;

  let currentIndex = 0;
  let cardWidth = cards[0].offsetWidth + 30; // Largura do card + margem
  let visibleCards = 3;
  let autoScrollInterval;

  // Função para centralizar os cards verticalmente
  function alignCards() {
    cards.forEach(card => {
      const content = card.querySelector('.depoimento-content');
      if (content) {
        content.style.marginTop = '0';
        content.style.marginBottom = '0';
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
    cardWidth = cards[0].offsetWidth + 30;
    alignCards(); // Alinha os cards após mudança de tamanho
  }

  function updateCarrossel() {
    const translateValue = -currentIndex * (cardWidth * visibleCards);
    carrossel.style.transform = `translateX(${translateValue}px)`;
    updateDots();
    updateButtons();
    
    // Força realinhamento após a animação
    setTimeout(alignCards, 500);
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
  alignCards(); // Alinha os cards inicialmente
  startAutoScroll();

  // Pausa o auto-scroll quando o mouse está sobre o carrossel
  carrossel.addEventListener('mouseenter', stopAutoScroll);
  carrossel.addEventListener('mouseleave', startAutoScroll);


  // Configuração do FAQ Accordion (mantido original)
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
});