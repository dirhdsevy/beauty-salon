class CircularScroller {
  constructor(options) {
    this.track = document.querySelector(options.trackSelector);
    this.leftButton = document.querySelector(options.leftButtonSelector);
    this.rightButton = document.querySelector(options.rightButtonSelector);
    
    if (!this.track || !this.leftButton || !this.rightButton) {
      console.error('CircularScroller: Не знайдено елементи для:', options);
      return;
    }
    
    this.cells = Array.from(this.track.children);
    this.currentIndex = 0;
    this.visibleCount = options.visibleCount;
    this.totalCells = this.cells.length;
    this.isAnimating = false;
    this.needsReset = false;
    this.resetDirection = null;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.track.addEventListener('transitionend', () => {
      if (this.needsReset) {
        this.performReset();
      }
      this.isAnimating = false;
      this.updateButtonStates();
    });
    
    // Ініціалізація стану кнопок
    this.updateButtonStates();
  }
  
  bindEvents() {
    this.rightButton.addEventListener('click', () => {
      if (this.isAnimating) return;
      this.scrollRight();
    });
    
    this.leftButton.addEventListener('click', () => {
      if (this.isAnimating) return;
      this.scrollLeft();
    });
  }
  
  scrollRight() {
    this.isAnimating = true;
    
    this.currentIndex++;
    this.updatePosition();
    
    if (this.currentIndex > this.totalCells - this.visibleCount) {
      this.needsReset = true;
      this.resetDirection = 'right';
    }
  }
  
  scrollLeft() {
    this.isAnimating = true;
    
    this.currentIndex--;
    this.updatePosition();
    
    if (this.currentIndex < 0) {
      this.needsReset = true;
      this.resetDirection = 'left';
    }
  }
  
  performReset() {
    this.track.style.transition = 'none';
    
    if (this.resetDirection === 'right') {
      this.currentIndex = 1;
    } else {
      this.currentIndex = this.totalCells - this.visibleCount - 1;
    }
    
    this.updatePosition();
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.track.style.transition = 'transform 0.5s ease-in-out';
        this.needsReset = false;
        this.resetDirection = null;
      });
    });
  }
  
  updatePosition() {
    const cellWidth = this.cells[0].offsetWidth + 
                     parseInt(getComputedStyle(this.track).gap);
    const translateX = -this.currentIndex * cellWidth;
    this.track.style.transform = `translateX(${translateX}px)`;
  }
  
  updateButtonStates() {
    // Для нескінченного скролу завжди активні обидві кнопки
    this.leftButton.disabled = false;
    this.rightButton.disabled = false;
    this.leftButton.style.opacity = '1';
    this.rightButton.style.opacity = '1';
  }
}

class LinearScroller {
  constructor(options) {
    this.track = document.querySelector(options.trackSelector);
    this.leftButton = document.querySelector(options.leftButtonSelector);
    this.rightButton = document.querySelector(options.rightButtonSelector);
    
    if (!this.track || !this.leftButton || !this.rightButton) {
      console.error('LinearScroller: Не знайдено елементи для:', options);
      return;
    }
    
    this.cells = Array.from(this.track.children);
    this.currentIndex = 0;
    this.visibleCount = options.visibleCount;
    this.totalCells = this.cells.length;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.track.addEventListener('transitionend', () => {
      this.isAnimating = false;
      this.updateButtonStates();
    });
    
    // Ініціалізація стану кнопок
    this.updateButtonStates();
  }
  
  bindEvents() {
    this.rightButton.addEventListener('click', () => {
      if (this.isAnimating) return;
      this.scrollRight();
    });
    
    this.leftButton.addEventListener('click', () => {
      if (this.isAnimating) return;
      this.scrollLeft();
    });
  }
  
  scrollRight() {
    if (this.currentIndex >= this.totalCells - this.visibleCount) return;
    
    this.isAnimating = true;
    this.currentIndex++;
    this.updatePosition();
  }
  
  scrollLeft() {
    if (this.currentIndex <= 0) return;
    
    this.isAnimating = true;
    this.currentIndex--;
    this.updatePosition();
  }
  
  updatePosition() {
    const cellWidth = this.cells[0].offsetWidth;
    const translateX = -this.currentIndex * cellWidth;
    this.track.style.transform = `translateX(${translateX}px)`;
  }
  
  updateButtonStates() {
    // Блокуємо ліву кнопку, якщо ми на початку
    if (this.currentIndex <= 0) {
      this.leftButton.disabled = true;
      this.leftButton.style.opacity = '0.5';
    } else {
      this.leftButton.disabled = false;
      this.leftButton.style.opacity = '1';
    }
    
    // Блокуємо праву кнопку, якщо ми в кінці
    if (this.currentIndex >= this.totalCells - this.visibleCount) {
      this.rightButton.disabled = true;
      this.rightButton.style.opacity = '0.5';
    } else {
      this.rightButton.disabled = false;
      this.rightButton.style.opacity = '1';
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Procedures - нескінченний скрол
  new CircularScroller({
    trackSelector: '.js-procedures-track',
    leftButtonSelector: '.js-procedures-arrow-left',
    rightButtonSelector: '.js-procedures-arrow-right',
    visibleCount: 6
  });
  
  // Services - нескінченний скрол
  new CircularScroller({
    trackSelector: '.js-services-track',
    leftButtonSelector: '.js-services-arrow-left',
    rightButtonSelector: '.js-services-arrow-right',
    visibleCount: 4
  });

  // Testimonials - лінійний скрол з блокуванням кнопок
  new LinearScroller({
    trackSelector: '.js-testimonials-track',
    leftButtonSelector: '.js-testimonials-arrow-left',
    rightButtonSelector: '.js-testimonials-arrow-right',
    visibleCount: 1
  });
});