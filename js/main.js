/* ═══════════════════════════════════════════════════════
   GRUPO DOMUS CAPITAL — JavaScript principal
   Ligero: scroll reveal, header sticky, menú móvil,
   formulario, cookies, FAQ y utilidades.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Header sticky: transparente → sólido ── */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const observer = () => {
      if (window.scrollY > 60) {
        header.classList.remove('header--transparent');
        header.classList.add('header--solid');
      } else {
        header.classList.remove('header--solid');
        header.classList.add('header--transparent');
      }
    };

    // En páginas internas sin hero, empieza sólido
    const hasHero = document.querySelector('.hero') || document.querySelector('.page-hero');
    if (!hasHero) {
      header.classList.add('header--solid');
      header.classList.remove('header--transparent');
      return;
    }

    window.addEventListener('scroll', observer, { passive: true });
    observer();
  }


  /* ── Menú móvil ── */
  function initMobileMenu() {
    const btn = document.querySelector('.header__hamburger');
    const nav = document.querySelector('.mobile-nav');
    if (!btn || !nav) return;

    const links = nav.querySelectorAll('.mobile-nav__link');

    function toggle() {
      const isOpen = nav.classList.toggle('mobile-nav--open');
      btn.classList.toggle('header__hamburger--open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    btn.addEventListener('click', toggle);
    links.forEach(link => link.addEventListener('click', toggle));

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('mobile-nav--open')) {
        toggle();
      }
    });
  }


  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }


  /* ── Imagen flotante al hover en servicios ── */
  function initServiceHoverImages() {
    const items = document.querySelectorAll('.service-item[data-preview]');
    if (!items.length) return;

    // Crear un único visor flotante adjunto directamente a document.body
    let floatingViewer = document.getElementById('services-floating-preview');
    if (!floatingViewer) {
      floatingViewer = document.createElement('div');
      floatingViewer.id = 'services-floating-preview';
      floatingViewer.className = 'services-floating-preview';
      floatingViewer.innerHTML = '<img src="" alt="Vista previa del servicio" loading="eager">';
      document.body.appendChild(floatingViewer);
    }

    const floatingImg = floatingViewer.querySelector('img');
    const previewWidth = 280;
    const previewHeight = 210;
    const gap = 18;

    items.forEach(item => {
      const localImg = item.querySelector('.service-item__preview img');
      if (!localImg) return;
      const imgSrc = localImg.getAttribute('src');

      const onMove = (e) => {
        if (window.innerWidth < 1024) return;
        let x = e.clientX + gap;
        let y = e.clientY - (previewHeight / 2);

        // Si se sale por el lateral derecho, ubicar a la izquierda del cursor
        if (x + previewWidth > window.innerWidth - 16) {
          x = e.clientX - previewWidth - gap;
        }

        // Si se sale verticalmente del viewport
        if (y < 16) {
          y = 16;
        } else if (y + previewHeight > window.innerHeight - 16) {
          y = window.innerHeight - previewHeight - 16;
        }

        floatingViewer.style.left = `${Math.round(x)}px`;
        floatingViewer.style.top = `${Math.round(y)}px`;
      };

      item.addEventListener('mouseenter', (e) => {
        if (window.innerWidth < 1024) return;
        if (floatingImg.getAttribute('src') !== imgSrc) {
          floatingImg.setAttribute('src', imgSrc);
        }
        floatingViewer.classList.add('is-active');
        onMove(e);
      });

      item.addEventListener('mousemove', onMove, { passive: true });

      item.addEventListener('mouseleave', () => {
        floatingViewer.classList.remove('is-active');
      });
    });

    window.addEventListener('scroll', () => {
      floatingViewer.classList.remove('is-active');
    }, { passive: true });
  }


  /* ── FAQ Acordeón ── */
  function initFAQ() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(item => {
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq__item--open');

        // Cerrar todos
        items.forEach(i => {
          i.classList.remove('faq__item--open');
          i.querySelector('.faq__answer').style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('faq__item--open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }


  /* ── Formulario de contacto ── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Reset errores
      form.querySelectorAll('.form__error').forEach(err => {
        err.classList.remove('form__error--visible');
      });
      form.querySelectorAll('.form__input--error, .form__select--error, .form__textarea--error').forEach(el => {
        el.classList.remove('form__input--error', 'form__select--error', 'form__textarea--error');
      });

      // Validar campos requeridos
      const nombre = form.querySelector('#form-nombre');
      const telefono = form.querySelector('#form-telefono');
      const email = form.querySelector('#form-email');
      const servicio = form.querySelector('#form-servicio');
      const rgpd = form.querySelector('#form-rgpd');

      if (!nombre.value.trim()) {
        showError(nombre, 'Introduce tu nombre');
        valid = false;
      }

      if (!telefono.value.trim() || !/^[0-9+\s()-]{6,}$/.test(telefono.value)) {
        showError(telefono, 'Introduce un teléfono válido');
        valid = false;
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Introduce un email válido');
        valid = false;
      }

      if (!servicio.value) {
        showError(servicio, 'Selecciona un servicio');
        valid = false;
      }

      if (!rgpd.checked) {
        const rgpdError = rgpd.closest('.form__group').querySelector('.form__error');
        if (rgpdError) rgpdError.classList.add('form__error--visible');
        valid = false;
      }

      if (valid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';

        const mensaje = form.querySelector('#form-mensaje');
        const servicioSelect = form.querySelector('#form-servicio');
        const servicioText = servicioSelect.options[servicioSelect.selectedIndex] ? servicioSelect.options[servicioSelect.selectedIndex].text : servicioSelect.value;

        const payload = {
          nombre: nombre.value.trim(),
          telefono: telefono.value.trim(),
          email: email.value.trim(),
          servicio: servicioSelect.value,
          servicioTexto: servicioText,
          mensaje: mensaje ? mensaje.value.trim() : '',
          consentimientoPrivacidad: rgpd.checked,
          origen: window.location.href
        };

        const targetUrl = form.getAttribute('action');

        fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Respuesta no válida del servicio');
          }
          // n8n puede responder con un cuerpo vacío si el webhook usa "Immediately".
          return response.text();
        })
        .then(() => {
          form.style.display = 'none';
          const success = document.querySelector('.form__success');
          if (success) success.classList.add('form__success--visible');
          form.reset();
        })
        .catch(err => {
          console.error('Error al enviar formulario:', err);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          showError(email, 'No se pudo enviar automáticamente. Por favor, llámanos directamente o escríbenos a info@grupodomuscapital.com');
        });
      }
    });

    function showError(input, message) {
      const errorEl = input.closest('.form__group').querySelector('.form__error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('form__error--visible');
      }
      const classList = input.classList;
      if (input.tagName === 'SELECT') {
        classList.add('form__select--error');
      } else if (input.tagName === 'TEXTAREA') {
        classList.add('form__textarea--error');
      } else {
        classList.add('form__input--error');
      }
    }
  }


  /* ── Cookie Banner ── */
  function initCookieBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    // Si ya aceptó/rechazó, no mostrar
    if (localStorage.getItem('dc_cookies') !== null) return;

    // Mostrar tras 1s
    setTimeout(() => {
      banner.classList.add('cookie-banner--visible');
    }, 1000);

    const acceptBtn = banner.querySelector('.cookie-banner__btn--accept');
    const rejectBtn = banner.querySelector('.cookie-banner__btn--reject');

    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem('dc_cookies', 'accepted');
      banner.classList.remove('cookie-banner--visible');
      // TODO: Activar scripts de analítica aquí
    });

    rejectBtn?.addEventListener('click', () => {
      localStorage.setItem('dc_cookies', 'rejected');
      banner.classList.remove('cookie-banner--visible');
    });
  }


  /* ── Smooth scroll para anclas ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80; // altura del header
          const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }


  /* ── Año actual en footer ── */
  function initFooterYear() {
    const yearEl = document.querySelector('.footer__year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }


  /* ── Inicializar todo ── */
  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initServiceHoverImages();
    initFAQ();
    initContactForm();
    initCookieBanner();
    initSmoothScroll();
    initFooterYear();
  });

})();
