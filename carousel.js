/**
 * Script de funcionamiento para el Carrusel y Botones Inferiores (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Selección de Elementos del Carrusel
  const carousel = document.getElementById('carouselExampleIndicators');
  const items = carousel.querySelectorAll('.carousel-item');
  const indicators = carousel.querySelectorAll('.carousel-indicators li');
  const prevBtn = carousel.querySelector('.carousel-control-prev');
  const nextBtn = carousel.querySelector('.carousel-control-next');
  const controlButtons = document.querySelectorAll('#controles .Bx');

  let currentIndex = 0;
  let autoPlayInterval = null;
  let isAutoPlaying = true;
  let isFiltered = false;

  // Sincronizar número de indicadores si difiere del número de diapositivas
  const indicatorsContainer = carousel.querySelector('.carousel-indicators');
  if (indicators.length < items.length) {
    indicatorsContainer.innerHTML = '';
    items.forEach((_, idx) => {
      const li = document.createElement('li');
      li.setAttribute('data-target', '#carouselExampleIndicators');
      li.setAttribute('data-slide-to', idx);
      if (idx === 0) li.classList.add('active');
      indicatorsContainer.appendChild(li);
    });
  }

  const updatedIndicators = carousel.querySelectorAll('.carousel-indicators li');

  // Función principal para cambiar de diapositiva
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = items.length - 1;
    } else if (index >= items.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Actualizar clase 'active' en ítems
    items.forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Actualizar clase 'active' en indicadores
    updatedIndicators.forEach((ind, i) => {
      if (i === currentIndex) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });
  }

  // Eventos de controles del carrusel (Flechas)
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(currentIndex - 1);
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(currentIndex + 1);
    resetAutoPlay();
  });

  // Eventos de Indicadores
  updatedIndicators.forEach((ind, i) => {
    ind.addEventListener('click', () => {
      goToSlide(i);
      resetAutoPlay();
    });
  });

  // Reproducción Automática
  function startAutoPlay() {
    if (!autoPlayInterval) {
      autoPlayInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4000);
      isAutoPlaying = true;
    }
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      isAutoPlaying = false;
    }
  }

  function resetAutoPlay() {
    if (isAutoPlaying) {
      stopAutoPlay();
      startAutoPlay();
    }
  }

  // Pausar al pasar el ratón
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', () => {
    if (isAutoPlaying) startAutoPlay();
  });

  startAutoPlay();

  // ==========================================================================
  // 2. Funcionalidad para los Botones Inferiores (B1, B2, B3)
  // ==========================================================================

  // Crear elemento Toast para notificaciones en pantalla
  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  document.body.appendChild(toast);

  function showNotification(message, duration = 2500) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Asignar nombres personalizados a los botones para mejorar la experiencia
  if (controlButtons[0]) controlButtons[0].textContent = 'B1: Inicio';
  if (controlButtons[1]) controlButtons[1].textContent = 'B2: Pausa/Play';
  if (controlButtons[2]) controlButtons[2].textContent = 'B3: Modo Filtro';

  // BOTÓN B1: Reiniciar Carrusel (Ir a la primera imagen)
  if (controlButtons[0]) {
    controlButtons[0].addEventListener('click', () => {
      goToSlide(0);
      resetAutoPlay();
      showNotification('📌 Volviste a la primera imagen (B1)');
    });
  }

  // BOTÓN B2: Alternar Reproducción Automática (Pausar / Reanudar)
  if (controlButtons[1]) {
    controlButtons[1].addEventListener('click', () => {
      if (isAutoPlaying) {
        stopAutoPlay();
        controlButtons[1].style.backgroundColor = '#ef4444'; // Rojo al pausar
        showNotification('⏸️ Carrusel pausado (B2)');
      } else {
        startAutoPlay();
        controlButtons[1].style.backgroundColor = '#3b82f6'; // Azul al reanudar
        showNotification('▶️ Reproducción reanudada (B2)');
      }
    });
  }

  // BOTÓN B3: Aplicar Filtro Visual a la Imagen Activa
  if (controlButtons[2]) {
    controlButtons[2].addEventListener('click', () => {
      isFiltered = !isFiltered;
      items.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
          img.style.filter = isFiltered ? 'sepia(60%) contrast(110%) brightness(90%)' : 'none';
          img.style.transition = 'filter 0.5s ease';
        }
      });

      if (isFiltered) {
        controlButtons[2].style.backgroundColor = '#8b5cf6'; // Morado si activo
        showNotification('🎨 Filtro cálido aplicado a imágenes (B3)');
      } else {
        controlButtons[2].style.backgroundColor = '#3b82f6';
        showNotification('🖼️ Filtro removido (B3)');
      }
    });
  }
});
