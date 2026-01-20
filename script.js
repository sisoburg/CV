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
  initClickEffect();
});

function initJobToggles() {
  // Open the first job by default - DISABLED per user request
  // const firstJob = document.querySelector(".timeline-item.collapsible");
  // if (firstJob) firstJob.classList.add("active");
}

/**
 * Click Effect
 * Creates a fun ripple effect on click
 */
function initClickEffect() {
  document.addEventListener("click", (e) => {
    // Create ripple element
    const ripple = document.createElement("div");
    ripple.classList.add("click-ripple");
    
    // Set position
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    
    // Random vibrant color
    const colors = [
      "var(--col-pink)", 
      "var(--col-blue)", 
      "var(--col-green)", 
      "var(--col-yellow)", 
      "var(--col-purple)",
      "var(--col-teal)",
      "var(--col-orange)"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    ripple.style.backgroundColor = randomColor;
    
    // Add to DOM
    document.body.appendChild(ripple);
    
    // Remove after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
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
      
      // Determine color based on element or category
      let hoverColor = "var(--col-teal)"; // Default default
      
      if (el.classList.contains("competency-card")) {
        const category = el.getAttribute("data-category");
        if (category === "ai") hoverColor = "var(--col-green)";
        else if (category === "construction") hoverColor = "var(--col-blue)";
        else if (category === "algorithm") hoverColor = "var(--col-purple)";
        else if (category === "leadership") hoverColor = "var(--col-orange)";
        else if (category === "automation") hoverColor = "var(--col-teal)";
        else if (category === "manufacturing") hoverColor = "var(--col-text-muted)"; 
      } else if (el.closest(".timeline-item")) {
        hoverColor = "var(--col-blue)";
      } else if (el.tagName === "A") {
        hoverColor = "var(--col-pink)";
      }
      
      cursor.style.setProperty("--cursor-color", hoverColor);
      cursor.style.borderColor = hoverColor;
      cursor.style.backgroundColor = hoverColor.replace(")", ", 0.1)").replace("var(", "rgba(var("); // This is tricky with CSS vars, better to just use opacity in CSS
    });
    
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      cursor.style.removeProperty("--cursor-color");
      cursor.style.removeProperty("border-color");
      cursor.style.removeProperty("background-color");
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
  // Website color palette - matching the CSS variables for tags
  const colors = {
    pink: '#FD79A8',
    accent: '#00CEC9',
    blue: '#0984E3',
    green: '#00B894',
    yellow: '#FDCB6E',
    purple: '#6C5CE7',
    teal: '#00CEC9',
    orange: '#FF9F43',
    red: '#D63031'
  };

  const logos = {
    veev: 'https://i.vimeocdn.com/video/1664187441-14af8a2a2fd49e94a7ba62c2e010386a18bb56d22d1fca6973dd9764a13c576c-d',
    hqa: 'https://cdn.prod.website-files.com/658a931b9df12209e2129eb6/672b7a3526c5948b43dd6ad5_logoforprofile.jpg',
    bezalel: 'https://play-lh.googleusercontent.com/Z4QwZUnC9CsE0UJuIF-nVsRKthqozPZozCWvXRVFkgLxhjFA1j_RFQtqwS2KUXmvWdc_'
  };

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

        .name-accent {
            color: ${colors.pink};
        }
        
        h2 {
            font-size: 11pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #eee;
            padding-bottom: 6px;
            margin: 24px 0 16px 0;
            color: #1a1a1a;
        }
        
        h3 {
            font-size: 11pt;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        a {
            color: ${colors.blue};
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }

        .header {
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
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
            border: 1px solid #eee;
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

        .contact a:hover {
            color: ${colors.accent};
            border-bottom-color: ${colors.accent};
        }

        .linkedin-icon {
            width: 14px;
            height: 14px;
            fill: #666;
            margin-right: 4px;
        }

        .contact a:hover .linkedin-icon {
            fill: #0077b5;
        }

        .summary {
            font-size: 10pt;
            color: #444;
            margin: 12px 0;
            line-height: 1.6;
        }

        .highlight-years {
            background: #f0f0f0;
            padding: 1px 4px;
            border-radius: 3px;
            font-weight: 700;
            color: #000;
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
            padding: 3px 9px;
            border-radius: 4px;
            font-weight: 600;
            background: white;
            border: 1px solid #eee;
            color: #777;
        }

        .competency.ai, 
        .competency.algorithm, 
        .competency.automation, 
        .competency.platform { 
            border-color: ${colors.accent}; 
            color: ${colors.accent}; 
        }

        .highlight-text {
            font-weight: 600;
            background: rgba(0, 206, 201, 0.05);
            padding: 0 4px;
            border-radius: 3px;
            color: #1a1a1a;
            border-bottom: 1px solid rgba(0, 206, 201, 0.2);
        }
        
        .section-unit {
            margin-bottom: 20px;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .company-link {
            color: #1a1a1a;
            text-decoration: none;
            font-weight: 700;
            transition: color 0.2s;
        }
        
        .company-link:hover {
            color: ${colors.accent};
        }

        .company-logo-printable {
            height: 18px;
            width: auto;
            object-fit: contain;
            vertical-align: middle;
        }
        
        .job-title {
            font-family: 'Space Mono', monospace;
            font-size: 9pt;
            color: #666;
        }
        
        .job-date {
            font-family: 'Space Mono', monospace;
            font-size: 8pt;
            color: #1a1a1a;
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: 600;
        }
        
        .job-summary {
            font-size: 9.5pt;
            color: #444;
            margin-top: 4px;
            margin-bottom: 8px;
            line-height: 1.4;
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
            padding-left: 16px;
        }
        
        .achievements li::before {
            content: "▸";
            position: absolute;
            left: 0;
            color: #ccc;
            font-size: 10pt;
        }

        .achievement-tag {
            display: inline-block;
            font-family: 'Space Mono', monospace;
            font-size: 7pt;
            padding: 1px 6px;
            border-radius: 3px;
            color: white;
            margin-right: 6px;
            font-weight: 600;
            text-transform: uppercase;
            vertical-align: middle;
            background: ${colors.accent};
        }

        .achievement-title {
            font-weight: 700;
            color: #2d3436;
            margin-right: 4px;
        }

        .job-highlight {
            background: rgba(0, 206, 201, 0.08);
            border-radius: 4px;
            padding: 4px 8px;
            margin-left: -8px;
        }
        
        .skills-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .skills-category {
            margin-bottom: 12px;
        }
        
        .category-title {
            font-family: 'Space Mono', monospace;
            font-size: 8.5pt;
            font-weight: 700;
            color: #666;
            margin-bottom: 6px;
            text-transform: uppercase;
            display: block;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        .skill-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 8.5pt;
            padding: 3px 8px;
            background: white;
            border: 1px solid #eee;
            border-radius: 4px;
        }

        .skill-icon {
            width: 14px;
            height: 14px;
            object-fit: contain;
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
                <h1>Noam <span class="name-accent">Burg</span></h1>
                <div class="title">Product Manager</div>
                <div class="contact">
                    <span>Nataf, Israel</span>
                    <a href="tel:+972545555656">+972 545-555-656</a>
                    <a href="mailto:sisoburg@gmail.com">sisoburg@gmail.com</a>
                    <a href="https://www.linkedin.com/in/noam-burg-0ab48b14a/" target="_blank">
                        <svg class="linkedin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        <span>linkedin.com/in/noam-burg</span>
                    </a>
                </div>
                <p class="summary">
                    Product Manager combining construction tech expertise with hands-on AI product development. 
                    <span class="highlight-years">5+ years</span> leading complex software products across desktop, web, mobile, and data systems — 
                    from office engineers to factory floor to construction sites.
                </p>
            </div>
            <img src="profile.jpg" alt="Noam Burg" class="profile-pic">
        </div>
    </div>
    
    <h2>Core Competencies</h2>
    <div class="competencies">
        <span class="competency ai">AI Product Development</span>
        <span class="competency algorithm">Algorithmic Solution Design</span>
        <span class="competency automation">CAD Automation & Optimization</span>
        <span class="competency platform">Multi-Platform Development</span>
        <span class="competency strategy">Product Strategy & Roadmapping</span>
        <span class="competency leadership">Product Team Leadership</span>
        <span class="competency construction">Construction Tech & BIM</span>
        <span class="competency manufacturing">Manufacturing & Site Operations</span>
        <span class="competency erp">ERP/PLM System Integration</span>
    </div>
    
    <h2>Professional Experience</h2>
    
    <div class="section-unit">
        <div class="job-header">
            <h3>
                <img src="${logos.veev}" class="company-logo-printable">
                <a href="https://www.veev.com/" target="_blank" class="company-link">VEEV</a>
            </h3>
            <span class="job-date">2020 → Present</span>
        </div>
        <div class="job-title">Product Manager Team Lead 2021-2023 | Tel Aviv, Israel</div>
        <div class="job-summary">
            Led AI-powered construction software platform serving office users, fabrication teams, and site workers across desktop CAD, web, mobile, BI, and data systems.
        </div>
        <ul class="achievements">
            <li><span class="achievement-tag">AI</span><span class="achievement-title">AI QC System:</span> Designed and shipped <span class="highlight-text">AI-based automatic QC system</span> for 3D model validation, integrating <span class="highlight-text">LLM capabilities</span> and reducing manual engineering review time.</li>
            <li><span class="achievement-tag">MCP</span><span class="achievement-title">Model Connectivity:</span> Developed <span class="highlight-text">Model Context Protocol (MCP)</span> integration for Revit, enabling <span class="highlight-text">real-time data synchronization</span> across BIM workflows.</li>
            <li><span class="achievement-tag">LLM</span><span class="achievement-title">Intelligent Chatbot:</span> Built <span class="highlight-text">intelligent chatbot</span> with data warehouse integration, architecting workflows using <span class="highlight-text">LLM APIs</span>.</li>
            <li><span class="achievement-tag">CAD</span><span class="achievement-title">Design Automation:</span> Led the development of <span class="highlight-text">Design Automation CAD tools</span>, streamlining complex engineering workflows and optimizing geometric data processing.</li>
            <li><span class="achievement-tag">Algo</span><span class="achievement-title">Geometric Optimization:</span> Created <span class="highlight-text">geometric optimization algorithms</span> (high-level logic) with technical leads for <span class="highlight-text">automated fabrication processes</span>.</li>
            <li><span class="achievement-tag">Lead</span><span class="achievement-title">Team Management:</span> <span class="highlight-text">Led product team of 3 PMs</span> (2021-2023), establishing roadmaps and strategic initiatives until team restructuring.</li>
            <li><span class="achievement-tag">Agile</span><span class="achievement-title">Agile Execution:</span> Managed <span class="highlight-text">agile development</span> with R&D team of ~10 engineers, working directly in <span class="highlight-text">GitHub</span> and prototyping in <span class="highlight-text">Cursor IDE</span>.</li>
            <li><span class="achievement-tag">Ops</span><span class="achievement-title">Operational Tools:</span> Delivered tools for operational teams including <span class="highlight-text">fabrication instruction systems</span>, factory floor <span class="highlight-text">QC interfaces</span>, and mobile apps for site workers.</li>
        </ul>
    </div>
    
    <div class="section-unit">
        <div class="job-header">
            <h3>
                <img src="${logos.hqa}" class="company-logo-printable">
                <a href="https://www.hqa.co.il/" target="_blank" class="company-link">HQ ARCHITECTS</a>
            </h3>
            <span class="job-date">2018 → 2020</span>
        </div>
        <div class="job-title">Computational Designer | Tel Aviv, Israel</div>
        <div class="job-summary">
            Applying <span class="highlight-text">computational design</span> and <span class="highlight-text">generative design</span> solutions for real-life planning and architecture problems. Implemented urban planning with computational design for <span class="highlight-text">Tel Aviv Municipality</span>.
        </div>
        <ul class="achievements">
            <li><span class="achievement-tag">Data</span><span class="achievement-title">Urban Planning:</span> Developed <span class="highlight-text">computational design solutions</span> for urban planning using <span class="highlight-text">data analysis</span> and <span class="highlight-text">parametric modeling</span>.</li>
            <li><span class="achievement-tag">Python</span><span class="achievement-title">Generative Design:</span> Architected <span class="highlight-text">custom algorithms</span> with <span class="highlight-text">Grasshopper Python</span> for generative design and optimization workflows.</li>
            <li><span class="achievement-tag">Collab</span><span class="achievement-title">Multi-disciplinary:</span> Collaborated on residential, public, and urban-scale projects across <span class="highlight-text">multidisciplinary teams</span>.</li>
            <li><span class="achievement-tag">NASA</span><span class="achievement-title">Mars Habitat:</span> Led <span class="highlight-text">NASA Mars Habitat Challenge</span> project, applying <span class="highlight-text">algorithmic design</span> to complex spatial problems.</li>
        </ul>
    </div>
    
    <div class="section-unit">
        <h3 class="job-title" style="color: #1a1a1a; font-weight: 700; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 8px;">Additional Experience</h3>
        <ul class="achievements">
            <li class="job-highlight">
                <img src="${logos.bezalel}" class="company-logo-printable" style="height: 14px;"> 
                <strong>Instructor, Bezalel Academy (Fall 2025)</strong> — Teaching computational design to 3rd-year architecture students
            </li>
            <li><strong>FABLAB Instructor, Jerusalem FabLab (2015 – 2017)</strong> — Guiding about advanced technologies, digital fabrication, and prototyping in Jerusalem</li>
            <li><strong>Computational Design Architect, ParaGroup (2017)</strong> — Algorithmic design tools for complex projects</li>
            <li><strong>QA Team Lead, SmartType (2012)</strong> — Led QA team for mobile tech startup (founded by Dov Moran)</li>
        </ul>
    </div>
    
    <h2>Education & Service</h2>
    <div class="section-unit">
        <div class="job-header">
            <h3>
                <img src="${logos.bezalel}" class="company-logo-printable">
                Bachelor of Architecture (B.Arch) — Bezalel Academy
            </h3>
            <span class="job-date">2012-2017</span>
        </div>
        <div style="font-size: 9pt; margin-top: 4px;">Final thesis: Data-driven urban planning with neural network algorithms</div>
    </div>
    
    <div class="section-unit">
        <div class="job-header">
            <h3>Intelligence Analyst & Commander — IDF Unit 8200</h3>
            <span class="job-date">2008-2011</span>
        </div>
        <div style="font-size: 9pt; margin-top: 4px;">Intelligence Force Course graduate, developed analytical methodologies and led team operations</div>
    </div>
    
    <h2>Technical Skills</h2>
    <div class="skills-container">
        <div class="skills-category">
            <span class="category-title">Product Tools</span>
            <div class="skills-list">
                <div class="skill-item"><img class="skill-icon" src="https://cdn.simpleicons.org/jira"> Jira</div>
                <div class="skill-item"><img class="skill-icon" src="https://cdn.simpleicons.org/confluence"> Confluence</div>
                <div class="skill-item"><img class="skill-icon" src="https://monday.com/p/wp-content/uploads/2020/07/monday-200x200-1.png"> Monday.com</div>
                <div class="skill-item"><img class="skill-icon" src="https://download.logo.wine/logo/Amazon_Web_Services/Amazon_Web_Services-Logo.wine.png"> AWS</div>
                <div class="skill-item"><img class="skill-icon" src="https://media.glassdoor.com/sqll/1882910/logz-io-squareLogo-1679231434665.png"> Logz.io</div>
            </div>
        </div>
        <div class="skills-category">
            <span class="category-title">Development</span>
            <div class="skills-list">
                <div class="skill-item"><img class="skill-icon" src="https://cdn.simpleicons.org/github"> GitHub</div>
                <div class="skill-item"><img class="skill-icon" src="https://framerusercontent.com/images/lfSBU4EhKcMg3iGg98L2F1ESfA.jpg"> AI IDE (Cursor)</div>
                <div class="skill-item">LLM API Integration</div>
            </div>
        </div>
        <div class="skills-category">
            <span class="category-title">CAD/3D</span>
            <div class="skills-list">
                <div class="skill-item"><img class="skill-icon" src="https://img.icons8.com/ios_filled/1200/rhinoceros-6.jpg"> Rhino</div>
                <div class="skill-item"><img class="skill-icon" src="https://images.seeklogo.com/logo-png/29/2/grasshopper-3d-logo-png_seeklogo-291372.png"> Grasshopper</div>
                <div class="skill-item"><img class="skill-icon" src="https://cdn.simpleicons.org/python"> Python</div>
                <div class="skill-item"><img class="skill-icon" src="https://cdn.simpleicons.org/autodesk"> Revit</div>
                <div class="skill-item"><img class="skill-icon" src="https://cdn.simpleicons.org/autocad"> AutoCAD</div>
                <div class="skill-item"><img class="skill-icon" src="https://cdn.simpleicons.org/dassaultsystemes"> Solidworks</div>
            </div>
        </div>
        <div class="skills-category">
            <span class="category-title">Languages</span>
            <div class="skills-list">
                <div class="skill-item"><img class="skill-icon" src="https://flagcdn.com/w40/il.png"> Hebrew (Native)</div>
                <div class="skill-item"><img class="skill-icon" src="https://flagcdn.com/w40/gb.png"> English (Fluent)</div>
                <div class="skill-item"><img class="skill-icon" src="https://flagcdn.com/w40/fr.png"> French (Speaking)</div>
            </div>
        </div>
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
