// Объявляете массив с датами, которые хотите сделать недоступными
const customUnavailableDays = [
    "2025-4-15",
"2025-4-21",
"2025-4-22",
"2025-4-23",
"2025-4-24",
"2025-4-25",
"2025-4-26",
"2025-4-27",
"2025-4-28",
"2025-4-29",
"2025-4-30",
"2025-5-1",
"2025-5-2",
"2025-5-3",
"2025-5-4",
"2025-5-5",
"2025-5-6",
"2025-5-7",
"2025-5-8",
"2025-5-9",
"2025-5-10",
"2025-5-11",
"2025-5-21",
"2025-5-22",
"2025-5-23",
"2025-5-24",
"2025-5-25",
"2025-5-26",
"2025-5-27",
"2025-5-28",
"2025-5-29",
"2025-5-30",
"2025-5-31",
"2025-6-1",
"2025-6-2",
"2025-6-3",
"2025-6-4",
"2025-6-5",
"2025-6-6",
"2025-6-7",
"2025-6-8",
"2025-6-9",
"2025-6-10",
"2025-6-20",
"2025-6-21",
"2025-6-22",
"2025-6-23",
"2025-6-24",
"2025-6-25",
"2025-6-26",
"2025-6-27",
"2025-6-28",
"2025-6-29",
"2025-6-30",


    
"2025-7-1",
"2025-7-2",
"2025-7-3",
"2025-7-4",
"2025-7-5",
"2025-7-6",
"2025-7-7",
"2025-7-8",
"2025-7-9",
"2025-7-10",
"2025-7-11",
"2025-7-20",
"2025-7-21",
"2025-7-22",
"2025-7-23",
"2025-7-24",
"2025-7-25",
"2025-7-26",
"2025-7-27",
"2025-7-28",
"2025-7-29",
"2025-7-30",
"2025-7-31",


"2025-8-1",
"2025-8-2",
"2025-8-3",
"2025-8-4",
"2025-8-5",
"2025-8-6",
"2025-8-7",
"2025-8-8",
"2025-8-9",
"2025-8-19",
"2025-8-20",
"2025-8-21",
"2025-8-22",
"2025-8-23",
"2025-8-24",
"2025-8-25",
"2025-8-26",
"2025-8-27",
"2025-8-28",
"2025-8-29",
"2025-8-30",
"2025-8-31",

"2025-9-1",
"2025-9-2",
"2025-9-3",
"2025-9-4",
"2025-9-5",
"2025-9-6",
"2025-9-7",
"2025-9-8",
"2025-9-18",
"2025-9-19",
"2025-9-20",
"2025-9-21",
"2025-9-22",
"2025-9-23",
"2025-9-24",
"2025-9-25",
"2025-9-26",
"2025-9-27",
"2025-9-28",
"2025-9-29",
"2025-9-30"
  
 ];
const unavailableMonths = [ "Октябрь", "Ноябрь", "Декабрь", "Январь", "Февраль", "Март", "Апрель"];


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




