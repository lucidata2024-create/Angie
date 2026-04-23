document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEYS = {
    workoutCompletions: "glowfit_workout_completions",
    foodLogs: "glowfit_food_logs",
    selectedWorkoutDate: "glowfit_selected_workout_date",
    selectedFoodDate: "glowfit_selected_food_date",
    activeSection: "glowfit_active_section",
  };

  const DAY_TYPES = {
    workout: "Workout",
    cardio: "Cardio / Walk",
    rest: "Rest Day",
  };

  const WEEK_PLAN = {
    1: { type: "workout", workoutDay: 1 }, // Monday
    2: { type: "workout", workoutDay: 2 }, // Tuesday
    3: { type: "cardio" }, // Wednesday
    4: { type: "workout", workoutDay: 3 }, // Thursday
    5: { type: "workout", workoutDay: 4 }, // Friday
    6: { type: "cardio" }, // Saturday
    0: { type: "rest" }, // Sunday
  };

  const WORKOUTS = {
    1: {
      title: "Day 1",
      rounds: "Circuit x 3 rounds",
      rest: "Rest 1–2 min between rounds",
      exercises: [
        "Squat – 10 reps",
        "Wall Push-Ups – 10 reps",
        "Glute Bridge – 12 reps",
        "March in Place (High Knees) – 30 sec",
        "Knee Plank – 15 sec",
      ],
    },
    2: {
      title: "Day 2",
      rounds: "Circuit x 3 rounds",
      rest: "Keep a smooth pace and controlled breathing",
      exercises: [
        "Step Jacks – 30 sec",
        "Knee Raises – 30 sec",
        "Side Bends – 12 each side",
        "Toe Touches (seated) – 10 reps",
        "Fast March in Place – 1 min",
      ],
    },
    3: {
      title: "Day 3",
      rounds: "Circuit x 3 rounds",
      rest: "Rest 1–2 min between rounds",
      exercises: [
        "Chair Squat – 10 reps",
        "Reverse Lunges (light) – 6 each leg",
        "Glute Bridge Hold – 20 sec",
        "Calf Raises – 12 reps",
        "Wall Sit – 20 sec",
      ],
    },
    4: {
      title: "Day 4",
      rounds: "Circuit x 3 rounds",
      rest: "Rest 1–2 min between rounds",
      exercises: [
        "Wall Push-Ups – 10 reps",
        "Arm Circles – 20 sec",
        "Shadow Boxing – 30 sec",
        "Plank Shoulder Taps (on knees) – 10 reps",
        "Fast March in Place – 1 min",
      ],
    },
  };

  const CARDIO_PLAN = {
    title: "Walking Session",
    duration: "20–40 min walking",
    intensity: "Able to talk, but breathing a bit harder",
    note: "Keep the pace light to moderate and consistent.",
  };

  const REST_PLAN = {
    title: "Complete Rest Day",
    note: "Take a full recovery day. Gentle stretching, hydration, and quality sleep are lovely choices today.",
  };

  const appState = {
    today: startOfDay(new Date()),
    planDays: [],
    calendarMonthDate: null,
    foodRangeStartIndex: 0,
    selectedWorkoutDate: null,
    selectedFoodDate: null,
    activeSection: "dashboard-section",
    workoutCompletions: loadFromStorage(STORAGE_KEYS.workoutCompletions, {}),
    foodLogs: loadFromStorage(STORAGE_KEYS.foodLogs, {}),
  };

  const elements = {
    body: document.body,
    sidebar: document.getElementById("sidebar"),
    menuToggle: document.getElementById("menuToggle"),
    navLinks: [...document.querySelectorAll(".nav-link")],
    sectionJumpButtons: [...document.querySelectorAll("[data-section-jump]")],
    sections: [...document.querySelectorAll(".content-section")],
    pageTitle: document.getElementById("pageTitle"),
    currentDateLabel: document.getElementById("currentDateLabel"),

    heroTodayType: document.getElementById("heroTodayType"),
    heroStreak: document.getElementById("heroStreak"),
    todayTypeBadge: document.getElementById("todayTypeBadge"),
    todayWorkoutStatus: document.getElementById("todayWorkoutStatus"),
    todayStatusDescription: document.getElementById("todayStatusDescription"),
    weeklyWorkoutCount: document.getElementById("weeklyWorkoutCount"),
    weeklyCardioCount: document.getElementById("weeklyCardioCount"),
    foodLoggedCount: document.getElementById("foodLoggedCount"),
    dashboardTodaySummary: document.getElementById("dashboardTodaySummary"),
    dashboardMealsSummary: document.getElementById("dashboardMealsSummary"),

    todayDateHeading: document.getElementById("todayDateHeading"),
    todayMainTypeBadge: document.getElementById("todayMainTypeBadge"),
    todayMainStatusBadge: document.getElementById("todayMainStatusBadge"),
    todayPlanContent: document.getElementById("todayPlanContent"),
    todayMealsPanel: document.getElementById("todayMealsPanel"),
    todayCompleteButton: document.getElementById("todayCompleteButton"),
    todayResetButton: document.getElementById("todayResetButton"),

    workoutMonthLabel: document.getElementById("workoutMonthLabel"),
    workoutPrevMonth: document.getElementById("workoutPrevMonth"),
    workoutNextMonth: document.getElementById("workoutNextMonth"),
    workoutCalendarGrid: document.getElementById("workoutCalendarGrid"),
    selectedDayHeading: document.getElementById("selectedDayHeading"),
    selectedDayTypeBadge: document.getElementById("selectedDayTypeBadge"),
    selectedDayStatusBadge: document.getElementById("selectedDayStatusBadge"),
    selectedDayDetails: document.getElementById("selectedDayDetails"),
    completeSelectedDayButton: document.getElementById("completeSelectedDayButton"),
    resetSelectedDayButton: document.getElementById("resetSelectedDayButton"),

    foodPrevRangeButton: document.getElementById("foodPrevRangeButton"),
    foodNextRangeButton: document.getElementById("foodNextRangeButton"),
    foodRangeLabel: document.getElementById("foodRangeLabel"),
    foodDayList: document.getElementById("foodDayList"),
    foodSelectedDateLabel: document.getElementById("foodSelectedDateLabel"),
    foodSelectedDayType: document.getElementById("foodSelectedDayType"),
    mealForm: document.getElementById("mealForm"),
    mealType: document.getElementById("mealType"),
    waterIntake: document.getElementById("waterIntake"),
    mealText: document.getElementById("mealText"),
    mealNotes: document.getElementById("mealNotes"),
    healthyDay: document.getElementById("healthyDay"),
    clearMealFormButton: document.getElementById("clearMealFormButton"),
    saveMealButton: document.getElementById("saveMealButton"),
    editingMealId: document.getElementById("editingMealId"),
    mealEntriesList: document.getElementById("mealEntriesList"),

    progressWorkoutMetric: document.getElementById("progressWorkoutMetric"),
    progressCardioMetric: document.getElementById("progressCardioMetric"),
    progressFoodMetric: document.getElementById("progressFoodMetric"),
    progressRestMetric: document.getElementById("progressRestMetric"),
    progressStreakNumber: document.getElementById("progressStreakNumber"),
    progressMotivationMessage: document.getElementById("progressMotivationMessage"),
    upcomingWeekPreview: document.getElementById("upcomingWeekPreview"),

    dayModal: document.getElementById("dayModal"),
    dayModalTitle: document.getElementById("dayModalTitle"),
    dayModalBody: document.getElementById("dayModalBody"),
    closeDayModalButton: document.getElementById("closeDayModalButton"),
    modalCompleteDayButton: document.getElementById("modalCompleteDayButton"),
    modalResetDayButton: document.getElementById("modalResetDayButton"),
    toastContainer: document.getElementById("toastContainer"),
  };

  init();

  function init() {
    generatePlanDays(120);
    restoreSelections();
    bindEvents();
    updateCurrentDateLabel();
    renderApp();
  }

  function bindEvents() {
    elements.menuToggle.addEventListener("click", toggleSidebar);

    document.addEventListener("click", (event) => {
      const closeModalTrigger = event.target.closest("[data-close-modal='true']");
      if (closeModalTrigger) closeDayModal();

      if (
        window.innerWidth <= 1080 &&
        elements.sidebar.classList.contains("is-open") &&
        !event.target.closest(".sidebar") &&
        !event.target.closest("#menuToggle")
      ) {
        closeSidebar();
      }
    });

    elements.navLinks.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.sectionTarget;
        setActiveSection(target);
        closeSidebar();
      });
    });

    elements.sectionJumpButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.sectionJump;
        if (target) setActiveSection(target);
      });
    });

    elements.workoutPrevMonth.addEventListener("click", () => {
      appState.calendarMonthDate = addMonths(appState.calendarMonthDate, -1);
      renderWorkoutCalendar();
    });

    elements.workoutNextMonth.addEventListener("click", () => {
      appState.calendarMonthDate = addMonths(appState.calendarMonthDate, 1);
      renderWorkoutCalendar();
    });

    elements.completeSelectedDayButton.addEventListener("click", () => {
      if (!appState.selectedWorkoutDate) return;
      markDayCompleted(appState.selectedWorkoutDate, true);
    });

    elements.resetSelectedDayButton.addEventListener("click", () => {
      if (!appState.selectedWorkoutDate) return;
      markDayCompleted(appState.selectedWorkoutDate, false);
    });

    elements.todayCompleteButton.addEventListener("click", () => {
      markDayCompleted(formatDateKey(appState.today), true);
    });

    elements.todayResetButton.addEventListener("click", () => {
      markDayCompleted(formatDateKey(appState.today), false);
    });

    elements.foodPrevRangeButton.addEventListener("click", () => {
      appState.foodRangeStartIndex = Math.max(appState.foodRangeStartIndex - 14, 0);
      renderFoodDayList();
    });

    elements.foodNextRangeButton.addEventListener("click", () => {
      const maxStart = Math.max(appState.planDays.length - 14, 0);
      appState.foodRangeStartIndex = Math.min(appState.foodRangeStartIndex + 14, maxStart);
      renderFoodDayList();
    });

    elements.mealForm.addEventListener("submit", handleMealFormSubmit);
    elements.clearMealFormButton.addEventListener("click", clearMealForm);

    elements.closeDayModalButton.addEventListener("click", closeDayModal);

    elements.modalCompleteDayButton.addEventListener("click", () => {
      const dateKey = elements.dayModal.dataset.dateKey;
      if (!dateKey) return;
      markDayCompleted(dateKey, true);
      closeDayModal();
    });

    elements.modalResetDayButton.addEventListener("click", () => {
      const dateKey = elements.dayModal.dataset.dateKey;
      if (!dateKey) return;
      markDayCompleted(dateKey, false);
      closeDayModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDayModal();
        closeSidebar();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080) closeSidebar();
    });
  }

  function renderApp() {
    renderNavigation();
    renderDashboard();
    renderTodaySection();
    renderWorkoutCalendar();
    renderSelectedWorkoutDay();
    renderFoodDayList();
    renderSelectedFoodDay();
    renderProgress();
  }

  function restoreSelections() {
    const savedWorkoutDate = localStorage.getItem(STORAGE_KEYS.selectedWorkoutDate);
    const savedFoodDate = localStorage.getItem(STORAGE_KEYS.selectedFoodDate);
    const savedSection = localStorage.getItem(STORAGE_KEYS.activeSection);

    const defaultDateKey = formatDateKey(appState.today);

    appState.selectedWorkoutDate = findDateKeyInPlan(savedWorkoutDate) || defaultDateKey;
    appState.selectedFoodDate = findDateKeyInPlan(savedFoodDate) || defaultDateKey;
    appState.activeSection = savedSection || "dashboard-section";

    const selectedWorkoutDay = getPlanDayByDateKey(appState.selectedWorkoutDate);
    appState.calendarMonthDate = selectedWorkoutDay
      ? new Date(selectedWorkoutDay.date)
      : new Date(appState.today);

    const selectedFoodIndex = appState.planDays.findIndex(
      (day) => day.dateKey === appState.selectedFoodDate
    );
    appState.foodRangeStartIndex =
      selectedFoodIndex > 6 ? Math.max(selectedFoodIndex - 6, 0) : 0;
  }

  function renderNavigation() {
    elements.navLinks.forEach((button) => {
      const isActive = button.dataset.sectionTarget === appState.activeSection;
      button.classList.toggle("is-active", isActive);
      if (isActive) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    elements.sections.forEach((section) => {
      section.classList.toggle("is-visible", section.id === appState.activeSection);
    });

    const activeNavButton = elements.navLinks.find(
      (button) => button.dataset.sectionTarget === appState.activeSection
    );
    elements.pageTitle.textContent = activeNavButton
      ? activeNavButton.textContent.trim()
      : "Dashboard";
  }

  function setActiveSection(sectionId) {
    appState.activeSection = sectionId;
    localStorage.setItem(STORAGE_KEYS.activeSection, sectionId);
    renderNavigation();
  }

  function updateCurrentDateLabel() {
    elements.currentDateLabel.textContent = formatDateLong(appState.today);
  }

  function generatePlanDays(totalDays = 120) {
    const days = [];

    for (let i = 0; i < totalDays; i += 1) {
      const date = addDays(appState.today, i);
      const weekday = date.getDay();
      const config = WEEK_PLAN[weekday];
      const dateKey = formatDateKey(date);

      const day = {
        date,
        dateKey,
        weekdayIndex: weekday,
        weekdayLabel: formatWeekday(date),
        shortDateLabel: formatShortDate(date),
        displayLabel: formatDateLong(date),
        type: config.type,
        completed: Boolean(appState.workoutCompletions[dateKey]),
      };

      if (config.type === "workout") {
        day.workoutDay = config.workoutDay;
        day.plan = WORKOUTS[config.workoutDay];
      } else if (config.type === "cardio") {
        day.plan = CARDIO_PLAN;
      } else {
        day.plan = REST_PLAN;
      }

      days.push(day);
    }

    appState.planDays = days;
  }

  function getPlanDayByDateKey(dateKey) {
    return appState.planDays.find((day) => day.dateKey === dateKey) || null;
  }

  function findDateKeyInPlan(dateKey) {
    if (!dateKey) return null;
    return appState.planDays.some((day) => day.dateKey === dateKey) ? dateKey : null;
  }

  function renderDashboard() {
    const todayKey = formatDateKey(appState.today);
    const today = getPlanDayByDateKey(todayKey);
    const weekSummary = getCurrentWeekSummary();
    const foodLoggedTotal = countFoodLoggedDays();
    const streak = calculateCompletionStreak();

    elements.heroTodayType.textContent = getDayTypeLabel(today.type);
    elements.heroStreak.textContent = `${streak} ${streak === 1 ? "day" : "days"}`;

    updateTypeBadge(elements.todayTypeBadge, today.type);
    elements.todayWorkoutStatus.textContent = getStatusHeadline(today);
    elements.todayStatusDescription.textContent = getStatusDescription(today);

    elements.weeklyWorkoutCount.textContent = `${weekSummary.workoutCompleted} / ${weekSummary.workoutTotal}`;
    elements.weeklyCardioCount.textContent = `${weekSummary.cardioCompleted} / ${weekSummary.cardioTotal}`;
    elements.foodLoggedCount.textContent = `${foodLoggedTotal} ${foodLoggedTotal === 1 ? "day" : "days"}`;

    elements.dashboardTodaySummary.innerHTML = createTodaySummaryHTML(today);
    elements.dashboardMealsSummary.innerHTML = createDashboardMealSummaryHTML(todayKey);

    attachDashboardActions();
  }

  function attachDashboardActions() {
    const dashboardCompleteButton = document.querySelector("[data-action='complete-today']");
    const dashboardResetButton = document.querySelector("[data-action='reset-today']");

    if (dashboardCompleteButton) {
      dashboardCompleteButton.addEventListener("click", () => {
        markDayCompleted(formatDateKey(appState.today), true);
      });
    }

    if (dashboardResetButton) {
      dashboardResetButton.addEventListener("click", () => {
        markDayCompleted(formatDateKey(appState.today), false);
      });
    }
  }

  function renderTodaySection() {
    const todayKey = formatDateKey(appState.today);
    const today = getPlanDayByDateKey(todayKey);

    elements.todayDateHeading.textContent = today.displayLabel;
    updateTypeBadge(elements.todayMainTypeBadge, today.type);
    updateStatusBadge(elements.todayMainStatusBadge, today);
    elements.todayPlanContent.innerHTML = createDayDetailsHTML(today, { showMeta: true });

    const foodData = getFoodLogByDate(todayKey);
    elements.todayMealsPanel.innerHTML = createFoodSummaryPanelHTML(foodData, todayKey);

    updateCompletionButtons(today, elements.todayCompleteButton, elements.todayResetButton);
  }

  function renderWorkoutCalendar() {
    const monthDate = appState.calendarMonthDate || new Date(appState.today);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    elements.workoutMonthLabel.textContent = formatMonthYear(monthDate);

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const gridStart = startOfCalendarGrid(monthStart);
    const gridEnd = endOfCalendarGrid(monthEnd);

    const days = [];
    let current = new Date(gridStart);

    while (current <= gridEnd) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }

    elements.workoutCalendarGrid.innerHTML = "";

    days.forEach((date) => {
      const dayData = getPlanDayByDateKey(formatDateKey(date)) || createExternalDay(date, month);
      const button = document.createElement("button");
      button.type = "button";
      button.className = [
        "calendar-day",
        `${dayData.type}-day`,
        isSameDay(date, appState.today) ? "is-today" : "",
        appState.selectedWorkoutDate === dayData.dateKey ? "is-selected" : "",
        dayData.completed ? "is-completed" : "",
        date.getMonth() !== month ? "is-outside-month" : "",
      ]
        .filter(Boolean)
        .join(" ");

      button.setAttribute("aria-label", `${dayData.displayLabel} - ${getDayTypeLabel(dayData.type)}`);

      button.innerHTML = `
        <div class="calendar-day-top">
          <span class="calendar-day-number">${date.getDate()}</span>
          <span class="calendar-mini-tag">${dayData.weekdayLabel}</span>
        </div>
        <p class="calendar-day-label">${getDayTypeLabel(dayData.type)}</p>
        <div class="calendar-day-meta">
          <span class="calendar-mini-tag ${dayData.completed ? "completed-tag" : ""}">
            ${dayData.completed ? "Completed" : dayData.type === "rest" ? "Recovery" : "Planned"}
          </span>
          <span class="calendar-day-note">${getCalendarPreviewText(dayData)}</span>
        </div>
      `;

      button.addEventListener("click", () => {
        if (!getPlanDayByDateKey(dayData.dateKey)) {
          showToast("This date is outside your generated plan.", "warning", "Not available");
          return;
        }

        selectWorkoutDate(dayData.dateKey);
        openDayModal(dayData.dateKey);
      });

      elements.workoutCalendarGrid.appendChild(button);
    });
  }

  function createExternalDay(date) {
    const weekday = date.getDay();
    const config = WEEK_PLAN[weekday];
    const dateKey = formatDateKey(date);

    return {
      date,
      dateKey,
      weekdayIndex: weekday,
      weekdayLabel: formatWeekday(date),
      displayLabel: formatDateLong(date),
      type: config.type,
      completed: false,
      plan:
        config.type === "workout"
          ? WORKOUTS[config.workoutDay]
          : config.type === "cardio"
          ? CARDIO_PLAN
          : REST_PLAN,
    };
  }

  function renderSelectedWorkoutDay() {
    const selectedDay = getPlanDayByDateKey(appState.selectedWorkoutDate);

    if (!selectedDay) {
      elements.selectedDayHeading.textContent = "Choose a day";
      elements.selectedDayDetails.innerHTML = `
        <div class="empty-state">
          <h4>No day selected yet</h4>
          <p>Click any day in the calendar to view the full workout or recovery plan.</p>
        </div>
      `;
      elements.completeSelectedDayButton.disabled = true;
      elements.resetSelectedDayButton.disabled = true;
      return;
    }

    elements.selectedDayHeading.textContent = selectedDay.displayLabel;
    updateTypeBadge(elements.selectedDayTypeBadge, selectedDay.type);
    updateStatusBadge(elements.selectedDayStatusBadge, selectedDay);
    elements.selectedDayDetails.innerHTML = createDayDetailsHTML(selectedDay, { showMeta: true });
    updateCompletionButtons(
      selectedDay,
      elements.completeSelectedDayButton,
      elements.resetSelectedDayButton
    );
  }

  function renderFoodDayList() {
    const visibleDays = appState.planDays.slice(
      appState.foodRangeStartIndex,
      appState.foodRangeStartIndex + 14
    );

    if (!visibleDays.length) {
      elements.foodDayList.innerHTML = `
        <div class="empty-state compact">
          <h4>No visible dates</h4>
          <p>Your food tracker range could not be loaded.</p>
        </div>
      `;
      return;
    }

    const first = visibleDays[0];
    const last = visibleDays[visibleDays.length - 1];
    elements.foodRangeLabel.textContent = `${formatShortDate(first.date)} — ${formatShortDate(last.date)}`;

    elements.foodDayList.innerHTML = "";

    visibleDays.forEach((day) => {
      const log = getFoodLogByDate(day.dateKey);
      const entryCount = log.entries.length;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `food-day-button ${appState.selectedFoodDate === day.dateKey ? "is-active" : ""}`;

      button.innerHTML = `
        <div class="food-day-top">
          <span class="food-date">${day.shortDateLabel}</span>
          <span class="pill ${day.type}">${day.type === "cardio" ? "Cardio" : day.type === "rest" ? "Rest" : "Workout"}</span>
        </div>
        <span class="food-subtext">${day.weekdayLabel} • ${entryCount} ${entryCount === 1 ? "entry" : "entries"}</span>
      `;

      button.addEventListener("click", () => {
        selectFoodDate(day.dateKey);
      });

      elements.foodDayList.appendChild(button);
    });

    elements.foodPrevRangeButton.disabled = appState.foodRangeStartIndex === 0;
    elements.foodNextRangeButton.disabled =
      appState.foodRangeStartIndex + 14 >= appState.planDays.length;
  }

  function renderSelectedFoodDay() {
    const selectedDay = getPlanDayByDateKey(appState.selectedFoodDate);

    if (!selectedDay) {
      elements.foodSelectedDateLabel.textContent = "Select a day to log meals";
      elements.foodSelectedDayType.textContent = "—";
      elements.mealEntriesList.innerHTML = `
        <div class="empty-state">
          <h4>No day selected</h4>
          <p>Please choose a day from the left to manage meals.</p>
        </div>
      `;
      return;
    }

    elements.foodSelectedDateLabel.textContent = selectedDay.displayLabel;
    updateTypeBadge(elements.foodSelectedDayType, selectedDay.type);

    const log = getFoodLogByDate(selectedDay.dateKey);
    renderMealEntries(log.entries);

    if (!elements.editingMealId.value) {
      elements.waterIntake.value = log.hydration ?? "";
      elements.healthyDay.checked = Boolean(log.healthyDay);
    }
  }

  function renderMealEntries(entries) {
    if (!entries.length) {
      elements.mealEntriesList.innerHTML = `
        <div class="empty-state">
          <h4>No meals logged for this day</h4>
          <p>Add breakfast, lunch, dinner, snacks, hydration, and notes to build a clear nutrition history.</p>
        </div>
      `;
      return;
    }

    const sortedEntries = [...entries].sort((a, b) => b.createdAt - a.createdAt);

    elements.mealEntriesList.innerHTML = sortedEntries
      .map(
        (entry) => `
          <article class="meal-entry-card" data-entry-id="${entry.id}">
            <div class="meal-entry-head">
              <div>
                <h4>${escapeHTML(entry.mealType)}</h4>
                <div class="meal-entry-meta">
                  <span class="pill subtle">${formatTime(entry.createdAt)}</span>
                  ${
                    entry.healthyDay
                      ? `<span class="pill completed">Healthy day</span>`
                      : ""
                  }
                  ${
                    entry.waterIntake !== "" && entry.waterIntake !== null && entry.waterIntake !== undefined
                      ? `<span class="pill subtle">${escapeHTML(String(entry.waterIntake))} glasses water</span>`
                      : ""
                  }
                </div>
              </div>

              <div class="meal-entry-actions">
                <button type="button" class="secondary-button" data-entry-edit="${entry.id}">
                  Edit
                </button>
                <button type="button" class="secondary-button" data-entry-delete="${entry.id}">
                  Delete
                </button>
              </div>
            </div>

            <div class="meal-entry-text">${escapeHTML(entry.mealText)}</div>

            ${
              entry.mealNotes
                ? `<div class="meal-entry-notes"><strong>Notes:</strong><br>${escapeHTML(entry.mealNotes)}</div>`
                : ""
            }
          </article>
        `
      )
      .join("");

    elements.mealEntriesList.querySelectorAll("[data-entry-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        editMealEntry(button.dataset.entryEdit);
      });
    });

    elements.mealEntriesList.querySelectorAll("[data-entry-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteMealEntry(button.dataset.entryDelete);
      });
    });
  }

  function renderProgress() {
    const currentWeek = getCurrentWeekSummary();
    const streak = calculateCompletionStreak();
    const currentWeekDays = getCurrentWeekDays();
    const foodLoggedThisWeek = currentWeekDays.filter((day) => {
      const log = getFoodLogByDate(day.dateKey);
      return log.entries.length > 0;
    }).length;

    elements.progressWorkoutMetric.textContent = `${currentWeek.workoutCompleted} / ${currentWeek.workoutTotal}`;
    elements.progressCardioMetric.textContent = `${currentWeek.cardioCompleted} / ${currentWeek.cardioTotal}`;
    elements.progressFoodMetric.textContent = `${foodLoggedThisWeek} / ${currentWeekDays.length}`;
    elements.progressRestMetric.textContent = `${currentWeek.restTotal} day`;
    elements.progressStreakNumber.textContent = String(streak);
    elements.progressMotivationMessage.textContent = getMotivationMessage(
      currentWeek.workoutCompleted,
      currentWeek.cardioCompleted,
      streak
    );

    const upcoming = appState.planDays.slice(0, 7);
    elements.upcomingWeekPreview.innerHTML = upcoming
      .map(
        (day) => `
          <article class="upcoming-day-card">
            <div class="meal-entry-head">
              <div>
                <h4>${escapeHTML(day.weekdayLabel)} • ${escapeHTML(formatShortDate(day.date))}</h4>
                <p>${escapeHTML(getDayTypeLabel(day.type))}</p>
              </div>
              <span class="pill ${day.type}">
                ${
                  day.type === "workout"
                    ? "Workout"
                    : day.type === "cardio"
                    ? "Cardio"
                    : "Rest"
                }
              </span>
            </div>
            <p>${escapeHTML(getCalendarPreviewText(day))}</p>
          </article>
        `
      )
      .join("");
  }

  function handleMealFormSubmit(event) {
    event.preventDefault();

    const selectedDateKey = appState.selectedFoodDate;
    if (!selectedDateKey) {
      showToast("Please select a day first.", "warning", "No date selected");
      return;
    }

    const mealType = elements.mealType.value.trim();
    const mealText = elements.mealText.value.trim();
    const mealNotes = elements.mealNotes.value.trim();
    const waterIntake = elements.waterIntake.value.trim();
    const healthyDay = elements.healthyDay.checked;
    const editingId = elements.editingMealId.value;

    if (!mealText) {
      showToast("Please write what you ate before saving.", "warning", "Missing meal details");
      elements.mealText.focus();
      return;
    }

    const currentLog = getFoodLogByDate(selectedDateKey);
    let updatedEntries;

    if (editingId) {
      updatedEntries = currentLog.entries.map((entry) =>
        entry.id === editingId
          ? {
              ...entry,
              mealType,
              mealText,
              mealNotes,
              waterIntake,
              healthyDay,
              updatedAt: Date.now(),
            }
          : entry
      );

      showToast("Your meal entry was updated successfully.", "success", "Entry updated");
    } else {
      const newEntry = {
        id: generateId(),
        mealType,
        mealText,
        mealNotes,
        waterIntake,
        healthyDay,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      updatedEntries = [...currentLog.entries, newEntry];
      showToast("Your meal entry was saved.", "success", "Saved");
    }

    appState.foodLogs[selectedDateKey] = {
      entries: updatedEntries,
      hydration: waterIntake,
      healthyDay,
      updatedAt: Date.now(),
    };

    persistFoodLogs();
    clearMealForm();
    renderApp();
  }

  function clearMealForm() {
    elements.mealForm.reset();
    elements.editingMealId.value = "";

    const selectedLog = getFoodLogByDate(appState.selectedFoodDate);
    elements.waterIntake.value = selectedLog.hydration ?? "";
    elements.healthyDay.checked = Boolean(selectedLog.healthyDay);
    elements.saveMealButton.textContent = "Save Entry";
  }

  function editMealEntry(entryId) {
    const log = getFoodLogByDate(appState.selectedFoodDate);
    const entry = log.entries.find((item) => item.id === entryId);

    if (!entry) {
      showToast("That entry could not be found.", "error", "Entry missing");
      return;
    }

    elements.mealType.value = entry.mealType;
    elements.mealText.value = entry.mealText;
    elements.mealNotes.value = entry.mealNotes || "";
    elements.waterIntake.value = entry.waterIntake ?? "";
    elements.healthyDay.checked = Boolean(entry.healthyDay);
    elements.editingMealId.value = entry.id;
    elements.saveMealButton.textContent = "Update Entry";

    elements.mealText.focus();
    showToast("You can now edit the selected meal entry.", "success", "Editing");
  }

  function deleteMealEntry(entryId) {
    const log = getFoodLogByDate(appState.selectedFoodDate);
    const newEntries = log.entries.filter((entry) => entry.id !== entryId);

    appState.foodLogs[appState.selectedFoodDate] = {
      ...log,
      entries: newEntries,
      updatedAt: Date.now(),
    };

    persistFoodLogs();

    if (elements.editingMealId.value === entryId) {
      clearMealForm();
    }

    showToast("The meal entry was deleted.", "success", "Deleted");
    renderApp();
  }

  function selectWorkoutDate(dateKey) {
    appState.selectedWorkoutDate = dateKey;
    localStorage.setItem(STORAGE_KEYS.selectedWorkoutDate, dateKey);

    const selectedDay = getPlanDayByDateKey(dateKey);
    if (selectedDay) {
      appState.calendarMonthDate = new Date(selectedDay.date);
    }

    renderWorkoutCalendar();
    renderSelectedWorkoutDay();
  }

  function selectFoodDate(dateKey) {
    appState.selectedFoodDate = dateKey;
    localStorage.setItem(STORAGE_KEYS.selectedFoodDate, dateKey);
    clearMealForm();
    renderFoodDayList();
    renderSelectedFoodDay();
  }

  function markDayCompleted(dateKey, completed) {
    const day = getPlanDayByDateKey(dateKey);
    if (!day) {
      showToast("This day is outside the generated plan.", "warning", "Unavailable");
      return;
    }

    if (day.type === "rest" && completed) {
      showToast(
        "Rest days are for recovery, so they are not marked as completed.",
        "warning",
        "Recovery day"
      );
      return;
    }

    if (completed) {
      appState.workoutCompletions[dateKey] = true;
    } else {
      delete appState.workoutCompletions[dateKey];
    }

    persistWorkoutCompletions();
    generatePlanDays(120);

    const message = completed
      ? `${getDayTypeLabel(day.type)} marked as completed.`
      : `Status reset for ${day.weekdayLabel}.`;

    showToast(message, "success", completed ? "Completed" : "Reset");
    renderApp();
  }

  function openDayModal(dateKey) {
    const day = getPlanDayByDateKey(dateKey);
    if (!day) return;

    elements.dayModal.dataset.dateKey = dateKey;
    elements.dayModalTitle.textContent = day.displayLabel;
    elements.dayModalBody.innerHTML = createDayDetailsHTML(day, { showMeta: true });
    updateCompletionButtons(day, elements.modalCompleteDayButton, elements.modalResetDayButton);
    elements.dayModal.classList.add("is-open");
    elements.dayModal.setAttribute("aria-hidden", "false");
  }

  function closeDayModal() {
    elements.dayModal.classList.remove("is-open");
    elements.dayModal.setAttribute("aria-hidden", "true");
    delete elements.dayModal.dataset.dateKey;
  }

  function toggleSidebar() {
    const expanded = elements.menuToggle.getAttribute("aria-expanded") === "true";
    elements.menuToggle.setAttribute("aria-expanded", String(!expanded));
    elements.sidebar.classList.toggle("is-open", !expanded);
  }

  function closeSidebar() {
    elements.sidebar.classList.remove("is-open");
    elements.menuToggle.setAttribute("aria-expanded", "false");
  }

  function persistWorkoutCompletions() {
    localStorage.setItem(
      STORAGE_KEYS.workoutCompletions,
      JSON.stringify(appState.workoutCompletions)
    );
  }

  function persistFoodLogs() {
    localStorage.setItem(STORAGE_KEYS.foodLogs, JSON.stringify(appState.foodLogs));
  }

  function getFoodLogByDate(dateKey) {
    const existing = appState.foodLogs[dateKey];
    return {
      entries: Array.isArray(existing?.entries) ? existing.entries : [],
      hydration: existing?.hydration ?? "",
      healthyDay: Boolean(existing?.healthyDay),
      updatedAt: existing?.updatedAt ?? null,
    };
  }

  function getCurrentWeekDays() {
    const monday = getMonday(appState.today);
    const sunday = addDays(monday, 6);

    return appState.planDays.filter(
      (day) => day.date >= monday && day.date <= sunday
    );
  }

  function getCurrentWeekSummary() {
    const weekDays = getCurrentWeekDays();

    const workoutDays = weekDays.filter((day) => day.type === "workout");
    const cardioDays = weekDays.filter((day) => day.type === "cardio");
    const restDays = weekDays.filter((day) => day.type === "rest");

    return {
      workoutTotal: workoutDays.length,
      cardioTotal: cardioDays.length,
      restTotal: restDays.length,
      workoutCompleted: workoutDays.filter((day) => day.completed).length,
      cardioCompleted: cardioDays.filter((day) => day.completed).length,
    };
  }

  function calculateCompletionStreak() {
    let streak = 0;

    for (let i = 0; i < appState.planDays.length; i += 1) {
      const day = appState.planDays[i];

      if (day.date > appState.today) break;
      if (day.type === "rest") continue;

      if (day.completed) {
        streak += 1;
      } else {
        streak = 0;
      }
    }

    return streak;
  }

  function countFoodLoggedDays() {
    return Object.values(appState.foodLogs).filter((log) => Array.isArray(log.entries) && log.entries.length > 0).length;
  }

  function getStatusHeadline(day) {
    if (day.type === "rest") return "Recovery Day";
    return day.completed ? "Completed" : "Not completed yet";
  }

  function getStatusDescription(day) {
    if (day.type === "workout") {
      return day.completed
        ? "Today's workout has been completed beautifully."
        : "Your strength session is ready whenever you are.";
    }

    if (day.type === "cardio") {
      return day.completed
        ? "Your walking session is done for today."
        : "A calm walking session is scheduled for today.";
    }

    return "Today is designed for rest, recovery, and gentle care.";
  }

  function getMotivationMessage(workouts, cardio, streak) {
    if (streak >= 6) {
      return "You are building beautiful momentum. Keep protecting your routine and recovery.";
    }
    if (workouts >= 3 || cardio >= 2) {
      return "This week is looking strong. A little consistency is turning into real progress.";
    }
    if (workouts >= 1 || cardio >= 1) {
      return "A gentle start still counts. Stay close to the plan and let consistency do the work.";
    }
    return "Your next completed day can restart your rhythm. Begin softly and keep it simple.";
  }

  function createTodaySummaryHTML(day) {
    const details = createMiniPlanText(day);

    return `
      <article class="today-plan-card">
        <div class="meal-entry-head">
          <div>
            <h4>${escapeHTML(day.displayLabel)}</h4>
            <p>${escapeHTML(getDayTypeLabel(day.type))}</p>
          </div>
          <span class="pill ${day.completed ? "completed" : day.type}">
            ${
              day.type === "rest"
                ? "Rest"
                : day.completed
                ? "Completed"
                : "Pending"
            }
          </span>
        </div>
        <p>${escapeHTML(details)}</p>
        <div class="form-actions">
          ${
            day.type !== "rest"
              ? `
            <button type="button" class="primary-button" data-action="complete-today" ${
              day.completed ? "disabled" : ""
            }>
              Mark as Completed
            </button>
            <button type="button" class="secondary-button" data-action="reset-today" ${
              !day.completed ? "disabled" : ""
            }>
              Reset
            </button>
          `
              : `
            <button type="button" class="secondary-button" disabled>
              Recovery day
            </button>
          `
          }
        </div>
      </article>
    `;
  }

  function createDashboardMealSummaryHTML(dateKey) {
    const log = getFoodLogByDate(dateKey);

    if (!log.entries.length) {
      return `
        <div class="empty-state compact">
          <h4>No meals logged yet</h4>
          <p>Add breakfast, lunch, dinner, snacks, and notes anytime.</p>
        </div>
      `;
    }

    const grouped = groupMealEntries(log.entries);

    return Object.entries(grouped)
      .map(([mealType, entries]) => {
        const combinedText = entries.map((entry) => entry.mealText).join(" • ");
        return `
          <article class="meal-preview-card">
            <h4>${escapeHTML(mealType)}</h4>
            <p>${escapeHTML(truncateText(combinedText, 160))}</p>
          </article>
        `;
      })
      .join("");
  }

  function createFoodSummaryPanelHTML(foodData) {
    if (!foodData.entries.length) {
      return `
        <div class="empty-state compact">
          <h4>No food entries yet</h4>
          <p>Use the Food Tracker to add meals for today.</p>
        </div>
      `;
    }

    const grouped = groupMealEntries(foodData.entries);
    const blocks = Object.entries(grouped)
      .map(
        ([mealType, entries]) => `
          <article class="summary-card">
            <h4>${escapeHTML(mealType)}</h4>
            <p>${escapeHTML(entries.map((entry) => entry.mealText).join(" • "))}</p>
          </article>
        `
      )
      .join("");

    const hydrationBlock =
      foodData.hydration !== "" && foodData.hydration !== null && foodData.hydration !== undefined
        ? `
      <article class="summary-card">
        <h4>Hydration</h4>
        <p>${escapeHTML(String(foodData.hydration))} glasses</p>
      </article>
    `
        : "";

    return `${blocks}${hydrationBlock}`;
  }

  function createDayDetailsHTML(day, options = {}) {
    const showMeta = Boolean(options.showMeta);

    if (day.type === "workout") {
      return `
        <div class="plan-block">
          <h4>${escapeHTML(day.plan.title)} • ${escapeHTML(day.plan.rounds)}</h4>
          <p>${escapeHTML(day.plan.rest)}</p>
          <ul class="exercise-list">
            ${day.plan.exercises
              .map((exercise) => `<li><strong>•</strong><span>${escapeHTML(exercise)}</span></li>`)
              .join("")}
          </ul>
          ${
            showMeta
              ? `
            <ul class="meta-list">
              <li><strong>Status:</strong> <span>${day.completed ? "Completed" : "Pending"}</span></li>
              <li><strong>Day type:</strong> <span>${escapeHTML(getDayTypeLabel(day.type))}</span></li>
            </ul>
          `
              : ""
          }
        </div>
      `;
    }

    if (day.type === "cardio") {
      return `
        <div class="plan-block">
          <h4>${escapeHTML(day.plan.title)}</h4>
          <ul class="inline-list">
            <li><strong>Duration:</strong> <span>${escapeHTML(day.plan.duration)}</span></li>
            <li><strong>Intensity:</strong> <span>${escapeHTML(day.plan.intensity)}</span></li>
            <li><strong>Guidance:</strong> <span>${escapeHTML(day.plan.note)}</span></li>
          </ul>
          ${
            showMeta
              ? `
            <ul class="meta-list">
              <li><strong>Status:</strong> <span>${day.completed ? "Completed" : "Pending"}</span></li>
              <li><strong>Day type:</strong> <span>${escapeHTML(getDayTypeLabel(day.type))}</span></li>
            </ul>
          `
              : ""
          }
        </div>
      `;
    }

    return `
      <div class="plan-block">
        <h4>${escapeHTML(day.plan.title)}</h4>
        <div class="recovery-note">${escapeHTML(day.plan.note)}</div>
        ${
          showMeta
            ? `
          <ul class="meta-list">
            <li><strong>Status:</strong> <span>Recovery day</span></li>
            <li><strong>Day type:</strong> <span>${escapeHTML(getDayTypeLabel(day.type))}</span></li>
          </ul>
        `
            : ""
        }
      </div>
    `;
  }

  function createMiniPlanText(day) {
    if (day.type === "workout") {
      return `${day.plan.title} with ${day.plan.rounds.toLowerCase()} and ${day.plan.exercises.length} exercises.`;
    }

    if (day.type === "cardio") {
      return `${day.plan.duration}, ${day.plan.intensity.toLowerCase()}.`;
    }

    return day.plan.note;
  }

  function getCalendarPreviewText(day) {
    if (day.type === "workout") return day.plan.title;
    if (day.type === "cardio") return "20–40 min walking";
    return "Recovery and rest";
  }

  function updateTypeBadge(element, type) {
    element.className = "pill";
    if (type === "workout") {
      element.classList.add("workout");
      element.textContent = "Workout";
    } else if (type === "cardio") {
      element.classList.add("cardio");
      element.textContent = "Cardio";
    } else if (type === "rest") {
      element.classList.add("rest");
      element.textContent = "Rest";
    } else {
      element.classList.add("subtle");
      element.textContent = "—";
    }
  }

  function updateStatusBadge(element, day) {
    element.className = "pill";

    if (day.type === "rest") {
      element.classList.add("rest");
      element.textContent = "Recovery";
      return;
    }

    if (day.completed) {
      element.classList.add("completed");
      element.textContent = "Completed";
    } else {
      element.classList.add("pending");
      element.textContent = "Pending";
    }
  }

  function updateCompletionButtons(day, completeButton, resetButton) {
    if (day.type === "rest") {
      completeButton.disabled = true;
      resetButton.disabled = true;
      return;
    }

    completeButton.disabled = day.completed;
    resetButton.disabled = !day.completed;
  }

  function groupMealEntries(entries) {
    return entries.reduce((acc, entry) => {
      if (!acc[entry.mealType]) acc[entry.mealType] = [];
      acc[entry.mealType].push(entry);
      return acc;
    }, {});
  }

  function showToast(message, type = "success", title = "Notice") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-title">${escapeHTML(title)}</span>
      <p>${escapeHTML(message)}</p>
    `;

    elements.toastContainer.appendChild(toast);

    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      window.setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  function loadFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.error(`Failed to parse storage key: ${key}`, error);
      return fallback;
    }
  }

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDateLong(date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatShortDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  function formatMonthYear(date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function formatWeekday(date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(date);
  }

  function formatTime(timestamp) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(timestamp));
  }

  function startOfDay(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function addDays(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return startOfDay(copy);
  }

  function addMonths(date, months) {
    const copy = new Date(date);
    copy.setMonth(copy.getMonth() + months);
    return startOfDay(copy);
  }

  function getMonday(date) {
    const copy = startOfDay(date);
    const day = copy.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return addDays(copy, diff);
  }

  function startOfCalendarGrid(date) {
    const jsDay = date.getDay();
    const mondayIndex = jsDay === 0 ? 6 : jsDay - 1;
    return addDays(date, -mondayIndex);
  }

  function endOfCalendarGrid(date) {
    const jsDay = date.getDay();
    const mondayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const daysToSunday = 6 - mondayIndex;
    return addDays(date, daysToSunday);
  }

  function isSameDay(a, b) {
    return formatDateKey(a) === formatDateKey(b);
  }

  function getDayTypeLabel(type) {
    return DAY_TYPES[type] || "Planned";
  }

  function generateId() {
    return `entry_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")
      .replaceAll("\n", "<br>");
  }

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}…`;
  }
});
