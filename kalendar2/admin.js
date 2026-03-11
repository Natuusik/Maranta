/* ============================================================
   АДМИН-ПАНЕЛЬ С КАЛЕНДАРЁМ И УПРАВЛЕНИЕМ ДНЁМ
   ============================================================ */

const ADMIN_PASSWORD = "1234";
const SECRET_CODE = "adminopen";
let typedAdmin = "";

/* ---------- СОХРАНЕНИЕ ---------- */

function saveAll() {
  localStorage.setItem("busyTimes", JSON.stringify(busyTimes));
  localStorage.setItem("closedTimes", JSON.stringify(closedTimes));
  localStorage.setItem("closedDays", JSON.stringify(closedDays));
  localStorage.setItem("timeOptions", JSON.stringify(timeOptions));
  localStorage.setItem("procedures", JSON.stringify(procedures));
}

/* ---------- ПРОЦЕДУРЫ ---------- */

let procedures = JSON.parse(localStorage.getItem("procedures") || "[]");
if (procedures.length === 0) {
  procedures = [
    "Психологическая консультация",
    "Антицеллюлитный массаж",
    "Аромамассаж",
    "Классический массаж"
  ];
}

/* ---------- МОДАЛЬНОЕ ОКНО АДМИНА ---------- */

const adminPanel = document.createElement("div");
adminPanel.style = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

adminPanel.innerHTML = `
  <div style="
    background:white;
    width:95%;
    max-width:900px;
    padding:20px;
    border-radius:15px;
    max-height:90%;
    overflow-y:auto;
  ">
    <h2 style="text-align:center;">Админ‑панель</h2>

    <div id="adminCalendarContainer"></div>

    <hr>

    <div id="dayManager" style="display:none;">
      <h3 id="dayTitle"></h3>

      <button id="closeDayBtn" style="padding:8px 12px;">🔒 Закрыть день</button>
      <button id="openDayBtn" style="padding:8px 12px;">🔓 Открыть день</button>

      <h3>Времена</h3>
      <table border="1" width="100%" cellpadding="6" style="border-collapse:collapse;">
        <thead>
          <tr>
            <th>Время</th>
            <th>Статус</th>
            <th>Процедура</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody id="timeTable"></tbody>
      </table>

      <h3>Добавить время</h3>
      <input id="newTimeInput" type="text" placeholder="Например 12:00" style="padding:6px;">
      <button id="addTimeBtn">Добавить</button>

      <h3>Управление процедурами</h3>
      <input id="newProcedureInput" type="text" placeholder="Новая процедура" style="padding:6px;">
      <button id="addProcedureBtn">Добавить</button>

      <h4>Удалить процедуру</h4>
      <select id="deleteProcedureSelect" style="padding:6px;"></select>
      <button id="deleteProcedureBtn">Удалить</button>
    </div>

    <hr>
    <button id="adminClose" style="padding:10px 20px; background:#ccc;">Закрыть</button>
  </div>
`;

document.body.appendChild(adminPanel);

/* ---------- СЕКРЕТНЫЙ ВХОД ---------- */

document.addEventListener("keydown", (e) => {
  typedAdmin += e.key.toLowerCase();
  if (typedAdmin.length > 20) typedAdmin = typedAdmin.slice(-20);

  if (typedAdmin.includes(SECRET_CODE)) {
    const pass = prompt("Введите пароль администратора:");
    if (pass === ADMIN_PASSWORD) {
      openAdminPanel();
    } else {
      alert("Неверный пароль");
    }
    typedAdmin = "";
  }
});

/* ---------- ОТКРЫТИЕ АДМИН-ПАНЕЛИ ---------- */

function openAdminPanel() {
  adminPanel.style.display = "flex";
  renderAdminCalendar();
  fillProcedureDeleteList();
}

/* ---------- ЗАКРЫТИЕ ---------- */

document.getElementById("adminClose").onclick = () => {
  adminPanel.style.display = "none";
};

/* ============================================================
   КАЛЕНДАРЬ В АДМИН-ПАНЕЛИ
   ============================================================ */

let adminMonth = new Date().getMonth();
let adminYear = new Date().getFullYear();

function renderAdminCalendar() {
  const container = document.getElementById("adminCalendarContainer");
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "calendar-container";
  wrapper.style.width = "100%";

  wrapper.innerHTML = `
    <h2>${months[adminMonth]} ${adminYear}</h2>

    <div class="calendar-header">
      <button id="adminPrevMonth">‹</button>
      <button id="adminNextMonth">›</button>
    </div>

    <div class="weekdays">
      <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
    </div>

    <div id="adminCalendarDays" class="calendar-days"></div>
  `;

  container.appendChild(wrapper);

  document.getElementById("adminPrevMonth").onclick = () => {
    adminMonth = (adminMonth - 1 + 12) % 12;
    if (adminMonth === 11) adminYear--;
    renderAdminCalendar();
  };

  document.getElementById("adminNextMonth").onclick = () => {
    adminMonth = (adminMonth + 1) % 12;
    if (adminMonth === 0) adminYear++;
    renderAdminCalendar();
  };

  fillAdminDays();
}

