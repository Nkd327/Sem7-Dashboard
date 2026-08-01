const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.js');
let currentCourses = null;

async function getInquirer() {
  const mod = await import('inquirer');
  return mod.default || mod;
}

function loadCourses() {
  const source = fs.readFileSync(filePath, 'utf8');
  const match = source.match(/const courses =([\s\S]*?)window\.courses = courses;/);

  if (!match) {
    throw new Error('Could not find courses object in data.js');
  }

  let courseObjectSource = match[1].trim();
  if (courseObjectSource.endsWith(';')) {
    courseObjectSource = courseObjectSource.slice(0, -1).trim();
  }

  const moduleWrapper = new Function(`return (${courseObjectSource});`);
  return moduleWrapper();
}

function serializeCourses(courses) {
  return `const courses = ${JSON.stringify(courses, null, 2)};\n\nwindow.courses = courses;\n`;
}

async function promptArray(question, defaultValue) {
  const inquirer = await getInquirer();
  const { value } = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message: question,
      default: defaultValue && defaultValue.length ? defaultValue.join(', ') : '',
      filter: (input) => input.trim()
    }
  ]);

  if (value === undefined || value === null || value === '') {
    return defaultValue || [];
  }

  const items = value.split(',').map((item) => item.trim()).filter(Boolean);
  return items.length ? items : (defaultValue || []);
}

async function promptText(question, defaultValue) {
  const inquirer = await getInquirer();
  const { value } = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message: question,
      default: defaultValue || ''
    }
  ]);
  return value === undefined || value === null || value === '' ? defaultValue : value;
}

async function promptClasses(defaultClasses) {
  const inquirer = await getInquirer();
  const { addMore } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addMore',
      message: 'Add a class entry?',
      default: false
    }
  ]);

  if (!addMore) {
    return defaultClasses || [];
  }

  const entry = await inquirer.prompt([
    {
      type: 'input',
      name: 'day',
      message: 'Day',
      default: defaultClasses[0] && defaultClasses[0].day ? defaultClasses[0].day : ''
    },
    {
      type: 'input',
      name: 'timeSlot',
      message: 'Time Slot',
      default: defaultClasses[0] && defaultClasses[0].timeSlot ? defaultClasses[0].timeSlot : ''
    }
  ]);

  const result = [{
    day: entry.day === undefined || entry.day === null || entry.day === '' ? (defaultClasses[0] && defaultClasses[0].day ? defaultClasses[0].day : '') : entry.day,
    timeSlot: entry.timeSlot === undefined || entry.timeSlot === null || entry.timeSlot === '' ? (defaultClasses[0] && defaultClasses[0].timeSlot ? defaultClasses[0].timeSlot : '') : entry.timeSlot
  }];
  const rest = await promptClasses(defaultClasses.slice(1));
  return result.concat(rest);
}

async function promptEvaluation(defaultEvaluation) {
  const inquirer = await getInquirer();
  const { addMore } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addMore',
      message: 'Add an evaluation component?',
      default: false
    }
  ]);

  if (!addMore) {
    return defaultEvaluation || [];
  }

  const entry = await inquirer.prompt([
    {
      type: 'input',
      name: 'type',
      message: 'Type',
      default: defaultEvaluation[0] && defaultEvaluation[0].type ? defaultEvaluation[0].type : ''
    },
    {
      type: 'input',
      name: 'weightage',
      message: 'Weightage',
      default: defaultEvaluation[0] && defaultEvaluation[0].weightage !== undefined ? String(defaultEvaluation[0].weightage) : ''
    },
    {
      type: 'input',
      name: 'date',
      message: 'Date',
      default: defaultEvaluation[0] && defaultEvaluation[0].date ? defaultEvaluation[0].date : ''
    }
  ]);

  const normalizeWeightage = (value) => {
    if (value === undefined || value === null || value === '') {
      return defaultEvaluation[0] && defaultEvaluation[0].weightage !== undefined ? defaultEvaluation[0].weightage : '';
    }

    const trimmed = String(value).trim();
    if (!trimmed) {
      return defaultEvaluation[0] && defaultEvaluation[0].weightage !== undefined ? defaultEvaluation[0].weightage : '';
    }

    if (/\d$/.test(trimmed) && !trimmed.endsWith('%')) {
      return `${trimmed}%`;
    }

    return trimmed;
  };

  const result = [{
    type: entry.type === undefined || entry.type === null || entry.type === '' ? (defaultEvaluation[0] && defaultEvaluation[0].type ? defaultEvaluation[0].type : '') : entry.type,
    weightage: normalizeWeightage(entry.weightage),
    date: entry.date === undefined || entry.date === null || entry.date === '' ? (defaultEvaluation[0] && defaultEvaluation[0].date ? defaultEvaluation[0].date : '') : entry.date
  }];
  const rest = await promptEvaluation(defaultEvaluation.slice(1));
  return result.concat(rest);
}

