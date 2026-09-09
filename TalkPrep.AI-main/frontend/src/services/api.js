import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Comprehensive Multi-Domain Question Bank per Target Role & Category
const roleQuestionBank = {
  'Software Engineer': {
    Technical: [
      'Explain how REST APIs handle idempotent versus non-idempotent HTTP methods like GET, PUT, and POST.',
      'How do you manage cross-cutting concerns like authentication, error handling, and logging in a multi-layer application?',
      'Explain the difference between SQL transactions (ACID guarantees) and NoSQL eventual consistency (BASE model).',
      'Explain how data structures like HashMaps achieve O(1) average lookup speeds and how hash collisions are resolved.',
      'How do you optimize asynchronous code operations to prevent event loop bottlenecks or memory leaks?'
    ],
    HR: [
      'Describe a time you had to balance shipping a software feature quickly with maintaining code quality and reducing technical debt.',
      'Why do you want to join our engineering team, and what software projects best demonstrate your core engineering skills?',
      'How do you handle technical disagreements with teammates during code reviews?',
      'Tell me about a project that failed or encountered major obstacles and how you helped your team recover.',
      'How do you prioritize learning new software engineering tools and frameworks while keeping up with day-to-day work?'
    ],
    'System Design': [
      'How would you design a scalable rate-limiting service to protect public API endpoints from traffic spikes?',
      'Design a real-time notifications service supporting email, SMS, and push channels with queue fallback retries.',
      'How would you architect a distributed file uploads and storage service for media assets?',
      'Design a scalable user session management architecture across multiple backend microservice instances.',
      'How would you design an automated web crawler and indexing system for processing thousands of web pages?'
    ]
  },
  'Frontend Engineer': {
    Technical: [
      'Explain the difference between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG).',
      'How does the virtual DOM reconciliation algorithm work in React, and how do keys improve list rendering efficiency?',
      'How do you optimize critical rendering path performance, web vitals (LCP, CLS, FID), and asset bundle sizes?',
      'Explain CSS Flexbox versus CSS Grid layout models and when you would combine both in a modern web application.',
      'Explain lexical closures in JavaScript and how they retain access to outer scope variables.'
    ],
    HR: [
      'Why do you want to join our team as a Frontend Engineer, and what frontend projects are you most proud of?',
      'Tell me about a time you had to resolve a design versus engineering conflict regarding a UI feature.',
      'How do you stay updated with rapidly evolving frontend web technologies, frameworks, and browser standards?',
      'Describe a situation where a critical UI bug was reported by users in production. How did you triage and fix it?',
      'How do you collaborate with UX designers and backend engineers during sprint planning?'
    ],
    'System Design': [
      'How would you design a scalable micro-frontend architecture for a multi-team enterprise web platform?',
      'Design a real-time collaborative rich text editor (like Google Docs or Notion) for web browsers.',
      'How would you build a progressive web app (PWA) with offline caching capabilities and background sync?',
      'Design an image lazy-loading and asset CDN delivery optimization strategy for a media-heavy application.',
      'How would you design a state management architecture for an app with millions of dynamic state updates per second?'
    ]
  },
  'Backend Engineer': {
    Technical: [
      'Explain database indexing mechanisms (B-Trees / Hash Indexes) and why indexing speeds up reads but slows down writes.',
      'What is database connection pooling, and how does it optimize server resource utilization during high-concurrency traffic?',
      'Compare message brokers like Apache Kafka and RabbitMQ when implementing event-driven backend architectures.',
      'Explain the difference between SQL transactions (ACID guarantees) and NoSQL eventual consistency (BASE model).',
      'How would you design a secure, distributed authentication system using JWTs, Refresh Tokens, and OAuth 2.0?'
    ],
    HR: [
      'Why are you interested in backend infrastructure, and what complex API or database challenge have you solved?',
      'Tell me about a project where you diagnosed a severe backend memory leak or database bottleneck and how you fixed it.',
      'How do you ensure backward compatibility when making breaking updates to public REST API endpoints?',
      'Describe a situation where you had to negotiate API contracts with frontend engineers under a tight deadline.',
      'How do you handle technical debt in legacy backend microservices while delivering new features?'
    ],
    'System Design': [
      'How would you design a high-throughput URL shortening service like Bitly handling millions of clicks per day?',
      'Design a scalable distributed rate-limiter middleware to protect backend API endpoints from DDoS attacks.',
      'How would you architect a distributed caching layer using Redis to reduce database read pressure by 90%?',
      'Design a real-time notification service (Email, SMS, Push) supporting priority queues and failover retries.',
      'How would you design a database sharding and replication strategy for a globally distributed banking system?'
    ]
  },
  'DevOps Engineer': {
    Technical: [
      'Explain the containerization workflow in Docker and how multi-stage builds help create lightweight production images.',
      'What is Infrastructure as Code (IaC) using tools like Terraform, and how do you prevent configuration drift?',
      'Explain Kubernetes cluster orchestration components (Pods, Deployments, Services, Ingress, and HPA).',
      'How do you implement centralized logging and monitoring using Prometheus, Grafana, and ELK stack?',
      'Explain Blue-Green deployments versus Canary releases and how traffic splitting is managed.'
    ],
    HR: [
      'Tell me about a major production outage you responded to. What was the root cause and post-mortem resolution?',
      'How do you advocate for DevOps culture and automation practices when working with developer teams?',
      'Describe a time you automated a manual deployment process that saved significant engineering hours.',
      'How do you prioritize security patches and infrastructure upgrades without disrupting live applications?',
      'How do you handle stress and clear communication during critical system downtime incidents?'
    ],
    'System Design': [
      'Design a fully automated CI/CD deployment pipeline with multi-environment staging, security scans, and auto-rollback.',
      'How would you design a zero-downtime multi-region cloud deployment architecture on AWS or GCP?',
      'Design a centralized secrets management and IAM security architecture for enterprise Kubernetes clusters.',
      'How would you build an automated disaster recovery system with multi-region backup replication and RTO/RPO targets?',
      'Design an auto-scaling infrastructure strategy for an e-commerce platform anticipating 100x traffic during Black Friday.'
    ]
  },
  'Data Scientist': {
    Technical: [
      'Explain the trade-offs between bias and variance in Machine Learning models, and how cross-validation mitigates overfitting.',
      'How do Transformer architectures and Attention mechanisms improve performance over traditional RNNs for sequence data?',
      'What feature engineering techniques do you apply when dealing with missing values, categorical encoding, and imbalanced data?',
      'Explain model evaluation metrics (Precision, Recall, F1-Score, ROC-AUC) and when to prioritize Precision over Recall.',
      'How does gradient descent optimization work, and what is the difference between Batch, Stochastic, and Mini-batch GD?'
    ],
    HR: [
      'Describe a machine learning project you built from data ingestion to model deployment, and how you tracked model drift.',
      'How do you explain complex machine learning model predictions to non-technical business stakeholders?',
      'Tell me about a time when a model you trained failed to perform well in production and how you troubleshot it.',
      'How do you balance model complexity and interpretability when selecting algorithms for production?',
      'Why are you passionate about data science, and what recent ML research paper or tool has excited you?'
    ],
    'System Design': [
      'Design a real-time recommendation engine pipeline (like Netflix or Spotify) serving personalized items to millions of users.',
      'How would you architect an end-to-end MLOps pipeline for continuous model retraining, testing, and deployment?',
      'Design a real-time fraud detection machine learning system for credit card transactions with under 50ms latency.',
      'How would you design a large language model (LLM) RAG (Retrieval-Augmented Generation) system for enterprise search?',
      'Design a scalable data pipeline for processing and modeling petabytes of streaming sensor telemetry data.'
    ]
  },
  'Data Analyst': {
    Technical: [
      'Explain SQL Window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD) and provide a scenario where they are essential.',
      'How do you design business intelligence dashboards in Tableau or PowerBI that convey key metrics clearly without clutter?',
      'What statistical methodologies and p-value thresholds do you use to verify the statistical significance of an A/B test?',
      'Explain the difference between OLTP (Transactional) and OLAP (Analytical) database structures and data warehousing models.',
      'How do you handle dirty, incomplete, or duplicate data in large datasets during ETL pipeline processing?'
    ],
    HR: [
      'Tell me about a time your data analysis revealed an unexpected insight that directly influenced a key business decision.',
      'How do you prioritize multiple data requests from different departments when resources are limited?',
      'Describe a situation where stakeholders disputed your analytical findings and how you defended your methodology.',
      'How do you ensure accuracy and double-check your data queries before presenting reports to leadership?',
      'Why do you enjoy data analytics, and what domain (e.g. finance, product, marketing) interests you most?'
    ],
    'System Design': [
      'Design a scalable Data Warehouse architecture (Snowflake/BigQuery) for multi-channel e-commerce analytics.',
      'How would you design an automated ETL data pipeline aggregating daily user retention metrics from raw log files?',
      'Design an executive KPI reporting dashboard system with real-time alerting for anomaly metric drops.',
      'How would you build a self-service analytics data platform empowering business analysts to query data safely?',
      'Design an A/B testing experiment tracking and analytics platform for measuring feature rollouts.'
    ]
  },
  'Mobile Engineer': {
    Technical: [
      'Explain memory management in mobile development (ARC in Swift/iOS or Garbage Collection in Kotlin/Android) and retain cycles.',
      'How do you handle offline-first data storage and sync local database caches with remote cloud REST APIs?',
      'What architecture patterns (MVVM, VIPER, MVI) do you use in mobile apps to separate presentation logic from data layers?',
      'Explain mobile app lifecycle states (Foreground, Background, Suspended) and how state preservation works.',
      'How do you optimize mobile app startup time, battery consumption, and smooth 60fps UI scrolling?'
    ],
    HR: [
      'Tell me about a challenging mobile UI animation or custom gesture control you implemented.',
      'Describe a scenario where you debugged an unexpected app crash or frame rate stutter during continuous scrolling.',
      'How do you coordinate mobile app releases with App Store and Google Play review guidelines and approval cycles?',
      'How do you handle device fragmentation across different screen sizes and operating system versions?',
      'Why do you specialize in mobile app development, and what native or cross-platform tools do you prefer?'
    ],
    'System Design': [
      'Design an offline-first mobile chat application (like WhatsApp or Signal) with local encryption and cloud sync.',
      'How would you architect a mobile newsfeed application with dynamic image caching and pagination?',
      'Design a mobile location-tracking service (like Uber or Lyft) that efficiently streams GPS coordinates without draining battery.',
      'How would you design a modular mobile SDK distributed to third-party developers?',
      'Design a push notification and deep-linking architecture for a multi-feature mobile banking app.'
    ]
  },
  'Cybersecurity Specialist': {
    Technical: [
      'Explain the OWASP Top 10 vulnerabilities (such as SQL Injection, XSS, and Broken Access Control) and their mitigations.',
      'What is Zero Trust Architecture, and how does it differ from traditional perimeter-based network security models?',
      'Explain asymmetric versus symmetric encryption, and how TLS/SSL handshakes establish secure communication channels.',
      'How do Multi-Factor Authentication (MFA), OAuth 2.0, and SAML single sign-on function from a security perspective?',
      'What are penetration testing methodologies (Reconnaissance, Exploitation, Post-exploitation) and ethical hacking boundaries?'
    ],
    HR: [
      'Describe how you conducted a security audit that exposed a critical vulnerability and how it was remediated.',
      'How do you promote a security-conscious culture among developers who view security controls as friction?',
      'Tell me about a time you handled a suspected security breach or phishing incident. What steps did you take?',
      'How do you stay informed about newly published Zero-Day vulnerabilities and CVE security patches?',
      'Why did you choose a career in cybersecurity, and what security certifications or lab challenges have you completed?'
    ],
    'System Design': [
      'Design an enterprise Identity and Access Management (IAM) architecture with Role-Based Access Control (RBAC) and MFA.',
      'How would you design a secure Security Information and Event Management (SIEM) pipeline analyzing gigabytes of audit logs?',
      'Design an automated vulnerability scanning and patch management system for multi-cloud infrastructure.',
      'How would you architect a Secure Software Development Lifecycle (SSDLC) incorporating SAST, DAST, and secret scanning?',
      'Design a DDoS mitigation and Web Application Firewall (WAF) strategy for high-availability enterprise services.'
    ]
  },
  'Product Manager': {
    Technical: [
      'How do you use frameworks like RICE or MoSCoW to prioritize product features when engineering resources are constrained?',
      'What key telemetry metrics (NPS, CAC, LTV, Retention cohort analysis) do you monitor to measure product-market fit?',
      'How do you write clear user stories, acceptance criteria, and edge-case definitions for agile development teams?',
      'Explain how you conduct competitor analysis and market positioning studies when planning new product features.',
      'How do you define a Minimum Viable Product (MVP) scope to test hypotheses quickly without over-engineering?'
    ],
    HR: [
      'Tell me about a product launch that did not meet initial engagement targets. What lessons did you learn and how did you pivot?',
      'How do you resolve conflicting priorities between technical engineering debt reduction and sales-driven feature requests?',
      'Describe a time you had to align engineering, design, and executive teams around a controversial product decision.',
      'How do you gather qualitative user feedback and synthesize it with quantitative analytics data?',
      'Why do you want to manage products at our company, and what product of ours would you improve first?'
    ],
    'System Design': [
      'Design the product strategy and feature roadmap for launching an AI-powered mock interview coaching feature.',
      'How would you design a user onboarding flow for a complex SaaS application to maximize 30-day user retention?',
      'Design a feature flag and A/B testing experiment strategy for rolling out a major navigation redesign.',
      'How would you design a freemium-to-paid conversion funnel strategy for a B2B productivity platform?',
      'Design a product feedback loop system capturing in-app user bug reports, feature requests, and sentiment scores.'
    ]
  },
  'UI/UX Designer': {
    Technical: [
      'Explain WCAG 2.1 accessibility guidelines, color contrast requirements, and screen reader semantic tagging in web interfaces.',
      'What is your end-to-end design process from user research and wireframing to high-fidelity prototyping and usability testing?',
      'How do you design and maintain a component-based Design System to ensure brand consistency across web and mobile platforms?',
      'Explain visual hierarchy, typography scales, grid systems, and spacing rules in modern dark/light UI designs.',
      'What is Fitts\'s Law and Hicks\'s Law in user experience design, and how do they inform CTA placement and navigation length?'
    ],
    HR: [
      'Describe a project where user testing feedback completely contradicted your initial design hypotheses and how you adapted.',
      'How do you hand off designs to frontend engineers and ensure design fidelity is maintained during implementation?',
      'Tell me about a time a product manager or stakeholder asked for a UI change that hurt user experience. How did you handle it?',
      'How do you balance aesthetic elegance with functional clarity and performance constraints in web apps?',
      'Why are you passionate about UI/UX design, and what design portfolio project best showcases your problem-solving?'
    ],
    'System Design': [
      'Design a comprehensive design system UI kit for an enterprise analytics application supporting dark mode and themes.',
      'How would you redesign a complex, multi-step checkout and payment workflow to minimize drop-off rates?',
      'Design an intuitive user dashboard interface for managing cloud server infrastructure and live performance metrics.',
      'How would you architect a user research and continuous usability testing framework for a fast-growing mobile app?',
      'Design an accessible, responsive navigation pattern for a content-heavy news media website with thousands of categories.'
    ]
  },
  'QA Automation Engineer': {
    Technical: [
      'Explain the Testing Pyramid (Unit, Integration, End-to-End) and how you determine optimal test distribution.',
      'How do you build a maintainable automated test framework using Page Object Model (POM) in Selenium, Playwright, or Cypress?',
      'How do you integrate automated test suites into CI/CD pipelines to block regressive deployments without slowing releases?',
      'Explain the difference between smoke testing, regression testing, load testing, and exploratory testing.',
      'How do you automate API testing to validate HTTP status codes, JSON payload schemas, and response latency SLAs?'
    ],
    HR: [
      'Tell me about a critical bug that escaped to production. How did you update your test coverage to ensure it never recurs?',
      'How do you handle situations where developers mark a reported bug as "works on my machine" or "by design"?',
      'Describe a project where you introduced test automation from scratch to a team relying entirely on manual testing.',
      'How do you prioritize test cases when release deadlines leave insufficient time for complete regression testing?',
      'Why did you choose QA automation, and what test frameworks or programming languages do you prefer?'
    ],
    'System Design': [
      'Design a scalable distributed test execution grid capable of running thousands of automated UI tests in parallel.',
      'How would you architect an end-to-end automated API testing framework with synthetic data generation and mock servers?',
      'Design a continuous performance and load testing framework (using JMeter/k6) integrated into nightly CI builds.',
      'How would you design an automated visual regression testing pipeline comparing UI screenshot diffs on pull requests?',
      'Design a bug tracking and test case management metric dashboard for reporting release readiness to management.'
    ]
  },
  'System Architect': {
    Technical: [
      'Explain the CAP theorem and how you choose between Consistency, Availability, and Partition Tolerance in distributed databases.',
      'How do you evaluate microservices versus monolithic architectures, and when is a modular monolith the right choice?',
      'Explain strategies for database sharding, read replicas, multi-region replication, and handling split-brain scenarios.',
      'What design patterns (CQRS, Event Sourcing, Circuit Breaker, Saga Pattern) do you use for distributed data management?',
      'How do you design high-availability system topologies targeting 99.999% uptime SLAs across cloud providers?'
    ],
    HR: [
      'Describe a complex enterprise software architecture you designed from scratch, explaining key technical trade-offs made.',
      'How do you convince engineering leadership and product managers to invest in major architectural refactoring?',
      'Tell me about an architectural decision you made that did not scale as expected. What did you learn and how did you adapt?',
      'How do you mentor senior developers and establish architectural guidelines across multi-team organizations?',
      'Why do you enjoy software system architecture, and how do you stay current with emerging enterprise technologies?'
    ],
    'System Design': [
      'Design a global, resilient, event-driven video streaming platform (like Netflix or YouTube) serving millions of viewers.',
      'How would you design a distributed financial ledger system handling millions of concurrent high-value transactions safely?',
      'Design a real-time global ridesharing system (like Uber) managing driver matching, spatial indexing, and surge pricing.',
      'How would you architect an enterprise cloud IoT telemetry platform ingesting billions of events per day?',
      'Design a multi-tenant SaaS architecture supporting isolated customer data, dynamic custom domains, and auto-scaling.'
    ]
  }
};

