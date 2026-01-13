/**
 * NOAM BURG CV - Interactive JavaScript
 * Handles animations, interactions, and PDF generation
 */

document.addEventListener("DOMContentLoaded", () => {
  initCursorFollower();
  initExpandButtons();
  initScrollAnimations();
  initCompetencyBars();
  initSmoothScroll();
  initPDFDownload();
  initNavHighlight();
  initParallaxEffects();
  initJobToggles();
});

function initJobToggles() {
  // Open the first job by default - DISABLED per user request
  // const firstJob = document.querySelector(".timeline-item.collapsible");
  // if (firstJob) firstJob.classList.add("active");
}

/**
 * Global toggle function for jobs
 */
window.toggleJob = (header) => {
  const item = header.closest(".timeline-item");
  if (item) {
    item.classList.toggle("active");
  }
};

/**
 * Custom Cursor Follower
 * Creates a playful cursor effect that follows mouse movement
 */
function initCursorFollower() {
  const cursor = document.getElementById("cursorFollower");
  if (!cursor) return;

  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add("active");
  });

  // Hide cursor when mouse leaves window
  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("active");
  });

  // Smooth cursor animation
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, .competency-card, .timeline-item, .skill-tag, .edu-card, .additional-item"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });
}

/**
 * Expand/Collapse Buttons
 * Handles the "View achievements" and similar expandable sections
 */
function initExpandButtons() {
  const expandButtons = document.querySelectorAll(".expand-btn");

  expandButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      const targetList = btn.nextElementSibling;

      if (targetList) {
        btn.setAttribute("aria-expanded", !isExpanded);
        targetList.hidden = isExpanded;

        // Add animation class
        if (!isExpanded) {
          targetList.style.animation = "fadeIn 0.3s ease forwards";
        }
      }
    });
  });
}

/**
 * Scroll-triggered Animations
 * Reveals elements as they enter the viewport
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");

        // Special handling for timeline items
        if (entry.target.classList.contains("timeline-item")) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }

        // Special handling for competency cards
        if (entry.target.classList.contains("competency-card")) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      }
    });
  }, observerOptions);

  // Observe timeline items
  document.querySelectorAll(".timeline-item").forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-30px)";
    item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${
      index * 0.1
    }s`;
    animateOnScroll.observe(item);
  });

  // Observe competency cards
  document.querySelectorAll(".competency-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${
      index * 0.05
    }s`;
    animateOnScroll.observe(card);
  });

  // Observe education cards
  document.querySelectorAll(".edu-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${
      index * 0.1
    }s`;
    animateOnScroll.observe(card);
  });

  // Observe skill categories
  document.querySelectorAll(".skill-category").forEach((cat, index) => {
    cat.style.opacity = "0";
    cat.style.transform = "translateX(-20px)";
    cat.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${
      index * 0.1
    }s`;
    animateOnScroll.observe(cat);
  });
}

/**
 * Competency Bars Animation
 * Animates the skill bars when they come into view
 */
function initCompetencyBars() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        barObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".competency-card").forEach((card) => {
    barObserver.observe(card);
  });
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navHeight = document.querySelector(".nav-bar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * PDF Download Functionality
 * Generates and downloads a PDF version of the CV
 */
function initPDFDownload() {
  const downloadButtons = document.querySelectorAll(
    "#downloadPdf, #downloadPdfFooter"
  );

  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      generatePDF();
    });
  });
}