async function promptResources(defaultResources) {
  const inquirer = await getInquirer();
  const { addMore } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addMore',
      message: 'Add a resource entry?',
      default: false
    }
  ]);

  if (!addMore) {
    return defaultResources || [];
  }

  const entry = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Title',
      default: defaultResources[0] && defaultResources[0].title ? defaultResources[0].title : ''
    },
    {
      type: 'input',
      name: 'link',
      message: 'Link',
      default: defaultResources[0] && defaultResources[0].link ? defaultResources[0].link : ''
    }
  ]);

  const result = [{
    title: entry.title === undefined || entry.title === null || entry.title === '' ? (defaultResources[0] && defaultResources[0].title ? defaultResources[0].title : '') : entry.title,
    link: entry.link === undefined || entry.link === null || entry.link === '' ? (defaultResources[0] && defaultResources[0].link ? defaultResources[0].link : '') : entry.link
  }];
  const rest = await promptResources(defaultResources.slice(1));
  return result.concat(rest);
}

async function main() {
  const courses = loadCourses();
  currentCourses = courses;
  const courseCodes = Object.keys(courses);
  const inquirer = await getInquirer();

  const { selectedCourse } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedCourse',
      message: 'Which course do you want to fill data for?',
      choices: [...courseCodes, 'ALL']
    }
  ]);

  const targetCodes = selectedCourse === 'ALL' ? courseCodes : [selectedCourse];

  try {
    for (const code of targetCodes) {
      const course = courses[code];
      console.log(`\n=== ${code} ===`);

      course.summary = await promptText(`Summary for ${code}`, course.summary);

      const topics = await promptArray(`Topics for ${code} (comma separated; leave blank to skip)`, course.topics || []);
      course.topics = topics;

      const schedule = course.schedule || { location: '', slot: '', classes: [], note: '' };
      schedule.location = await promptText(`Schedule Location for ${code}`, schedule.location);
      schedule.slot = await promptText(`Schedule Slot for ${code}`, schedule.slot);
      schedule.note = await promptText(`Schedule Note for ${code}`, schedule.note);

      const classes = await promptClasses(schedule.classes || []);
      schedule.classes = classes;
      course.schedule = schedule;

      const evaluation = await promptEvaluation(course.evaluation || []);
      course.evaluation = evaluation;

      course.courseLink = await promptText(`Course Link for ${code}`, course.courseLink);

      const resources = await promptResources(course.resources || []);
      course.resources = resources;
    }

    fs.writeFileSync(filePath, serializeCourses(courses), 'utf8');
    console.log('\nUpdated data.js successfully.');
  } catch (error) {
    const isExitPromptError = error && (error.name === 'ExitPromptError' || error.message === 'User force closed the prompt');

    if (isExitPromptError) {
      const inquirer = await getInquirer();
      const { save } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'save',
          message: 'You cancelled. Save the data entered so far?',
          default: true
        }
      ]);

      if (save) {
        fs.writeFileSync(filePath, serializeCourses(courses), 'utf8');
        console.log('\nSaved the current progress to data.js.');
      } else {
        console.log('\nNo changes were saved.');
      }
      return;
    }

    throw error;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
