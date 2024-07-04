// const menus = document.querySelectorAll('.menu');
// const paragraphs = document.querySelectorAll('.paragraph');
// const backgrounds = document.querySelectorAll('.background');
// const contents = document.querySelectorAll('.content');

// let currentIndex = 0;
// let intervalId;

// function updateContent(index) {
//   menus.forEach((menu, idx) => menu.classList.toggle('active', idx === index));
//   paragraphs.forEach((para, idx) => para.classList.toggle('active', idx === index));
//   backgrounds.forEach((bg, idx) => bg.style.display = idx === index ? 'block' : 'none');
//   contents.forEach((content, idx) => content.style.display = idx === index ? 'flex' : 'none');
// }

// function startAutoChange() {
//   intervalId = setInterval(() => {
//     currentIndex = (currentIndex + 1 ) % menus.length;
//     updateContent(currentIndex);
//   }, 5000);
// }

// function stopAutoChange() {
//   clearInterval(intervalId);
// }

// menus.forEach((menu, index) => {
//   menu.addEventListener('click', () => {
//     stopAutoChange();
//     currentIndex = index;
//     updateContent(index);
//     startAutoChange();
//   });

//   menu.addEventListener('mouseover', stopAutoChange);
//   menu.addEventListener('mouseout', startAutoChange);
// });

// paragraphs.forEach((para) => {
//   para.addEventListener('mouseover', stopAutoChange);
//   para.addEventListener('mouseout', startAutoChange);
// });


// updateContent(currentIndex);
// startAutoChange();



const menus = document.querySelectorAll('.menu');
const paragraphs = document.querySelectorAll('.paragraph');
const backgrounds = document.querySelectorAll('.background');
const contents = document.querySelectorAll('.content');

let currentIndex = 0;
let intervalId;

function updateContent(index) {
  menus.forEach((menu, idx) => menu.classList.toggle('active', idx === index));
  paragraphs.forEach((para, idx) => para.classList.toggle('active', idx === index));
  backgrounds.forEach((bg, idx) => bg.style.display = idx === index ? 'block' : 'none');
  contents.forEach((content, idx) => content.style.display = idx === index ? 'flex' : 'none');
}

// function startAutoChange() {
//   if (!intervalId) {
//     intervalId = setInterval(() => {
//       currentIndex = (currentIndex + 1) % menus.length;
//       updateContent(currentIndex);
//     }, 22000);
//   }
// }

function stopAutoChange() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

menus.forEach((menu, index) => {
  menu.addEventListener('click', () => {
    stopAutoChange();
    currentIndex = index;
    updateContent(index);
    startAutoChange();
  });

  menu.addEventListener('mouseover', stopAutoChange);
  menu.addEventListener('mouseout', startAutoChange);
});

paragraphs.forEach((para) => {
  para.addEventListener('mouseover', stopAutoChange);
  para.addEventListener('mouseout', startAutoChange);
});

// Ensure the first content is shown by default
updateContent(currentIndex);
startAutoChange();




// Mobile menu Toogle script

document.getElementById('mobile-nav').addEventListener('click', function() {
  var secondDiv = document.getElementById('menus1');
  if (secondDiv.style.display === 'none' || secondDiv.style.display === '') {
      secondDiv.style.display = 'block';
  } else {
      secondDiv.style.display = 'none';
  }
});



//Card Slide animation
   // Function to check if an element is in the viewport
   function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to handle animations
function handleAnimation() {
    var columns = document.querySelectorAll('.feature-item,.classes-item');
    columns.forEach(function(column) {
        if (isInViewport(column)) {
            // Add animation class based on column position
            if (column.classList.contains('first-feature')) {
                column.classList.add('slide-left');
            } else if (column.classList.contains('second-feature')) {
                column.classList.add('slide-right');
            } else if (column.classList.contains('third-feature')) {
                column.classList.add('slide-left');
            }
        }
    });
}

// Add event listener for scrolling to trigger animations
window.addEventListener('scroll', handleAnimation);
// Trigger animations on page load
handleAnimation();


// Owl carosaul Script
$('.owl-carousel').owlCarousel({
  loop:false,
  margin:10,
  dots:false,
  nav:true,
  mouseDrag:false,
  autoplay:false,
  animateOut: 'slideOutUp',
  responsive:{
      0:{
          items:1
      },
      600:{
          items:1
      },
      1000:{
          items:1
      }
  }
});