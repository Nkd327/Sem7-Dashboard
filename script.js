const sidebar = document.getElementById('course-sidebar');
const courseNumberEl = document.getElementById('course-number');
const courseTitleEl = document.getElementById('course-title');
const detailsEl = document.getElementById('details');

function renderCourseButtons() {
    sidebar.innerHTML = '';

    courseData.forEach((course) => {
        const button = document.createElement('button');
        button.className = 'course-btn';
        button.textContent = course.code;

        button.addEventListener('click', () => setActiveCourse(course.code));

        sidebar.appendChild(button);
    });
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
    `;
}

function setActiveCourse(code) {
    const course = courseData.find((item) => item.code === code) || courseData[0];
    const buttons = sidebar.querySelectorAll('.course-btn');

    buttons.forEach((button) => {
        button.classList.toggle('active', button.textContent === course.code);
    });

    courseNumberEl.textContent = course.code;
    courseTitleEl.textContent = course.title;
    document.title = course.pageTitle;
    renderCourseDetails(course);
}

renderCourseButtons();
setActiveCourse('CS5013');
