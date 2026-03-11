if (localStorage.getItem("dataVersion") !== "3") {
  localStorage.clear();
  localStorage.setItem("dataVersion", "3");
}

/* ---------- ДАННЫЕ ---------- */

let timeOptions = ["10:00","11:30","13:00","14:30","17:00","18:30","20:00"];

let busyTimes = {};
let closedTimes = {};
let closedDays = [];

(async () => {
    const data = await loadData();

    busyTimes = data.busyTimes || {};
    closedTimes = data.closedTimes || {};
    closedDays = data.closedDays || [];

    if (typeof renderCalendar === "function") {
        renderCalendar(currentMonth, currentYear);
    }
})();

const months = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let selectedTime = null;

/* ---------- ВСПОМОГАТЕЛЬНЫЕ ---------- */

function formatDisplay(day, month, year) {
  return `${String(day).padStart(2,"0")}.${String(month+1).padStart(2,"0")}.${year}`;
}

function formatKey(day, month, year) {
  return `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

/* ---------- РЕНДЕР КАЛЕНДАРЯ ---------- */

function renderCalendar(month, year) {
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = document.getElementById("calendarDays");
  const monthName = document.getElementById("monthName");

  calendarDays.innerHTML = "";
  monthName.textContent = `${months[month]} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    calendarDays.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const el = document.createElement("div");
    el.classList.add("day");

    const key = formatKey(day, month, year);

    if (closedDays.includes(key)) {
      el.classList.add("unavailable");
      el.textContent = day;
    } else {
      el.classList.add("available");
      el.textContent = day;
      el.onclick = () => selectDay(el, day, month, year);
    }

    calendarDays.appendChild(el);
  }

  updateButtonState();
}

/* ---------- ВЫБОР ДНЯ ---------- */

function selectDay(el, day, month, year) {
  document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
  el.classList.add("selected");

  selectedDate = formatDisplay(day, month, year);
  selectedTime = null;

  const dateKey = formatKey(day, month, year);

  document.getElementById("selectedInfo").style.display = "block";
  document.getElementById("selectedDateText").textContent =
    `Вы выбрали дату: ${selectedDate}`;

  showAvailableTimes(dateKey);
  updateButtonState();
}

/* ---------- ВРЕМЯ ---------- */

function showAvailableTimes(dateKey) {
  const container = document.getElementById("timeContainer");
  const timeButtons = document.getElementById("timeButtons");

  timeButtons.innerHTML = "";
  container.style.display = "block";

  const busy = busyTimes[dateKey] || [];
  const closed = closedTimes[dateKey] || [];

  const freeTimes = timeOptions.filter(t => {
    return !busy.includes(t) && !closed.includes(t);
  });

  if (freeTimes.length === 0) {
    if (!closedDays.includes(dateKey)) {
      closedDays.push(dateKey);
    }
  }

  timeOptions.forEach(time => {
    const btn = document.createElement("button");
    btn.textContent = time;

    if (closed.includes(time)) {
      btn.style.background = "#ffdddd";
      btn.disabled = true;
    } else if (busy.includes(time)) {
      btn.style.background = "#ffd4aa";
      btn.disabled = true;
    } else {
      btn.style.background = "#e8ffe8";
      btn.onclick = () => {
        selectedTime = time;

        document.querySelectorAll("#timeButtons button").forEach(b => {
          b.style.background = "#e8ffe8";
          b.style.color = "black";
        });

        btn.style.background = "#4caf50";
        btn.style.color = "white";

        updateButtonState();
      };
    }

    timeButtons.appendChild(btn);
  });
}

/* ---------- КНОПКА ---------- */

function updateButtonState() {
  const procedure = document.getElementById("procedureSelect").value;
  const btn = document.getElementById("goToFormBtn");

  if (procedure && selectedDate && selectedTime) {
    btn.classList.remove("disabled");
    btn.disabled = false;
  } else {
    btn.classList.add("disabled");
    btn.disabled = true;
  }
}

/* ---------- WHATSAPP ---------- */

document.getElementById("goToFormBtn").onclick = () => {
  const procedure = document.getElementById("procedureSelect").value;

  const phone = "37255541468";

  const message =
  "Здравствуйте! Хочу записаться на процедуру: " + procedure + ", " + selectedDate + " в " + selectedTime +
  ".\n\n```Пожалуйста, дождитесь моего подтверждения.\nБез подтверждения запись не считается активной\nи процедура не состоится.```";

  const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
  window.location.href = url;

  setTimeout(() => {
    alert("Заявка отправлена! Пожалуйста, дождитесь подтверждения от номера +372 5565 2033. Без подтверждения процедура не состоится.");
  }, 500);
};

/* ---------- ПЕРЕКЛЮЧЕНИЕ МЕСЯЦЕВ ---------- */

document.getElementById("nextMonth").onclick = () => {
  currentMonth = (currentMonth + 1) % 12;
  if (currentMonth === 0) currentYear++;
  renderCalendar(currentMonth, currentYear);
};

document.getElementById("prevMonth").onclick = () => {
  currentMonth = (currentMonth - 1 + 12) % 12;
  if (currentMonth === 11) currentYear--;
  renderCalendar(currentMonth, currentYear);
};

/* ---------- ИНИЦИАЛИЗАЦИЯ ---------- */

document.getElementById("procedureSelect").addEventListener("change", updateButtonState);
renderCalendar(currentMonth, currentYear);

let savedProcedures = JSON.parse(localStorage.getItem("procedures") || "null");
if (savedProcedures) {
  const select = document.getElementById("procedureSelect");
  select.innerHTML = '<option value="">Выберите процедуру</option>';
  savedProcedures.forEach(p => {
    const opt = document.createElement("option");
    opt.textContent = p;
    select.appendChild(opt);
  });
}

async function loadData() {
    const res = await fetch("https://maranta.gt.tc/data.json");
    return await res.json();
}
