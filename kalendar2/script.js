let contactform = document.getElementById("contact-form"),
    contactMessage = document.getElementById("contact-messaged");

let sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm("service_g0sa2qd", "template_lh9c9lk", "#contact-form", "b3xbpTDoJ6HkcBCLw")
    .then(() => {
      contactMessage.textContent = "В ближайшее время наш менеджер свяжется с Вами";
      contactMessage.style.display = "block"; // Отобразить сообщение

      setTimeout(() => {
        contactform.reset(); // Очистить поля через небольшую задержку после успешной отправки
      }, );
    })
    .catch((error) => {
      console.error("Ошибка при отправке письма:", error);
    });
}

contactform.addEventListener("submit", sendEmail);

document.addEventListener("DOMContentLoaded", () => {
  let navbar = document.querySelector(".header .navbar");
  let menu = document.querySelector("#menu");
  let menuLinks = document.querySelectorAll(".header .navbar a");

  menu.onclick = () => {
    navbar.classList.toggle("active");
  };

  menuLinks.forEach(link => {
    link.onclick = () => {
      navbar.classList.remove("active"); // Закрываем меню
    };
  });
});
const images = document.querySelectorAll(".image-stack img");
let currentIndex = 0;
let intervalId;
let isPaused = false; // Переменная для отслеживания паузы

function changeImage() {
  if (isPaused) return; // Если пауза включена, не меняем изображение
  
  images[currentIndex].style.opacity = "0";
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].style.opacity = "1";
}

// Запуск автосмены изображений каждые 3 секунды
intervalId = setInterval(changeImage, 3000);

// Останавливаем смену при наведении мыши
document.querySelector(".image-stack").addEventListener("mouseenter", () => {
  isPaused = true;
});

// Возобновляем смену после убирания курсора
document.querySelector(".image-stack").addEventListener("mouseleave", () => {
  isPaused = false;
});
