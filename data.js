/* ================================================================
   data.js  —  Default Data & LocalStorage manager
   ================================================================ */

const DB_KEY = 'nh_portfolio_data';

const DEFAULT_DATA = {
  info: {
    heroName: 'Nur Hossain',
    heroTagline: 'Full Stack Web Developer & Network Engineer crafting elegant digital experiences and robust network infrastructure solutions.',
    aboutSubtitle: 'Developer by Passion, Engineer by Training',
    aboutBio: '<p>Hello! I\'m <strong>Nur Hossain</strong>, a passionate Full Stack Web Developer and Network Engineer based in Bangladesh. With a strong foundation from my Diploma in CSE and a BSc in Computer Science, I\'ve built expertise across the full spectrum of digital technology.</p><p>I completed intensive training in <strong>Full Stack Web Development</strong> through the Webstack course, and advanced <strong>Networking Engineering</strong> through ISP StepUp — mastering MikroTik, CCNA, and enterprise-level infrastructure technologies.</p><p>I thrive at the intersection of elegant frontend design and robust backend architecture, while also being capable of designing and maintaining complex network systems.</p>',
    email: 'nurhossain998.nur@gmail.com',
    phone: '+8801813162478',
    location: 'Bangladesh',
    heroProjectsCount: '10+'
  },
  projects: [
    { id:1, title:'E-Commerce Platform', category:'fullstack', description:'A full-featured e-commerce web application with product listings, cart management, user authentication, and payment gateway integration.', tech:['HTML','CSS','JavaScript','PHP','MySQL'], icon:'fa-cart-shopping', liveUrl:'#', githubUrl:'#' },
    { id:2, title:'ISP Network Dashboard', category:'networking', description:'A real-time network monitoring dashboard built for ISP infrastructure management using MikroTik RouterOS API integration.', tech:['MikroTik API','JavaScript','Chart.js','HTML/CSS'], icon:'fa-network-wired', liveUrl:'#', githubUrl:'#' },
    { id:3, title:'Personal Blog CMS', category:'web', description:'A lightweight content management system with markdown support, admin panel, categories, and SEO optimization built in vanilla JavaScript.', tech:['HTML','CSS','JavaScript','LocalStorage'], icon:'fa-blog', liveUrl:'#', githubUrl:'#' },
    { id:4, title:'MikroTik Hotspot Manager', category:'networking', description:'Automated hotspot management system for small ISPs — generates vouchers, tracks user sessions, and monitors bandwidth usage.', tech:['MikroTik','PHP','MySQL','Bootstrap'], icon:'fa-wifi', liveUrl:'#', githubUrl:'#' },
    { id:5, title:'Portfolio Website Builder', category:'web', description:'A drag-and-drop portfolio website builder where users can create and customize their own portfolio pages without writing code.', tech:['HTML','CSS','JavaScript','Drag & Drop API'], icon:'fa-palette', liveUrl:'#', githubUrl:'#' },
    { id:6, title:'Restaurant Ordering System', category:'fullstack', description:'A complete restaurant management system with table ordering, kitchen display, inventory management, and sales reporting features.', tech:['HTML','CSS','JavaScript','PHP','MySQL'], icon:'fa-utensils', liveUrl:'#', githubUrl:'#' },
  ],
  skills: [
    { id:1,  name:'HTML5',                category:'web',        level:95, icon:'fa-brands fa-html5' },
    { id:2,  name:'CSS3',                 category:'web',        level:90, icon:'fa-brands fa-css3-alt' },
    { id:3,  name:'JavaScript',           category:'web',        level:85, icon:'fa-brands fa-js' },
    { id:4,  name:'PHP',                  category:'web',        level:75, icon:'fa-brands fa-php' },
    { id:5,  name:'MySQL',                category:'web',        level:78, icon:'fa-solid fa-database' },
    { id:6,  name:'Bootstrap',            category:'web',        level:88, icon:'fa-brands fa-bootstrap' },
    { id:7,  name:'MikroTik',             category:'networking', level:90, icon:'fa-solid fa-router' },
    { id:8,  name:'CCNA',                 category:'networking', level:80, icon:'fa-solid fa-network-wired' },
    { id:9,  name:'TCP/IP',               category:'networking', level:88, icon:'fa-solid fa-sitemap' },
    { id:10, name:'VPN & Firewall',       category:'networking', level:82, icon:'fa-solid fa-shield-halved' },
    { id:11, name:'ISP Management',       category:'networking', level:85, icon:'fa-solid fa-tower-broadcast' },
    { id:12, name:'Network Troubleshoot', category:'networking', level:87, icon:'fa-solid fa-wrench' },
    { id:13, name:'Git & GitHub',         category:'tools',      level:80, icon:'fa-brands fa-github' },
    { id:14, name:'VS Code',              category:'tools',      level:95, icon:'fa-solid fa-code' },
    { id:15, name:'Linux',                category:'tools',      level:75, icon:'fa-brands fa-linux' },
    { id:16, name:'Figma',                category:'tools',      level:65, icon:'fa-brands fa-figma' },
  ],
  services: [
    { id:1, title:'Web Development',         icon:'fa-laptop-code',   description:'Building responsive, fast, and user-friendly websites tailored to your specific business needs — from landing pages to full web applications.', features:['Responsive Design','Performance Optimization','SEO Friendly','Cross-Browser Compatible','CMS Integration'] },
    { id:2, title:'Full Stack Solutions',    icon:'fa-layer-group',   description:'End-to-end web application development covering frontend UI, backend logic, database design, and deployment configurations.', features:['Custom Web Applications','REST API Development','Database Design','User Authentication','Admin Dashboards'] },
    { id:3, title:'Network Engineering',     icon:'fa-network-wired', description:'Professional network design, configuration, and maintenance services for ISPs, businesses, and enterprise-level infrastructure.', features:['MikroTik Configuration','CCNA-Level Network Design','ISP Setup & Management','VPN & Firewall Setup','Network Troubleshooting'] },
    { id:4, title:'Hotspot & ISP Systems',   icon:'fa-wifi',          description:'Turnkey hotspot management systems including billing, user management, and bandwidth control for small to medium ISPs.', features:['Voucher Management','Bandwidth Control','User Session Tracking','Automated Billing','Real-time Monitoring'] },
    { id:5, title:'UI/UX Design',            icon:'fa-pen-ruler',     description:'Creating visually appealing and intuitive user interfaces with a focus on user experience, accessibility, and conversion optimization.', features:['Wireframing','Prototyping','Responsive Layouts','Dark/Light Themes','Icon & Visual Design'] },
    { id:6, title:'Tech Consultation',       icon:'fa-comments',      description:'Expert technical advice on web technology stacks, network infrastructure planning, and digital transformation strategies.', features:['Technology Stack Review','Architecture Planning','Performance Audits','Security Recommendations','Cost Optimization'] },
  ],
  timeline: [
    { id:1, type:'education',   title:'BSc in Computer Science & Engineering', organization:'University (Bangladesh)',            period:'2021 – 2024', description:'Completed Bachelor of Science in CSE, covering data structures, algorithms, database systems, operating systems, and software engineering principles.' },
    { id:2, type:'education',   title:'Diploma in CSE',                        organization:'Polytechnic Institute (Bangladesh)', period:'2017 – 2021', description:'Four-year diploma program covering fundamental computing concepts, programming, networking basics, and hardware fundamentals.' },
    { id:3, type:'education',   title:'Full Stack Web Development Training',   organization:'Webstack Course',                   period:'2022 – 2023', description:'Intensive training in full stack web development — HTML, CSS, JavaScript, PHP, MySQL, and modern development workflows.' },
    { id:4, type:'education',   title:'Networking Engineering Training',       organization:'ISP StepUp Program',                period:'2023 – 2024', description:'Advanced networking certification training covering MikroTik RouterOS, CCNA concepts, ISP infrastructure management, VPN, and enterprise networking.' },
    { id:5, type:'experience',  title:'Freelance Web Developer',               organization:'Self-Employed',                     period:'2022 – Present', description:'Designing and developing websites and web applications for clients across e-commerce, blogs, business portfolios, and management systems.' },
    { id:6, type:'experience',  title:'Network Engineer Intern',               organization:'Local ISP (Bangladesh)',            period:'2023 – 2024', description:'Hands-on ISP infrastructure management including MikroTik router configuration, network monitoring, troubleshooting, and customer support.' },
  ]
};

function loadData() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        info:     { ...DEFAULT_DATA.info,     ...(p.info||{}) },
        projects: p.projects  || DEFAULT_DATA.projects,
        skills:   p.skills    || DEFAULT_DATA.skills,
        services: p.services  || DEFAULT_DATA.services,
        timeline: p.timeline  || DEFAULT_DATA.timeline,
      };
    }
  } catch(e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function generateId(arr) {
  return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}

window.portfolioData = loadData();
