const scrollDownArrow = document.getElementById('scroll-down-arrow');
const nextSection = document.getElementById('about');

scrollDownArrow.addEventListener('click', function() {
  nextSection.scrollIntoView({behavior: "smooth"});
});