const sidebar = document.getElementById('course-sidebar');
const courseNumberEl = document.getElementById('course-number');
const courseTitleEl = document.getElementById('course-title');
const detailsEl = document.getElementById('details');
let activeCourseCode = 'CS5013';

const courseData = Object.entries(courses).map(([code, course]) => ({ code, ...course }));

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

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function renderDetailSection(title, content) {
    return `
        <section class="detail-section">
            <h3>${escapeHtml(title)}</h3>
            ${content}
        </section>
    `;
}

function renderCourseDetails(course) {
    const schedule = course.schedule || {};
    const classes = (schedule.classes || []).filter((item) => item.day || item.startTime || item.endTime);
    const evaluation = (course.evaluation || []).filter((item) => item.type || item.weightage !== '' && item.weightage !== null && item.weightage !== undefined || item.date);
    const resources = (course.resources || []).filter((item) => item.title || item.link);

    const sections = [];

    sections.push(`<h2>${escapeHtml(course.title || '')}</h2>`);

    const summaryContent = [];
    if (course.summary) {
        summaryContent.push(`<p>${escapeHtml(course.summary)}</p>`);
    }
    if (summaryContent.length) {
        sections.push(renderDetailSection('Overview', summaryContent.join('')));
    }

    if (evaluation.length) {
        const tableRows = evaluation.map((item) => `
            <tr>
                <td>${escapeHtml(item.type || '')}</td>
                <td>${item.weightage !== '' && item.weightage !== null && item.weightage !== undefined ? escapeHtml(item.weightage) : ''}</td>
                <td>${escapeHtml(item.date || '')}</td>
            </tr>
        `).join('');

        sections.push(renderDetailSection('Evaluation Pattern', `
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Weightage</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        `));
    }

    const scheduleContent = [];
    if (schedule.location) {
        scheduleContent.push(`<p><strong>Location :</strong> ${escapeHtml(schedule.location)}</p>`);
    }
    if (schedule.slot) {
        scheduleContent.push(`<p><strong>Slot :</strong> ${escapeHtml(schedule.slot)}</p>`);
    }
    if (classes.length) {
        scheduleContent.push(`
            <p><strong>Classes:</strong></p>
            <ul class="detail-list">
                ${classes.map((item) => {
                    const parts = [];
                    const dayLabel = item.day ? escapeHtml(item.day) : '';
                    if (dayLabel) parts.push(dayLabel);
                    const timeSlot = item.timeSlot ? escapeHtml(item.timeSlot) : '';
                    if (timeSlot) parts.push(timeSlot);
                    return `<li>${parts.join(', ')}</li>`;
                }).join('')}
            </ul>
        `);
    }
    if (schedule.note) {
        scheduleContent.push(`<p><strong>Note :</strong> ${escapeHtml(schedule.note)}</p>`);
    }
    if (scheduleContent.length) {
        sections.push(renderDetailSection('Schedule', scheduleContent.join('')));
    }

    if (course.topics && course.topics.length) {
        sections.push(renderDetailSection('Topics', `
            <ul class="detail-list">
                ${course.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}
            </ul>
        `));
    }

    if (course.courseLink) {
        sections.push(renderDetailSection('Course Link', `
            <p><a class="detail-link" href="${escapeAttribute(course.courseLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(course.courseLink)}</a></p>
        `));
    }

    if (resources.length) {
        const resourceItems = resources.map((item) => {
            const title = item.title ? escapeHtml(item.title) : 'Resource';
            if (item.link) {
                return `<li>• ${title} → <a class="detail-link" href="${escapeAttribute(item.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.link)}</a></li>`;
            }
            return `<li>• ${title}</li>`;
        }).join('');

        sections.push(renderDetailSection('Resources', `<ul class="detail-list">${resourceItems}</ul>`));
    }

    detailsEl.innerHTML = sections.join('');
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
        courseNumberEl.textContent = 'Calendar';
        courseTitleEl.textContent = 'Academic Schedule';
        document.title = 'Calendar';
        renderCalendarView();
    } else {
        setActiveCourse(activeCourseCode);
    }
}

renderSidebar();
setActiveView('timetable');
