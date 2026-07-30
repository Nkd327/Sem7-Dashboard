const sidebar = document.getElementById('course-sidebar');
const courseNumberEl = document.getElementById('course-number');
const courseTitleEl = document.getElementById('course-title');
const detailsEl = document.getElementById('details');
let activeCourseCode = 'CS5013';

function renderSidebar() {
    sidebar.innerHTML = '';

    const timetableButton = document.createElement('button');
    timetableButton.className = 'course-btn';
    timetableButton.dataset.view = 'timetable';
    timetableButton.textContent = 'TimeTable';
    timetableButton.addEventListener('click', () => setActiveView('timetable'));
    sidebar.appendChild(timetableButton);

    const courseButtonsContainer = document.createElement('div');
    courseButtonsContainer.className = 'course-list';

    courseData.forEach((course) => {
        const button = document.createElement('button');
        button.className = 'course-btn';
        button.textContent = course.code;

        button.addEventListener('click', () => setActiveCourse(course.code));

        courseButtonsContainer.appendChild(button);
    });

    sidebar.appendChild(courseButtonsContainer);

    const calendarButton = document.createElement('button');
    calendarButton.className = 'course-btn';
    calendarButton.dataset.view = 'calendar';
    calendarButton.textContent = 'Calendar';
    calendarButton.addEventListener('click', () => setActiveView('calendar'));
    sidebar.appendChild(calendarButton);
}

function renderCourseDetails(course) {
    detailsEl.innerHTML = `
        <h2>${course.title}</h2>
        <p>${course.summary}</p>

        <h3>Topics</h3>
        <ul>
            ${course.topics.map((topic) => `<li>${topic}</li>`).join('')}
        </ul>

        <h3>Assessments</h3>
        <ul>
            ${course.assessments.map((item) => `<li>${item}</li>`).join('')}
        </ul>

        <h3>Resources</h3>
        <ul>
            ${course.resources.map((item) => `<li>${item}</li>`).join('')}
        </ul>

        ${course.courseWebsite ? `<p><a href="${course.courseWebsite}" target="_blank" rel="noopener noreferrer">Course Website</a></p>` : ''}
    `;
}

function renderTimetableView() {
    detailsEl.innerHTML = `
        <div class="image-viewer">
            <h2>TimeTable</h2>
            <img src="tt7-optimized.webp" alt="Timetable" loading="lazy" decoding="async" />
        </div>
    `;
}

function renderCalendarView() {
    detailsEl.innerHTML = `
        <div class="pdf-viewer">
            <h2>Acad Calendar</h2>
            <iframe src="AcadCalendar.pdf#zoom=200" title="Academic Calendar"></iframe>
        </div>
    `;
}

function setActiveCourse(code) {
    const course = courseData.find((item) => item.code === code) || courseData[0];
    activeCourseCode = course.code;
    const buttons = sidebar.querySelectorAll('.course-btn');

    buttons.forEach((button) => {
        const isTimetableButton = button.dataset.view === 'timetable';
        button.classList.toggle('active', isTimetableButton ? false : button.textContent.trim() === course.code);
    });

    courseNumberEl.textContent = course.code;
    courseTitleEl.textContent = course.title;
    document.title = course.pageTitle;
    renderCourseDetails(course);
}

function setActiveView(view) {
    const buttons = sidebar.querySelectorAll('.course-btn');

    buttons.forEach((button) => {
        const isSpecial = button.dataset.view === 'timetable' || button.dataset.view === 'calendar';
        button.classList.toggle('active', isSpecial && button.dataset.view === view);
    });

    if (view === 'timetable') {
        courseNumberEl.textContent = 'TimeTable';
        courseTitleEl.textContent = 'Weekly Schedule';
        document.title = 'TimeTable';
        renderTimetableView();
    } else if (view === 'calendar') {
        courseNumberEl.textContent = 'Acad Calendar';
        courseTitleEl.textContent = 'Academic Schedule';
        document.title = 'Acad Calendar';
        renderCalendarView();
    } else {
        setActiveCourse(activeCourseCode);
    }
}

renderSidebar();
setActiveView('timetable');
