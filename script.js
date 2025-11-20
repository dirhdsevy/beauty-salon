class InfiniteScroller {
  constructor(options) {
    this.container = document.querySelector(options.containerSelector);
    this.leftButton = document.querySelector(options.leftButtonSelector);
    this.rightButton = document.querySelector(options.rightButtonSelector);
    this.cellSelector = options.cellSelector;
    
    this.cells = Array.from(this.container.querySelectorAll(this.cellSelector));
    this.isAnimating = false;
    this.currentIndex = 0;
    this.visibleCount = options.visibleCount;
    this.totalCells = this.cells.length;
    
    this.cellWidth = this.calculateCellWidth();
    this.init();
  }
  
  calculateCellWidth() {
    if (this.cells.length > 0) {
      const firstCell = this.cells[0];
      const style = window.getComputedStyle(firstCell);
      const margin = parseInt(style.marginLeft) + parseInt(style.marginRight);
      return firstCell.offsetWidth + margin;
    }
    return 100;
  }
  
  init() {
    this.bindEvents();
    this.updateContainerPosition();
  }
  
  bindEvents() {
    this.rightButton.addEventListener('click', () => {
      this.scrollRight();
    });
    
    this.leftButton.addEventListener('click', () => {
      this.scrollLeft();
    });
    
    window.addEventListener('resize', () => {
      this.cellWidth = this.calculateCellWidth();
      this.updateContainerPosition();
    });
  }
  
  scrollRight() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    this.currentIndex++;
    
    if (this.currentIndex > this.totalCells - this.visibleCount) {
      setTimeout(() => {
        this.currentIndex = 0;
        this.updateContainerPosition(false);
        this.isAnimating = false;
      }, 500);
    }
    
    this.updateContainerPosition(true);
    
    setTimeout(() => {
      if (this.currentIndex <= this.totalCells - this.visibleCount) {
        this.isAnimating = false;
      }
    }, 500);
  }
  
  scrollLeft() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    this.currentIndex--;
    
    if (this.currentIndex < 0) {
      setTimeout(() => {
        this.currentIndex = this.totalCells - this.visibleCount;
        this.updateContainerPosition(false);
        this.isAnimating = false;
      }, 500);
    }
    
    this.updateContainerPosition(true);
    
    setTimeout(() => {
      if (this.currentIndex >= 0) {
        this.isAnimating = false;
      }
    }, 500);
  }
  
  updateContainerPosition(animate = true) {
    const translateX = -this.currentIndex * this.cellWidth;
    
    if (animate) {
      this.container.style.transition = 'transform 0.5s ease-in-out';
    } else {
      this.container.style.transition = 'none';
    }
    
    this.container.style.transform = `translateX(${translateX}px)`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new InfiniteScroller({
    containerSelector: '.procedures-scroll-section .scroll-middle',
    leftButtonSelector: '.procedures-scroll-section .js-procedures-arrow-left',
    rightButtonSelector: '.procedures-scroll-section .js-procedures-arrow-right',
    cellSelector: '.procedures-scroll-cell',
    visibleCount: 6
  });
  
  new InfiniteScroller({
    containerSelector: '.services-scroll',
    leftButtonSelector: '.services-section .scroll-button-left',
    rightButtonSelector: '.services-section .scroll-button-right',
    cellSelector: '.services-scroll-cell',
    visibleCount: 4
  });
});