function generatePDF() {
  // Create a printable version
  const printContent = createPrintableCV();

  // Open print dialog
  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = function () {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

function createPrintableCV() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Noam Burg - CV</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #1a1a1a;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        h1 {
            font-size: 24pt;
            font-weight: 800;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            color: #1a1a1a;
        }
        
        h2 {
            font-size: 12pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #5c6bc0;
            padding-bottom: 4px;
            margin: 20px 0 12px 0;
            color: #2c3e50;
        }
        
        h3 {
            font-size: 11pt;
            font-weight: 700;
        }
        
        a {
            color: #4a7c59;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }

        .header {
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 16px;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
        }

        .header-text {
            flex: 1;
        }

        .profile-pic {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #5c6bc0;
        }
        
        .title {
            font-family: 'Space Mono', monospace;
            font-size: 10pt;
            color: #666;
            margin-bottom: 8px;
        }
        
        .contact {
            font-family: 'Space Mono', monospace;
            font-size: 8pt;
            color: #666;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: center;
        }
        
        .contact a {
            color: #666;
            text-decoration: none;
            border-bottom: 1px dotted #ccc;
            display: inline-flex;
            align-items: center;
        }

        .linkedin-icon {
            width: 16px;
            height: 16px;
            fill: #0077b5;
            transition: fill 0.2s;
        }

        .contact a:hover .linkedin-icon {
            fill: #004182;
        }

        .summary {
            font-size: 10pt;
            color: #444;
            margin: 12px 0;
            line-height: 1.6;
        }
        
        .competencies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 12px 0;
        }
        
        .competency {
            font-family: 'Space Mono', monospace;
            font-size: 8pt;
            padding: 4px 8px;
            border: 1px solid #e0e0dc;
            background: #f5f5f5;
            border-left: 2px solid #5c6bc0;
        }
        
        .job {
            margin-bottom: 16px;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
        }

        .company-link {
            color: #1a1a1a;
            text-decoration: none;
            border-bottom: 1px dotted #999;
            transition: color 0.2s;
        }
        
        .company-link:hover {
            color: #5c6bc0;
            border-bottom-color: #5c6bc0;
        }
        
        .job-title {
            font-family: 'Space Mono', monospace;
            font-size: 9pt;
            color: #666;
        }
        
        .job-date {
            font-family: 'Space Mono', monospace;
            font-size: 8pt;
            color: #666;
        }
        
        .job-summary {
            font-size: 9.5pt;
            color: #444;
            margin-top: 4px;
            margin-bottom: 8px;
            line-height: 1.4;
            font-style: italic;
        }

        .achievements {
            margin-left: 0;
            margin-top: 8px;
            list-style-type: none;
        }
        
        .achievements li {
            margin-bottom: 6px;
            font-size: 9pt;
            position: relative;
            padding-left: 12px;
        }
        
        .achievements li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #5c6bc0;
        }

        .achievement-title {
            font-weight: 700;
            color: #2c3e50;
            margin-right: 4px;
        }

        .highlight-text {
            font-weight: 600;
            background: rgba(92, 107, 192, 0.12);
            padding: 0 3px;
            border-radius: 3px;
            color: #1a1a1a;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
        }
        
        .edu-item {
            margin-bottom: 12px;
        }
        
        .skills-row {
            display: flex;
            margin-bottom: 8px;
        }
        
        .skills-label {
            font-family: 'Space Mono', monospace;
            font-size: 8pt;
            font-weight: 700;
            min-width: 100px;
            color: #5c6bc0;
        }
        
        .skills-value {
            font-size: 9pt;
        }
        
        @media print {
            body {
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            @page {
                margin: 0.5in;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="header-text">
                <h1>Noam Burg</h1>
                <div class="title">Technical Product Manager</div>
                <div class="contact">
                    <span>Nataf, Israel</span>
                    <a href="tel:+972545555656">+972 545-555-656</a>
                    <a href="mailto:sisoburg@gmail.com">sisoburg@gmail.com</a>
                    <a href="https://www.linkedin.com/in/noam-burg-0ab48b14a/" target="_blank" title="LinkedIn Profile">
                        <svg class="linkedin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>
                </div>
                <p class="summary">
                    Technical Product Manager combining construction tech expertise with hands-on AI product development. 
                    5+ years leading complex software products across desktop, web, mobile, and data systems - 
                    from office engineers to factory floor to construction sites.
                </p>
            </div>
            <img src="profile.jpg" alt="Noam Burg" class="profile-pic">
        </div>
    </div>
    
    <h2>Core Competencies</h2>
    <div class="competencies">
        <span class="competency">AI Product Development</span>
        <span class="competency">Algorithmic Solution Design</span>
        <span class="competency">CAD Automation & Optimization</span>
        <span class="competency">Multi-Platform Development</span>
        <span class="competency">Product Strategy & Roadmapping</span>
        <span class="competency">Product Team Leadership</span>
        <span class="competency">Construction Tech & BIM</span>
        <span class="competency">Manufacturing & Site Operations</span>
        <span class="competency">ERP/PLM System Integration</span>
    </div>
    
    <h2>Professional Experience</h2>
    
    <div class="job">
        <div class="job-header">
            <h3><a href="https://www.veev.com/" target="_blank" class="company-link">VEEV</a></h3>
            <span class="job-date">2020 → Present</span>
        </div>
        <div class="job-title">Product Manager (Team Lead 2021-2023) | Tel Aviv, Israel</div>
        <div class="job-summary">
            Led AI-powered construction software platform serving office users, fabrication teams, and site workers across desktop CAD, web, mobile, BI, and data systems.
        </div>
        <ul class="achievements">
            <li><span class="achievement-title">AI QC System:</span> Designed and shipped <span class="highlight-text">AI-based automatic QC system</span> for 3D model validation, integrating <span class="highlight-text">LLM capabilities</span> and reducing manual engineering review time.</li>
            <li><span class="achievement-title">Model Connectivity:</span> Developed <span class="highlight-text">Model Context Protocol (MCP)</span> integration for Revit, enabling <span class="highlight-text">real-time data synchronization</span> across BIM workflows.</li>
            <li><span class="achievement-title">Intelligent Chatbot:</span> Built <span class="highlight-text">intelligent chatbot</span> with data warehouse integration, architecting workflows using <span class="highlight-text">LLM APIs</span>.</li>
            <li><span class="achievement-title">Design Automation:</span> Led the development of <span class="highlight-text">Design Automation CAD tools</span>, streamlining complex engineering workflows and optimizing geometric data processing.</li>
            <li><span class="achievement-title">Geometric Optimization:</span> Created <span class="highlight-text">geometric optimization algorithms</span> (high-level logic) with technical leads for <span class="highlight-text">automated fabrication processes</span>.</li>
            <li><span class="achievement-title">Team Management:</span> <span class="highlight-text">Led product team of 3 PMs</span> (2021-2023), establishing roadmaps and strategic initiatives until team restructuring.</li>
            <li><span class="achievement-title">Agile Execution:</span> Managed <span class="highlight-text">agile development</span> with R&D team of ~10 engineers, working directly in <span class="highlight-text">GitHub</span> and prototyping in <span class="highlight-text">Cursor IDE</span>.</li>
            <li><span class="achievement-title">Operational Tools:</span> Delivered tools for operational teams including <span class="highlight-text">fabrication instruction systems</span>, factory floor <span class="highlight-text">QC interfaces</span>, and mobile apps for site workers.</li>
        </ul>
    </div>
    
    <div class="job">
        <div class="job-header">
            <h3><a href="https://www.hqa.co.il/" target="_blank" class="company-link">HQ ARCHITECTS</a></h3>
            <span class="job-date">2018 → 2020</span>
        </div>
        <div class="job-title">Computational Designer | Tel Aviv, Israel</div>
        <div class="job-summary">
            Led technology-driven projects including NASA Mars Habitat Challenge, applying algorithmic design to complex spatial problems.
        </div>
        <ul class="achievements">
            <li><span class="achievement-title">Mars Habitat:</span> Led <span class="highlight-text">NASA Mars Habitat Challenge</span> project, applying <span class="highlight-text">algorithmic design</span> to complex spatial problems.</li>
            <li><span class="achievement-title">Urban Planning:</span> Developed <span class="highlight-text">computational design solutions</span> for urban planning using <span class="highlight-text">data analysis</span> and <span class="highlight-text">parametric modeling</span>.</li>
            <li><span class="achievement-title">Generative Design:</span> Architected <span class="highlight-text">custom algorithms</span> with <span class="highlight-text">Grasshopper Python</span> for generative design and optimization workflows.</li>
            <li><span class="achievement-title">Multi-disciplinary:</span> Collaborated on residential, public, and urban-scale projects across <span class="highlight-text">multidisciplinary teams</span>.</li>
        </ul>
    </div>
    
    <div class="job">
        <div class="job-title" style="font-weight: 700;">Additional Experience</div>
        <ul class="achievements">
            <li><strong>Instructor, Bezalel Academy (Fall 2025)</strong> - Teaching computational design to 3rd-year architecture students</li>
            <li><strong>Computational Design Architect, ParaGroup (2017)</strong> - Algorithmic design tools for complex projects</li>
            <li><strong>QA Team Lead, SmartType (2012)</strong> - Led QA team for mobile tech startup (founded by Dov Moran)</li>
        </ul>
    </div>
    
    <h2>Education</h2>
    <div class="edu-item">
        <h3>Bachelor of Architecture (B.Arch)</h3>
        <div class="job-title">Bezalel Academy of Art and Design | 2012-2017</div>
        <div style="font-size: 9pt; margin-top: 4px;">Final thesis: Data-driven urban planning with neural network algorithms</div>
    </div>
    
    <h2>Military Service</h2>
    <div class="edu-item">
        <h3>Intelligence Analyst & Commander</h3>
        <div class="job-title">IDF Unit 8200 | 2008-2011</div>
        <div style="font-size: 9pt; margin-top: 4px;">Intelligence Force Course graduate, developed analytical methodologies and led team operations</div>
    </div>
    
    <h2>Technical Skills</h2>
    <div class="skills-row">
        <span class="skills-label">Product Tools:</span>
        <span class="skills-value">Jira, Confluence, Monday.com, AWS, Logz.io</span>
    </div>
    <div class="skills-row">
        <span class="skills-label">Development:</span>
        <span class="skills-value">GitHub, Cursor IDE, LLM API Integration</span>
    </div>
    <div class="skills-row">
        <span class="skills-label">CAD/3D:</span>
        <span class="skills-value">Rhino, Grasshopper, Grasshopper Python, Revit, AutoCAD, Solidworks</span>
    </div>
</body>
</html>
    `;
}

/**
 * Navigation Highlight on Scroll
 * Highlights the active section in navigation
 */
function initNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNav() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("data-section") === sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNav);
  highlightNav(); // Initial call
}

/**
 * Parallax Effects
 * Subtle parallax on scroll for visual interest
 */
function initParallaxEffects() {
  const hero = document.querySelector(".hero");
  const profileDecoration = document.querySelector(".profile-decoration");

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;

    if (hero && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${rate * 0.2}px)`;
    }

    if (profileDecoration && scrolled < window.innerHeight) {
      profileDecoration.style.transform = `translate(${scrolled * 0.03}px, ${
        scrolled * 0.03
      }px)`;
    }
  });
}

/**
 * Add active navigation style
 */
const style = document.createElement("style");
style.textContent = `
    .nav-link.active {
        color: var(--color-text);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Easter egg: Konami code reveals a fun animation
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.code);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(",") === konamiSequence.join(",")) {
    document.body.style.animation = "rainbow 2s linear";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 2000);
  }
});

// Rainbow animation for easter egg
const rainbowStyle = document.createElement("style");
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
