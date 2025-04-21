document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menu");
  const navbar = document.querySelector(".header .navbar");
  const menuLinks = navbar.querySelectorAll("a");

  // Переключение видимости меню
  menuButton.addEventListener("click", function () {
    navbar.classList.toggle("active");
  });

  // Закрытие меню при выборе пункта
  menuLinks.forEach(link => {
    link.addEventListener("click", function () {
      navbar.classList.remove("active");
    });
  });
});
