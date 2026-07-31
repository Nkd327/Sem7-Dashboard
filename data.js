const courses = {
  BT6220: {
    title: 'Theoretical Biophysics',
    pageTitle: 'BT6220 | Theoretical Biophysics',
    summary: 'A foundational course on the physical principles that govern biological phenomena.',
    topics: ['Molecular dynamics', 'Biophysical modeling', 'Cellular mechanics'],
    schedule: {
      location: '',
      slot: '',
      classes: [],
      note: ''
    },
    evaluation: [
      { type: 'Assignments', weightage: 0, date: '' },
      { type: 'Quizzes', weightage: 0, date: '' },
      { type: 'Research presentation', weightage: 0, date: '' }
    ],
    courseLink: '',
    resources: [
      { title: 'Lecture notes', link: '' },
      { title: 'Journal papers', link: '' },
      { title: 'Simulation toolkit', link: '' }
    ]
  },
  CS6380: {
    title: 'Artificial Intelligence',
    pageTitle: 'CS6380 | Artificial Intelligence',
    summary: 'Explores the concepts, methods, and applications of intelligent systems.',
    topics: ['Search algorithms', 'Knowledge representation', 'Machine learning basics'],
    schedule: {
      location: '',
      slot: '',
      classes: [],
      note: ''
    },
    evaluation: [
      { type: 'Problem sets', weightage: 0, date: '' },
      { type: 'Midterm exam', weightage: 0, date: '' },
      { type: 'Mini project', weightage: 0, date: '' }
    ],
    courseLink: '',
    resources: [
      { title: 'Course slides', link: '' },
      { title: 'Reference books', link: '' },
      { title: 'Coding notebooks', link: '' }
    ]
  },
  CS5013: {
    title: 'Programming with AI',
    pageTitle: 'CS5013 | Programming with AI',
    summary: 'Focuses on building software applications using AI and modern programming tools.',
    topics: [
      'Introduction to AI in Programming',
      'Prompt Engineering Fundamentals',
      'AI for Code Generation and Autocompletion',
      'Debugging and Refactoring with AI',
      'Testing and Documentation',
      'Building Software with LLM APIs (Optional)',
      'Ethical and Societal Implications',
      'Limitations, Evaluation, and Best Practices'
    ],
    schedule: {
      location: 'CS25',
      slot: 'F',
      classes: [
        {
            day: "Wed",
            timeSlot: "11:00 - 12:00"
        },
        {
            day: "Thu",
            timeSlot: "09:00 - 10:00"
        },
        {
            day: "Fri",
            timeSlot: "08:00 - 09:00"
        }
    ],
      note: 'Tue, 5-6pm Hands on Lab Session'
    },
    evaluation: [
      { type: 'Lab exercises', weightage: 0, date: '' },
      { type: 'Code review', weightage: 0, date: '' },
      { type: 'Capstone task', weightage: 0, date: '' }
    ],
    courseLink: 'https://www.cse.iitm.ac.in/~krishna/cs5013/',
    resources: [
      { title: 'Python notebooks', link: '' },
      { title: 'API docs', link: '' },
      { title: 'Deployment guides', link: '' }
    ]
  },
  CS6590: {
    title: 'Security Testing and Vulnerability Assessment',
    pageTitle: 'CS6590 | Security Testing and Vulnerability Assessment',
    summary: 'Introduces techniques to identify, test, and report security weaknesses in systems.',
    topics: ['Penetration testing', 'Threat modeling', 'Vulnerability scanning'],
    schedule: {
      location: '',
      slot: '',
      classes: [],
      note: ''
    },
    evaluation: [
      { type: 'Lab reports', weightage: 0, date: '' },
      { type: 'Case study', weightage: 0, date: '' },
      { type: 'Final assessment', weightage: 0, date: '' }
    ],
    courseLink: '',
    resources: [
      { title: 'Security tools', link: '' },
      { title: 'Reports', link: '' },
      { title: 'Reference manuals', link: '' }
    ]
  },
  CS6666: {
    title: 'Blockchain and DLT',
    pageTitle: 'CS6666 | Blockchain and DLT',
    summary: 'Covers distributed ledger technologies, consensus mechanisms, and blockchain applications.',
    topics: ['Consensus protocols', 'Smart contracts', 'Distributed systems'],
    schedule: {
      location: '',
      slot: '',
      classes: [],
      note: ''
    },
    evaluation: [
      { type: 'Reading notes', weightage: 0, date: '' },
      { type: 'Implementation task', weightage: 0, date: '' },
      { type: 'Final project', weightage: 0, date: '' }
    ],
    courseLink: '',
    resources: [
      { title: 'Whitepapers', link: '' },
      { title: 'SDK guides', link: '' },
      { title: 'Demo repositories', link: '' }
    ]
  }
};

window.courses = courses;
