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
