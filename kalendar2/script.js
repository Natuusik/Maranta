// Объявляете массив с датами, которые хотите сделать недоступными
const customUnavailableDays = [

    "2025-12-1",
"2025-12-2",
"2025-12-3",
"2025-12-4",
"2025-12-5",
"2025-12-6",
"2025-12-7",
"2025-12-17",
"2025-12-18",
"2025-12-19",
"2025-12-20",
"2025-12-21",
"2025-12-22",   
"2025-12-23",
"2025-12-24",
"2025-12-25",
"2025-12-26",
"2025-12-27",
"2025-12-28",
"2025-12-29",
"2025-12-30",
"2025-12-31"
  
 ];
const unavailableMonths = [  "Январь", "Февраль", "Март", "Апрель","Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь"]; // Пример недоступных месяцев


  // Количество доступных временных слотов (например, если у вас три варианта: 10:00, 11:00 и 12:00)
const TIME_OPTIONS_COUNT = 7;

// Примеры массивов для календаря
const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
 "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];


const availableMonths = months.filter(month => month !== "Июль");

console.log(availableMonths);

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(month, year) {
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    const calendarDays = document.getElementById("calendarDays");
    const monthName = document.getElementById("monthName");
  
    calendarDays.innerHTML = "";
    monthName.textContent = `${months[month]} ${year}`;
  
    // Загружаем объект забронированных времён из localStorage
    const bookedTimes = JSON.parse(localStorage.getItem("bookedTimes")) || {};
  
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement("div");
      calendarDays.appendChild(emptyCell);
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day", "available");
      dayElement.textContent = day;
  
      const currentDate = `${year}-${month + 1}-${day}`;
  
      // ❌ Проверяем предустановленные недоступные даты
      if (customUnavailableDays.includes(currentDate)) {
        dayElement.classList.remove("available");
        dayElement.classList.add("unavailable");
        dayElement.addEventListener("click", () => {
          alert("Эта дата недоступна для записи.");
        });
      }
  
      // ❌ Проверяем, забронированы ли ВСЕ слоты на этот день
      else if (bookedTimes[currentDate] && bookedTimes[currentDate].length >= TIME_OPTIONS_COUNT) {
        dayElement.classList.remove("available");
        dayElement.classList.add("unavailable");
        dayElement.addEventListener("click", () => {
          alert("Время для этой даты закончилось.");
        });
      }
  
      // ✅ Если день доступен, назначаем стандартный обработчик
      else {
        dayElement.addEventListener("click", () => toggleAvailability(dayElement, day, month, year));
      }
  
      calendarDays.appendChild(dayElement);
    }
  }


  

function toggleAvailability(dayElement, day, month, year) {
  // Переключаем классы: available <-> unavailable (если пользователь изменяет выбор, можно добавить логику отмены)
  dayElement.classList.toggle("available");
  dayElement.classList.toggle("unavailable");

  const formattedDay = String(day).padStart(2, '0'); // Добавляет 0 перед однозначным числом
const formattedMonth = String(month + 1).padStart(2, '0'); // То же самое для месяца
const selectedDate = `${formattedDay}.${formattedMonth}.${year}`; // Формат 03.05.2025


  if (dayElement.classList.contains("unavailable")) {
    // Переход на форму регистрации с передачей выбранной даты
    window.location.href = `2.html?date=${selectedDate}`;
  }
}

// Обработчики переключения месяцев
document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth = (currentMonth + 1) % 12;
  if (currentMonth === 0) currentYear++;
  renderCalendar(currentMonth, currentYear);
});

document.getElementById("prevMonth").addEventListener("click", () => {
  currentMonth = (currentMonth - 1 + 12) % 12;
  if (currentMonth === 11) currentYear--;
  renderCalendar(currentMonth, currentYear);
});
function renderCalendar(month, year) {
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = document.getElementById("calendarDays");
    const monthName = document.getElementById("monthName");

    calendarDays.innerHTML = ""; // Очищаем календарь
    monthName.textContent = `${months[month]} ${year}`; // Обновляем заголовок месяца

    const formattedMonth = months[month]; // Получаем название месяца

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement("div");
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");

        const currentDate = `${year}-${month + 1}-${day}`;
        
        // 🔴 Если месяц недоступен, делаем все дни красными
        if (unavailableMonths.includes(formattedMonth)) {
            dayElement.classList.add("unavailable");
            dayElement.textContent = day;
            dayElement.addEventListener("click", () => {
                alert(`Регистрация на ${formattedMonth} недоступна.`);
            });
        }
        // 🔴 Проверяем, если дата недоступна
        else if (customUnavailableDays.includes(currentDate)) {
            dayElement.classList.add("unavailable");
            dayElement.textContent = day;
            dayElement.addEventListener("click", () => {
                alert("Эта дата недоступна для записи.");
            });
        } else {
            dayElement.classList.add("available");
            dayElement.textContent = day;
            dayElement.addEventListener("click", () => toggleAvailability(dayElement, day, month, year));
        }

        calendarDays.appendChild(dayElement);
    }
}

// Загружаем календарь при старте
renderCalendar(currentMonth, currentYear);




