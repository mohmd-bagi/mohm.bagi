function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

window.addEventListener("scroll", function () {
  const scrollBtn = document.getElementById("scrollTop");
  if (window.scrollY > 200) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});