function fillAdminDays() {
  const firstDay = (new Date(adminYear, adminMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(adminYear, adminMonth + 1, 0).getDate();

  const calendarDays = document.getElementById("adminCalendarDays");
  calendarDays.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    calendarDays.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const el = document.createElement("div");
    el.classList.add("day");

    const key = formatKey(day, adminMonth, adminYear);

    if (closedDays.includes(key)) {
      el.classList.add("unavailable");
    } else {
      el.classList.add("available");
    }

    el.textContent = day;
    el.onclick = () => openDayManager(day, adminMonth, adminYear);

    calendarDays.appendChild(el);
  }
}

/* ============================================================
   ОКНО УПРАВЛЕНИЯ ДНЁМ
   ============================================================ */

function openDayManager(day, month, year) {
  const key = formatKey(day, month, year);

  document.getElementById("dayManager").style.display = "block";
  document.getElementById("dayTitle").textContent =
    `Управление днём: ${formatDisplay(day, month, year)}`;

  renderTimeTable(key);

  document.getElementById("closeDayBtn").onclick = () => {
    if (!closedDays.includes(key)) closedDays.push(key);
    saveAll();
    renderAdminCalendar();
    openDayManager(day, month, year);
  };

  document.getElementById("openDayBtn").onclick = () => {
    closedDays = closedDays.filter(d => d !== key);
    delete closedTimes[key];
    saveAll();
    renderAdminCalendar();
    openDayManager(day, month, year);
  };

  document.getElementById("addTimeBtn").onclick = () => {
    const t = document.getElementById("newTimeInput").value.trim();
    if (!t) return alert("Введите время");
    if (!timeOptions.includes(t)) timeOptions.push(t);
    saveAll();
    openDayManager(day, month, year);
  };

  document.getElementById("addProcedureBtn").onclick = () => {
    const p = document.getElementById("newProcedureInput").value.trim();
    if (!p) return alert("Введите название");
    procedures.push(p);
    saveAll();
    fillProcedureDeleteList();
    openDayManager(day, month, year);
  };

  document.getElementById("deleteProcedureBtn").onclick = () => {
    const p = document.getElementById("deleteProcedureSelect").value;
    procedures = procedures.filter(x => x !== p);
    saveAll();
    fillProcedureDeleteList();
    openDayManager(day, month, year);
  };
}

/* ---------- СПИСОК ПРОЦЕДУР ДЛЯ УДАЛЕНИЯ ---------- */

function fillProcedureDeleteList() {
  const sel = document.getElementById("deleteProcedureSelect");
  sel.innerHTML = "";
  procedures.forEach(p => {
    const o = document.createElement("option");
    o.textContent = p;
    sel.appendChild(o);
  });
}

/* ============================================================
   ТАБЛИЦА ВРЕМЁН
   ============================================================ */

function renderTimeTable(dateKey) {
  const tbody = document.getElementById("timeTable");
  tbody.innerHTML = "";

  const busy = busyTimes[dateKey] || [];
  const closed = closedTimes[dateKey] || [];

  timeOptions.forEach(time => {
    const tr = document.createElement("tr");

    let status = "свободно";
    if (busy.includes(time)) status = "занято";
    if (closed.includes(time)) status = "закрыто";

    let procedure = "";
    if (busy.includes(time)) {
      procedure = "— (занято клиентом)";
    } else {
      procedure = localStorage.getItem(`proc_${dateKey}_${time}`) || "—";
    }

    tr.innerHTML = `
      <td>${time}</td>
      <td>${status}</td>
      <td>${procedure}</td>
    <td>
  <button class="editProc">Процедура</button>
  <button class="freeTime">Освободить</button>
  <button class="closeTime">Закрыть</button>
  <button class="openTime">Открыть</button>
  <button class="deleteTime">Удалить</button>
</td> `;
// КНОПКА: изменить процедуру
// КНОПКА: изменить процедуру
tr.querySelector(".editProc").onclick = () => {
  if (busy.includes(time)) return alert("Нельзя менять процедуру — время занято клиентом");
  const p = prompt("Введите процедуру:", procedure === "—" ? "" : procedure);
  if (p) {
    localStorage.setItem(`proc_${dateKey}_${time}`, p);
    saveAll();
    renderTimeTable(dateKey);
  }
};

// КНОПКА: освободить время
tr.querySelector(".freeTime").onclick = () => {
  // удаляем из занятых
  if (busyTimes[dateKey]) {
    busyTimes[dateKey] = busyTimes[dateKey].filter(t => t !== time);
    if (busyTimes[dateKey].length === 0) delete busyTimes[dateKey];
  }

  // удаляем процедуру
  localStorage.removeItem(`proc_${dateKey}_${time}`);

  // если день был закрыт — открываем
  if (closedDays.includes(dateKey)) {
    closedDays = closedDays.filter(d => d !== dateKey);
  }

  saveAll();
  renderTimeTable(dateKey);

  // обновляем календарь клиента
  if (typeof renderCalendar === "function") {
    renderCalendar(currentMonth, currentYear);
  }
};

// КНОПКА: закрыть время
tr.querySelector(".closeTime").onclick = () => {
  if (!closedTimes[dateKey]) closedTimes[dateKey] = [];
  if (!closedTimes[dateKey].includes(time)) closedTimes[dateKey].push(time);
  saveAll();
  renderTimeTable(dateKey);
};

// КНОПКА: открыть время
tr.querySelector(".openTime").onclick = () => {
  if (closedTimes[dateKey]) {
    closedTimes[dateKey] = closedTimes[dateKey].filter(t => t !== time);
    if (closedTimes[dateKey].length === 0) delete closedTimes[dateKey];
  }
  saveAll();
  renderTimeTable(dateKey);
};

// КНОПКА: удалить время
tr.querySelector(".deleteTime").onclick = () => {
  timeOptions = timeOptions.filter(t => t !== time);
  saveAll();
  renderTimeTable(dateKey);
};

tbody.appendChild(tr);
  });
} 
async function saveData(data) {
    await fetch("https://maranta.gt.tc/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    alert("Сохранено!");
}
// ...твой существующий код календаря...

async function saveData(data) {
    await fetch("https://maranta.gt.tc/save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    alert("Сохранено!");
}

async function loadData() {
    const res = await fetch("https://maranta.gt.tc/data.json");
    return await res.json();
}
