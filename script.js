const sidebar = document.getElementById('course-sidebar');
const courseNumberEl = document.getElementById('course-number');
const courseTitleEl = document.getElementById('course-title');
const detailsEl = document.getElementById('details');
let activeCourseCode = 'CS5013';

const courseData = Object.entries(courses).map(([code, course]) => ({ code, ...course }));
const UPCOMING_DEADLINES_URL = 'https://script.google.com/macros/s/AKfycbzSqpT-FewAIXn5sp_c_kbN02xsWWeMX42KqW3Z2Bp-1fRpg0Ua07Jfe11gp22RL2En/exec';

function renderSidebar() {
    sidebar.innerHTML = '';

    const timetableButton = document.createElement('button');
    timetableButton.className = 'course-btn';
    timetableButton.dataset.view = 'timetable';
    timetableButton.textContent = 'TimeTable';
    timetableButton.addEventListener('click', () => setActiveView('timetable'));
    sidebar.appendChild(timetableButton);

    const upcomingButton = document.createElement('button');
    upcomingButton.className = 'course-btn';
    upcomingButton.dataset.view = 'upcoming';
    upcomingButton.textContent = 'Upcoming';
    upcomingButton.addEventListener('click', () => setActiveView('upcoming'));
    sidebar.appendChild(upcomingButton);

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

function normalizeUpcomingRow(row) {
    if (!row || typeof row !== 'object') {
        return { date: '', courseNo: '', evaluationType: '' };
    }

    return {
        date: row.date ?? row.Date ?? '',
        courseNo: row.courseNo ?? row.course_no ?? row.courseCode ?? row['Course No'] ?? '',
        evaluationType: row.evaluationType ?? row.evaluation_type ?? row.type ?? row['Evaluation Type'] ?? ''
    };
}

async function renderUpcomingDeadlinesView() {
    detailsEl.innerHTML = renderDetailSection('Upcoming Deadlines', '<p>Loading upcoming deadlines...</p>');

    if (!UPCOMING_DEADLINES_URL) {
        detailsEl.innerHTML = renderDetailSection('Upcoming Deadlines', '<p>Upcoming deadlines are not available yet.</p><p>Set the Google Apps Script JSON endpoint in the UPCOMING_DEADLINES_URL constant at the top of script.js.</p>');
        return;
    }

    try {
        const response = await fetch(UPCOMING_DEADLINES_URL);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const rows = (Array.isArray(payload) ? payload : [])
            .map((row) => normalizeUpcomingRow(row))
            .filter((row) => row.date || row.courseNo || row.evaluationType);

        const tableRows = rows.length
            ? rows.map((row) => `
                <tr>
                    <td>${escapeHtml(row.date)}</td>
                    <td>${escapeHtml(row.courseNo)}</td>
                    <td>${escapeHtml(row.evaluationType)}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="3">No upcoming deadlines found yet.</td></tr>';

        const content = `
            <table class="detail-table upcoming-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Course No</th>
                        <th>Evaluation Type</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        `;

        detailsEl.innerHTML = renderDetailSection('Upcoming Deadlines', content);
    } catch (error) {
        console.error('Failed to load upcoming deadlines', error);
        detailsEl.innerHTML = renderDetailSection(
            'Upcoming Deadlines',
            `<p>Unable to load upcoming deadlines right now.</p><p>${escapeHtml(error.message || 'Unknown error')}</p>`
        );
    }
}

function renderDateCell(dateValue) {
    if (Array.isArray(dateValue)) {
        const items = (dateValue || []).filter((item) => item !== '' && item !== null && item !== undefined);
        if (!items.length) {
            return '';
        }
        return `<ul class="detail-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    }

    return escapeHtml(dateValue || '');
}

function renderCourseDetails(course) {
    const schedule = course.schedule || {};
    const classes = (schedule.classes || []).filter((item) => item.day || item.startTime || item.endTime);
    const evaluation = (course.evaluation || []).filter((item) => item.type || item.weightage !== '' && item.weightage !== null && item.weightage !== undefined || item.date);
    const resourceItems = (course.resources || []).filter((item) => item.title || item.link);
    const resources = course.courseLink
        ? [...resourceItems, { title: 'Course link', link: course.courseLink }]
        : resourceItems;

    const summaryContent = [];
    if (course.summary) {
        summaryContent.push(`<p>${escapeHtml(course.summary)}</p>`);
    }
    if (course.topics && course.topics.length) {
        summaryContent.push(`
            <h4>Topics</h4>
            <ul class="detail-list">
                ${course.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}
            </ul>
        `);
    }

    const overviewSection = summaryContent.length
        ? renderDetailSection('Overview', summaryContent.join(''))
        : renderDetailSection('Overview', '<p>No overview available.</p>');

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

    const scheduleSection = scheduleContent.length
        ? renderDetailSection('Schedule', scheduleContent.join(''))
        : renderDetailSection('Schedule', '<p>No schedule information available.</p>');

    let evaluationSection = renderDetailSection('Evaluation Pattern', '<p>No evaluation information available.</p>');
    if (evaluation.length) {
        const tableRows = evaluation.map((item) => `
            <tr>
                <td>${escapeHtml(item.type || '')}</td>
                <td>${item.weightage !== '' && item.weightage !== null && item.weightage !== undefined ? escapeHtml(item.weightage) : ''}</td>
                <td>${renderDateCell(item.date)}</td>
            </tr>
        `).join('');

        evaluationSection = renderDetailSection('Evaluation Pattern', `
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
        `);
    }

    let resourcesSection = renderDetailSection('Resources', '<p>No resources available.</p>');
    if (resources.length) {
        const resourceItems = resources.map((item) => {
            const title = item.title ? escapeHtml(item.title) : 'Resource';
            if (item.link) {
                return `<li><a class="detail-link" href="${escapeAttribute(item.link)}" target="_blank" rel="noopener noreferrer">${title}</a></li>`;
            }
            return `<li>${title}</li>`;
        }).join('');

        resourcesSection = renderDetailSection('Resources', `<ul class="detail-list">${resourceItems}</ul>`);
    }

    const sections = {
        overview: overviewSection,
        schedule: scheduleSection,
        evaluation: evaluationSection,
        resources: resourcesSection
    };

    detailsEl.innerHTML = `
        <div class="detail-tabs-wrapper">
            <div class="detail-tabs" role="tablist" aria-label="Course details sections">
                <button class="detail-tab" data-tab="overview" role="tab" aria-selected="false">Overview</button>
                <button class="detail-tab" data-tab="schedule" role="tab" aria-selected="false">Schedule</button>
                <button class="detail-tab active" data-tab="evaluation" role="tab" aria-selected="true">Evaluation</button>
                <button class="detail-tab" data-tab="resources" role="tab" aria-selected="false">Resources</button>
            </div>
            <div class="detail-panel" id="detail-panel">${sections.evaluation}</div>
        </div>
    `;

    const tabButtons = detailsEl.querySelectorAll('.detail-tab');
    const panel = detailsEl.querySelector('.detail-panel');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedTab = button.dataset.tab;

            tabButtons.forEach((tab) => {
                const isActive = tab === button;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            panel.innerHTML = sections[selectedTab] || sections.overview;
        });
    });
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
    } else if (view === 'upcoming') {
        courseNumberEl.textContent = 'Upcoming';
        courseTitleEl.textContent = 'Upcoming Deadlines';
        document.title = 'Upcoming Deadlines';
        renderUpcomingDeadlinesView();
    } else {
        setActiveCourse(activeCourseCode);
    }
}

renderSidebar();
setActiveView('timetable');