// Helper function to resolve target role key and select role-specific questions
const getRoleQuestions = (roleStr = 'Software Engineer', typeStr = 'Technical', diffStr = 'Intermediate', numQ = 5) => {
  const roleLower = (roleStr || '').toLowerCase();
  let selectedRoleKey = 'Software Engineer';

  if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('vue') || roleLower.includes('angular') || roleLower.includes('css')) {
    selectedRoleKey = 'Frontend Engineer';
  } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('express') || roleLower.includes('java developer') || roleLower.includes('python developer')) {
    selectedRoleKey = 'Backend Engineer';
  } else if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('aws') || roleLower.includes('kubernetes') || roleLower.includes('sre')) {
    selectedRoleKey = 'DevOps Engineer';
  } else if (roleLower.includes('data sci') || roleLower.includes('machine learning') || roleLower.includes('ml') || roleLower.includes('ai')) {
    selectedRoleKey = 'Data Scientist';
  } else if (roleLower.includes('data anal') || roleLower.includes('sql') || roleLower.includes('bi') || roleLower.includes('tableau') || roleLower.includes('business analyst')) {
    selectedRoleKey = 'Data Analyst';
  } else if (roleLower.includes('mobile') || roleLower.includes('ios') || roleLower.includes('android') || roleLower.includes('flutter') || roleLower.includes('react native')) {
    selectedRoleKey = 'Mobile Engineer';
  } else if (roleLower.includes('cyber') || roleLower.includes('security') || roleLower.includes('infosec')) {
    selectedRoleKey = 'Cybersecurity Specialist';
  } else if (roleLower.includes('product') || roleLower.includes('pm') || roleLower.includes('scrum')) {
    selectedRoleKey = 'Product Manager';
  } else if (roleLower.includes('ui') || roleLower.includes('ux') || roleLower.includes('design')) {
    selectedRoleKey = 'UI/UX Designer';
  } else if (roleLower.includes('qa') || roleLower.includes('test') || roleLower.includes('automation') || roleLower.includes('sdet')) {
    selectedRoleKey = 'QA Automation Engineer';
  } else if (roleLower.includes('architect')) {
    selectedRoleKey = 'System Architect';
  }

  const roleBank = roleQuestionBank[selectedRoleKey] || roleQuestionBank['Software Engineer'];
  let categoryQuestions = roleBank[typeStr] || roleBank['Technical'] || roleBank['HR'] || roleBank['System Design'];

  if (!categoryQuestions || categoryQuestions.length === 0) {
    categoryQuestions = roleBank['Technical'];
  }

  return categoryQuestions.slice(0, numQ);
};

