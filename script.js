let contactform = document.getElementById("contact-form"),
    contactMessage = document.getElementById("contact-messaged");

let sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm("service_g0sa2qd", "template_lh9c9lk", "#contact-form", "j0GMCzh00C868w-Yg")
    .then(() => {
      contactMessage.textContent = "В ближайшее время наш менеджер свяжется с Вами";
      contactMessage.style.display = "block"; // Отобразить сообщение

      setTimeout(() => {
        contactform.reset(); // Очистить поля через небольшую задержку после успешной отправки
      }, 1000);
    })
    .catch((error) => {
      console.error("Ошибка при отправке письма:", error);
    });
}

contactform.addEventListener("submit", sendEmail);