// Heuristic evaluation logic for mock platform answers
const evaluateAnswer = (questionText, answerText) => {
  const answer = (answerText || '').trim().toLowerCase();
  
  // 1. Extreme short answers get very low score
  if (answer.length < 15) {
    return {
      score: 30,
      feedback: 'Your answer is extremely brief and lacks explanation. Try to elaborate on your points.',
      strengths: ['None noted due to short response.'],
      weaknesses: ['Too brief, no depth, missing core definitions.'],
      improvementSuggestions: ['Elaborate on definitions and give runtime examples.'],
      modelAnswer: 'A model answer would explain the core concepts with detail and contrast the options.'
    };
  }

  // 2. Unsure answers
  if (answer.includes('don\'t know') || answer.includes('dont know') || answer.includes('no idea') || answer.includes('unsure')) {
    return {
      score: 40,
      feedback: 'You stated you were unsure or did not know the answer. Let\'s practice framing what you do know.',
      strengths: ['Honest feedback.'],
      weaknesses: ['Lacks conceptual understanding of the topic.'],
      improvementSuggestions: ['Review basic terminology and definitions for this role.'],
      modelAnswer: 'A model answer would detail the definitions, scope, and trade-offs of this specific topic.'
    };
  }

  // 3. Dynamic scoring based on keywords
  let baseScore = 65; // Starting score for reasonable length
  let matchedKeywords = [];
  let strengths = [];
  let weaknesses = [];
  let improvementSuggestions = [];
  let feedback = '';

  const qLower = (questionText || '').toLowerCase();

  // Multi-domain keyword checkers
  if (qLower.includes('let') || qLower.includes('const') || qLower.includes('virtual dom') || qLower.includes('render') || qLower.includes('react') || qLower.includes('closure')) {
    const keywords = ['scope', 'hoist', 'block', 'function', 'assign', 'es6', 'diff', 'reconciliation', 'memory', 'state', 'closure'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Provided solid frontend technical definitions and framework context.');
    feedback = 'Great job addressing the frontend technical concept. You detailed key rendering or scoping mechanics well.';
  } else if (qLower.includes('index') || qLower.includes('sql') || qLower.includes('database') || qLower.includes('acid') || qLower.includes('nosql') || qLower.includes('kafka') || qLower.includes('pool')) {
    const keywords = ['b-tree', 'lookup', 'write', 'read', 'acid', 'base', 'transaction', 'sharding', 'replica', 'partition', 'topic', 'broker'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Demonstrated strong backend database & data modeling architecture knowledge.');
    feedback = 'Clear backend explanation. You highlighted database indexing, transaction guarantees, or broker throughput trade-offs.';
  } else if (qLower.includes('docker') || qLower.includes('kubernetes') || qLower.includes('terraform') || qLower.includes('ci/cd') || qLower.includes('pipeline') || qLower.includes('monitoring')) {
    const keywords = ['container', 'image', 'pod', 'deployment', 'ingress', 'hpa', 'iac', 'drift', 'prometheus', 'grafana', 'automation'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Demonstrated solid DevOps infrastructure and deployment pipeline principles.');
    feedback = 'Strong DevOps technical answer covering containerization, infrastructure drift, or deployment automation.';
  } else if (qLower.includes('bias') || qLower.includes('variance') || qLower.includes('transformer') || qLower.includes('feature') || qLower.includes('precision') || qLower.includes('model')) {
    const keywords = ['overfitting', 'underfitting', 'cross-validation', 'attention', 'recall', 'f1', 'gradient', 'hyperparameter', 'dataset'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Demonstrated clear statistical data science and machine learning concepts.');
    feedback = 'Well-articulated data science response detailing model optimization, feature engineering, or evaluation metrics.';
  } else if (qLower.includes('window') || qLower.includes('tableau') || qLower.includes('a/b') || qLower.includes('olap') || qLower.includes('etl') || qLower.includes('p-value')) {
    const keywords = ['row_number', 'rank', 'dashboard', 'metric', 'kpi', 'statistical', 'significance', 'warehouse', 'query', 'transformation'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Showcased robust data analytics, SQL windowing, and business intelligence reporting insight.');
    feedback = 'Solid analytical answer! You covered data query structures, business KPIs, and statistical verification methods.';
  } else if (qLower.includes('owasp') || qLower.includes('zero trust') || qLower.includes('tls') || qLower.includes('mfa') || qLower.includes('penetration') || qLower.includes('vulnerability')) {
    const keywords = ['injection', 'xss', 'csrf', 'encryption', 'handshake', 'authentication', 'rbac', 'audit', 'mitigation', 'firewall'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Identified security vulnerability vectors, cryptographic handshakes, and Zero Trust security controls.');
    feedback = 'Excellent security response! You articulated vulnerability remediation, access control, and network protection strategies.';
  } else if (qLower.includes('rice') || qLower.includes('user story') || qLower.includes('nps') || qLower.includes('mvp') || qLower.includes('prioritize') || qLower.includes('roadmap')) {
    const keywords = ['moscow', 'acceptance criteria', 'retention', 'cohort', 'stakeholder', 'telemetry', 'feedback', 'iteration', 'value'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Structured product management response highlighting prioritization metrics and user-centric strategy.');
    feedback = 'Great product management answer! You framed user stories, business telemetry, and agile stakeholder prioritization clearly.';
  } else if (qLower.includes('wcag') || qLower.includes('wireframe') || qLower.includes('design system') || qLower.includes('contrast') || qLower.includes('prototype') || qLower.includes('accessibility')) {
    const keywords = ['contrast', 'usability', 'component', 'hierarchy', 'fitts', 'typography', 'grid', 'heuristics', 'user flow'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Demonstrated deep UX design principles, accessibility guidelines, and design system architecture.');
    feedback = 'Outstanding UI/UX design response! You explained accessibility compliance, wireframe fidelity, and design system scalability.';
  } else if (qLower.includes('join') || qLower.includes('motivated') || qLower.includes('fail') || qLower.includes('setback') || qLower.includes('conflict') || qLower.includes('deadline')) {
    const keywords = ['star', 'situation', 'task', 'action', 'result', 'learn', 'growth', 'team', 'responsibility', 'outcome'];
    keywords.forEach(kw => { if (answer.includes(kw)) { baseScore += 4; matchedKeywords.push(kw); } });
    strengths.push('Used structured STAR storytelling framework with clear personal accountability.');
    feedback = 'Excellent behavioral response! You framed your professional story constructively using clear action and result steps.';
  } else {
    // General fallback evaluation based on word count
    const wordsCount = answer.split(/\s+/).length;
    if (wordsCount > 50) {
      baseScore += 15;
    } else if (wordsCount > 25) {
      baseScore += 5;
    }
    strengths.push('Provided a descriptive response to the question prompt.');
    feedback = 'Your answer addresses the prompt requirements well with relevant domain terminology.';
  }

  // Cap score between 45 and 98
  const score = Math.max(45, Math.min(98, baseScore));
  
  if (strengths.length === 0) strengths.push('Clear articulation and responsive delivery.');
  if (weaknesses.length === 0) weaknesses.push('Could provide deeper architectural or quantitative context.');
  if (improvementSuggestions.length === 0) improvementSuggestions.push('Support your response with concrete examples from your past projects.');

  return {
    score,
    feedback,
    strengths,
    weaknesses,
    improvementSuggestions,
    modelAnswer: 'A model answer should define key concepts clearly, name relevant implementation considerations, outline trade-offs, and detail a step-by-step resolution.'
  };
};

// Adapter override for demo/mock mode
const originalAdapter = api.defaults.adapter || axios.defaults.adapter;
api.defaults.adapter = async (config) => {
  const token = localStorage.getItem('token');
  if (token === 'mock-jwt-token-for-demo-purposes') {
    // Get logged-in user email
    const loggedInUserStr = localStorage.getItem('user');
    let userEmail = 'user@talkprep.ai';
    if (loggedInUserStr) {
      try {
        userEmail = JSON.parse(loggedInUserStr).email || 'user@talkprep.ai';
      } catch (e) {
        console.error(e);
      }
    }

    // Helper functions to get/set dashboard data per user
    const getDashboardData = (email) => {
      const key = `dashboard_data_${email}`;
      let saved = localStorage.getItem(key);
      if (!saved) {
        const isDefaultUser = email === 'user@talkprep.ai';
        const isDefaultAdmin = email === 'admin@talkprep.ai';
        
        const defaultData = {
          stats: {
            interviewsCompleted: isDefaultUser ? 3 : isDefaultAdmin ? 10 : 0,
            challengesSolved: isDefaultUser ? 2 : isDefaultAdmin ? 8 : 0,
            averageInterviewScore: isDefaultUser ? 82 : isDefaultAdmin ? 92 : 0,
            streakCount: isDefaultUser ? 4 : isDefaultAdmin ? 12 : 0
          },
          badges: isDefaultUser ? [
            { title: 'Welcome onboard!', description: 'Created your AI Mock Interview account.', icon: 'Award' },
            { title: 'Smart Coder', description: 'Solved a daily coding challenge.', icon: 'Award' }
          ] : [
            { title: 'Welcome onboard!', description: 'Created your AI Mock Interview account.', icon: 'Award' }
          ],
          recentInterviews: isDefaultUser ? [
            {
              _id: 'mock-session-1',
              role: 'Software Engineer',
              type: 'Technical',
              difficulty: 'Intermediate',
              overallScore: 82,
              createdAt: new Date().toISOString(),
              questions: [
                {
                  questionText: 'Explain the event loop in JavaScript and how it handles asynchronous operations.',
                  evaluation: {
                    score: 82,
                    feedback: 'Your answer is well-structured and covers the key points successfully.',
                    strengths: [
                      'Clear explanation of the Call Stack and Task Queues.',
                      'Good pacing and vocal articulation.'
                    ],
                    weaknesses: [
                      'Could mention the Microtask Queue specifically.'
                    ],
                    improvementSuggestions: [
                      'Explain the priority differences between promise callbacks and timeouts.'
                    ],
                    modelAnswer: 'JavaScript executes synchronous code on the call stack. Asynchronous callbacks are queued in the Task/Microtask queues, which the event loop moves to the stack once empty.'
                  }
                }
              ]
            }
          ] : [],
          recentResume: isDefaultUser ? {
            fileName: 'John_Candidate_Resume.pdf',
            score: 85
          } : null,
          dailyChallenge: {
            _id: 'mock-challenge-1',
            title: 'Two Sum',
            description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
            difficulty: 'Easy'
          },
          weeklyActivity: isDefaultUser ? [
            { day: 'Mon', count: 1 },
            { day: 'Tue', count: 2 },
            { day: 'Wed', count: 0 },
            { day: 'Thu', count: 1 },
            { day: 'Fri', count: 3 },
            { day: 'Sat', count: 1 },
            { day: 'Sun', count: 0 }
          ] : [
            { day: 'Mon', count: 0 },
            { day: 'Tue', count: 0 },
            { day: 'Wed', count: 0 },
            { day: 'Thu', count: 0 },
            { day: 'Fri', count: 0 },
            { day: 'Sat', count: 0 },
            { day: 'Sun', count: 0 }
          ]
        };
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
      }
      return JSON.parse(saved);
    };

    const saveDashboardData = (email, data) => {
      const key = `dashboard_data_${email}`;
      localStorage.setItem(key, JSON.stringify(data));
    };

    const url = config.url || '';
    let data = { success: true };
    
    if (url.includes('/auth/profile')) {
      const user = localStorage.getItem('user');
      data = { success: true, user: user ? JSON.parse(user) : {} };
    } else if (url.includes('/dashboard')) {
      data = {
        success: true,
        data: getDashboardData(userEmail)
      };
    } else if (url.includes('/resumes/analyze')) {
      const payload = config.data ? JSON.parse(config.data) : {};
      const score = 80 + Math.floor(Math.random() * 15);
      const fileName = payload.fileName || 'Resume.pdf';
      
      const dash = getDashboardData(userEmail);
      dash.recentResume = {
        fileName: fileName,
        score: score
      };
      saveDashboardData(userEmail, dash);
      
      data = {
        success: true,
        analysis: {
          fileName: fileName,
          score: score,
          matchedKeywords: ['React', 'JavaScript', 'CSS', 'HTML', 'Git'],
          missingKeywords: ['TypeScript', 'Jest', 'CI/CD'],
          atsSuggestions: [
            'Consider adding more measurable impact metrics to your bullet points.',
            'Include missing keywords such as TypeScript in your skills section.',
            'Ensure layout uses standard margins and simple columns.'
          ],
          formattingFeedback: [
            'Formatting looks clean and easily parsable.',
            'Fonts and headers are structured sequentially.'
          ],
          roleCompatibility: [
            { role: 'Frontend Engineer', compatibilityPercentage: score },
            { role: 'Software Engineer', compatibilityPercentage: Math.max(50, score - 10) }
          ]
        }
      };
    } else if (url.includes('/challenges/') && url.includes('/submit')) {
      const dash = getDashboardData(userEmail);
      dash.stats.challengesSolved += 1;
      
      if (!dash.badges.some(b => b.title === 'Smart Coder')) {
        dash.badges.push({
          title: 'Smart Coder',
          description: 'Solved a daily coding challenge.',
          icon: 'Award'
        });
      }
      saveDashboardData(userEmail, dash);
      
      data = {
        success: true,
        allPassed: true,
        feedback: 'Success: All test cases passed successfully!\nTime Complexity: O(N)\nSpace Complexity: O(N)',
        testResults: [
          { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', actualOutput: '[0, 1]', passed: true },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', actualOutput: '[1, 2]', passed: true }
        ]
      };
    } else if (url.includes('/challenges')) {
      data = {
        success: true,
        challenges: [
          {
            _id: 'mock-challenge-1',
            title: 'Two Sum',
            description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.',
            difficulty: 'Easy',
            category: 'Arrays',
            constraints: ['2 <= nums.length <= 10^4', 'Only one valid answer exists.'],
            boilerplate: {
              javascript: 'function twoSum(nums, target) {\n    // Write your code here\n    \n}',
              python: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
              java: 'public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}'
            },
            hints: [
              'Use a Hash Map to store numbers and their indices.',
              'Compute the complement: target - nums[i].',
              'Check if complement exists in the map.'
            ]
          }
        ]
      };
    } else if (url.includes('/analytics')) {
      const dash = getDashboardData(userEmail);
      data = {
        success: true,
        analytics: {
          overallPerformance: dash.stats.averageInterviewScore || 0,
          speechSpeed: 125,
          fillerWordIndex: 2
        }
      };
    } else if (url.includes('/interviews/start')) {
      const payload = config.data ? JSON.parse(config.data) : {};
      const roleStr = payload.role || 'Software Engineer';
      const typeStr = payload.type || 'Technical';
      const diffStr = payload.difficulty || 'Intermediate';
      const numQ = payload.numQuestions || 5;
      
      const questionsList = getRoleQuestions(roleStr, typeStr, diffStr, numQ);
      
      const sessionId = 'mock-session-' + Date.now();
      const sessionState = {
        id: sessionId,
        role: roleStr,
        type: typeStr,
        difficulty: diffStr,
        numQuestions: numQ,
        currentIndex: 0,
        questions: questionsList.slice(0, numQ),
        answers: []
      };
      
      localStorage.setItem(`active_session_${userEmail}`, JSON.stringify(sessionState));
      
      data = {
        success: true,
        session: {
          id: sessionId,
          role: roleStr,
          type: typeStr,
          difficulty: diffStr,
          currentQuestionText: sessionState.questions[0],
          currentQuestionIndex: 0
        }
      };
    } else if (url.includes('/interviews/') && url.includes('/submit')) {
      const payload = config.data ? JSON.parse(config.data) : {};
      const answerText = payload.answer || '';
      
      const activeSessionKey = `active_session_${userEmail}`;
      const sessionStateStr = localStorage.getItem(activeSessionKey);
      
      if (sessionStateStr) {
        const sessionState = JSON.parse(sessionStateStr);
        const currentIndex = sessionState.currentIndex;
        const currentQuestion = sessionState.questions[currentIndex];
        
        const evaluation = evaluateAnswer(currentQuestion, answerText);
        
        sessionState.answers.push({
          questionText: currentQuestion,
          evaluation: evaluation
        });
        
        const nextIndex = currentIndex + 1;
        sessionState.currentIndex = nextIndex;
        
        if (nextIndex >= sessionState.numQuestions) {
          const overallScore = Math.round(sessionState.answers.reduce((acc, q) => acc + q.evaluation.score, 0) / sessionState.numQuestions);
          
          const completedSession = {
            _id: sessionState.id,
            role: sessionState.role,
            type: sessionState.type,
            difficulty: sessionState.difficulty,
            overallScore: overallScore,
            overallFeedback: 'Great work! You demonstrated strong capability and clear communication skills during this mock round.',
            createdAt: new Date().toISOString(),
            questions: sessionState.answers
          };
          
          const dash = getDashboardData(userEmail);
          dash.stats.interviewsCompleted += 1;
          
          const totalScores = dash.recentInterviews.reduce((acc, s) => acc + s.overallScore, 0) + overallScore;
          dash.stats.averageInterviewScore = Math.round(totalScores / (dash.recentInterviews.length + 1));
          
          dash.recentInterviews.unshift(completedSession);
          dash.stats.streakCount += 1;
          
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const todayName = daysOfWeek[new Date().getDay()];
          const dayAct = dash.weeklyActivity.find(d => d.day === todayName);
          if (dayAct) {
            dayAct.count += 1;
          }
          
          if (overallScore >= 80 && !dash.badges.some(b => b.title === 'Honors Prep')) {
            dash.badges.push({
              title: 'Honors Prep',
              description: 'Scored above 80% on average.',
              icon: 'Award'
            });
          }
          
          saveDashboardData(userEmail, dash);
          localStorage.removeItem(activeSessionKey);
          
          data = {
            success: true,
            isFinished: true,
            session: completedSession
          };
        } else {
          localStorage.setItem(activeSessionKey, JSON.stringify(sessionState));
          
          data = {
            success: true,
            isFinished: false,
            evaluation: evaluation,
            currentQuestionText: sessionState.questions[nextIndex],
            currentQuestionIndex: nextIndex
          };
        }
      } else {
        data = {
          success: false,
          message: 'Active interview session not found.'
        };
      }
    } else if (url.includes('/interviews/')) {
      const pathParts = url.split('/');
      const sessionId = pathParts[pathParts.length - 1];
      
      const dash = getDashboardData(userEmail);
      const session = dash.recentInterviews.find(s => s._id === sessionId);
      
      if (session) {
        data = {
          success: true,
          session: session
        };
      } else {
        data = {
          success: false,
          message: 'Past interview session not found.'
        };
      }
    } else if (url.includes('/ai/coding-hint')) {
      data = {
        success: true,
        hint: 'Hint: Try using a hash map to keep track of indices of elements we have visited. If target minus current element is already in the map, we have found our pair!'
      };
    } else if (url.includes('/ai/evaluate')) {
      data = {
        success: true,
        evaluation: {
          score: 85,
          feedback: 'Excellent response. You clearly defined the core concepts and gave concrete technical examples.'
        }
      };
    } else if (url.includes('/admin/stats')) {
      data = {
        success: true,
        stats: {
          totalUsers: 12,
          totalInterviews: 24,
          totalChallenges: 3,
          activeStreak: 5
        }
      };
    } else if (url.includes('/admin/users')) {
      data = {
        success: true,
        users: [
          { _id: '1', name: 'John Candidate', email: 'user@talkprep.ai', role: 'user', createdAt: new Date().toISOString() },
          { _id: '2', name: 'System Admin', email: 'admin@talkprep.ai', role: 'admin', createdAt: new Date().toISOString() }
        ]
      };
    }
    
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }
  
  if (originalAdapter) {
    return originalAdapter(config);
  }
  
  // Default fallback if adapter is undefined
  return axios.defaults.adapter(config);
};

// Request Interceptor: Attach token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g. 401 Unauthorized logouts)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to authentication page if on a protected route
      const publicPaths = ['/', '/auth', '/about', '/contact'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/auth?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
