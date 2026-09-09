/**
 * Service to interface with OpenAI API or fallback to mock AI when no key is set.
 */

// Simple check to verify if the API key is provided and valid
const hasApiKey = () => {
  const key = process.env.OPENAI_API_KEY;
  return key && key.trim() !== '' && key !== 'your_openai_api_key_here';
};

/**
 * Interacts with chatbot (general questions, coding help, projects, resume, career)
 */
const getChatbotResponse = async (message, chatHistory = []) => {
  if (hasApiKey()) {
    try {
      // In a real environment, we call the OpenAI API.
      // E.g., using fetch or official SDK.
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a helpful, professional, and friendly AI Career & Interview Coach for the "AI Mock Interview Platform".
              Your goal is to answer developer/job-seeker questions, give coding hints, suggest software projects, critique resumes, and provide career advice.
              Keep answers clear, structural, and beautifully formatted in markdown. Focus on beginner-friendly explanations.`
            },
            ...chatHistory.map(ch => ({
              role: ch.sender === 'user' ? 'user' : 'assistant',
              content: ch.text
            })),
            { role: 'user', content: message }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }
      throw new Error(data.error?.message || 'OpenAI empty response');
    } catch (error) {
      console.warn('OpenAI Chat error, falling back to simulated engine:', error.message);
    }
  }

  // Fallback Mock AI Chatbot response
  return new Promise((resolve) => {
    setTimeout(() => {
      const msg = message.toLowerCase();
      let response = '';

      if (msg.includes('project')) {
        response = `### Recommended Projects to boost your resume:
1. **AI Mock Interview Platform (Full Stack)**
   - **Tech Stack**: React, Tailwind CSS, Framer Motion, Express, MongoDB.
   - **Unique Feature**: Web Speech API integration for live mock speech audits.
2. **Real-time Collaborative Code Editor**
   - **Tech Stack**: Next.js, Socket.io, Redis.
   - **Unique Feature**: Split pane editing with integrated compiler simulator.
3. **Automated ATS Resume Parser**
   - **Tech Stack**: Python, FastAPI, SpaCy (NLP), React.
   - **Unique Feature**: Matches resume bullets against job descriptions.`;
      } else if (msg.includes('resume') || msg.includes('cv')) {
        response = `### Top Resume Optimization Tips:
* **Quantify your Impact**: Instead of "built features for app", write *"Optimized search query indexes, reducing load latency by 35% for 10k daily users."*
* **ATS Optimization**: Ensure your skills section contains matching keywords (e.g. *React, Node.js, REST APIs*) instead of vague phrases.
* **Keep it Clean**: Use a single-column layout with clean fonts like *Inter* or *Outfit*. Avoid progress bars for skill meters (ATS can't read them).`;
      } else if (msg.includes('career') || msg.includes('job') || msg.includes('hire')) {
        response = `### Software Engineering Career Roadmap:
1. **Master the Basics**: Build 2 solid full-stack portfolio projects.
2. **Data Structures & Algorithms**: Focus on core topics like Arrays, Two-pointers, HashMaps, Trees, and simple Dynamic Programming.
3. **System Design**: Learn about Load Balancers, Caching, Databases (SQL vs NoSQL), and REST/GraphQL APIs.
4. **Behavioral Interviews**: Prep 3-5 stories using the **STAR** method (Situation, Task, Action, Result) showing leadership or resolving conflicts.`;
      } else if (msg.includes('code') || msg.includes('syntax') || msg.includes('javascript') || msg.includes('react')) {
        response = `### Dynamic Code Assistance:
In JavaScript, React renders elements dynamically using a virtual DOM. If you are preparing for react coding questions, focus on:
* **State Management**: Using \`useState\` and custom hooks.
* **Side Effects**: Cleanup functions in \`useEffect\` to prevent memory leaks.
* **Optimization**: Avoiding unnecessary re-renders using \`useMemo\` and \`useCallback\`.`;
      } else {
        response = `Hello there! I'm your **AI Career Assistant**. I can help you with:
* 💡 **Project Suggestions**: Ask me to *"Suggest coding projects"*
* 📄 **Resume Critiques**: Ask me for *"Resume formatting tips"*
* 🛠️ **Coding Guidance**: Ask me about *"React hooks explanation"*
* 📈 **Career Paths**: Ask me *"How to prepare for System Design"*

What would you like to discuss today?`;
      }
      resolve(response);
    }, 800);
  });
};

/**
 * Generates an interview question dynamically
 */
const generateDynamicQuestion = async (role, type, difficulty, index = 1, options = {}) => {
  const { jobDescription, resumeContent, language, focusAreas, customInstructions, companyName } = options;

  if (hasApiKey()) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert tech recruiter. Generate a single interview question in JSON format.
              The response MUST be a valid JSON object matching this structure:
              {
                "text": "The question text string",
                "suggestedPoints": ["Key point 1 to mention", "Key point 2 to mention"],
                "idealAnswer": "Summarized high-quality ideal response"
              }`
            },
            {
              role: 'user',
              content: `Generate question number ${index} for a ${difficulty} level ${type} interview for a ${role} position.
              ${language ? `Conduct the interview and ask the question in ${language}.` : ''}
              ${companyName ? `Tailor this question to match the interview style and culture of ${companyName}.` : ''}
              ${jobDescription ? `Context - Job Description: "${jobDescription}".` : ''}
              ${resumeContent ? `Context - Candidate Resume: "${resumeContent}". Ask a question testing their matching qualifications or skills.` : ''}
              ${focusAreas ? `Focus Areas: "${focusAreas}".` : ''}
              ${customInstructions ? `Custom Instructions: "${customInstructions}".` : ''}`
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return JSON.parse(data.choices[0].message.content);
      }
      throw new Error('OpenAI empty response');
    } catch (error) {
      console.warn('OpenAI Question generation error, using mock fallback:', error.message);
    }
  }

  // Dynamic fallback mock generator if API key is not configured
  const rLower = (role || '').toLowerCase();
  
  let text = `Can you describe your experience as a ${role} and how you've handled similar challenges in your work?`;
  let suggestedPoints = ["Explain technical workflow", "Discuss choice of technologies", "STAR storytelling framework"];
  let idealAnswer = `A strong answer will explain your previous achievements as a ${role}, walk through the architectural choices made, and detail the technical outcomes.`;

  if (type === 'Technical' || type === 'System Design') {
    if (rLower.includes('frontend') || rLower.includes('react') || rLower.includes('web')) {
      text = `For a ${difficulty}-level ${role} position, how do client-side rendering (CSR), server-side rendering (SSR), and virtual DOM reconciliation optimize web application load performance?`;
      suggestedPoints = ["Virtual DOM diffing", "Critical rendering path", "Bundle splitting & lazy loading", "SSR SEO advantages"];
      idealAnswer = "A top response contrasts CSR initial bundle loads with SSR fast first-contentful-paint, details React reconciliation, and highlights memoization and image lazy loading.";
    } else if (rLower.includes('backend') || rLower.includes('api') || rLower.includes('node') || rLower.includes('java') || rLower.includes('python')) {
      text = `For a ${difficulty}-level ${role} position, how would you design database indexing (B-Trees) and connection pooling to handle high-concurrency API traffic?`;
      suggestedPoints = ["B-Tree index lookups", "Read vs write trade-offs", "Connection pool sizes", "Caching layer (Redis)"];
      idealAnswer = "The ideal answer explains index tree lookups, partitioning read/write queries, tuning database connection pools, and utilizing Redis in-memory caches.";
    } else if (rLower.includes('devops') || rLower.includes('cloud') || rLower.includes('aws') || rLower.includes('kubernetes')) {
      text = `For a ${difficulty}-level ${role} position, how would you design a multi-stage Docker build pipeline and Kubernetes horizontal autoscaling architecture?`;
      suggestedPoints = ["Multi-stage Docker caching", "Kubernetes Pod autoscaling (HPA)", "Infrastructure as Code (Terraform)", "Prometheus monitoring"];
      idealAnswer = "The ideal response details minimal container image builds, defining HPA target metrics (CPU/Memory), IaC state management, and automated canary deployments.";
    } else if (rLower.includes('data sci') || rLower.includes('machine learning') || rLower.includes('ml')) {
      text = `For a ${difficulty}-level ${role} position, how do you handle bias-variance trade-offs, cross-validation, and model evaluation metrics for imbalanced datasets?`;
      suggestedPoints = ["Bias vs Variance decomposition", "Precision vs Recall vs F1-Score", "Cross-validation folds", "Synthetic sampling (SMOTE)"];
      idealAnswer = "A strong answer explains regularization techniques, choosing F1-Score or ROC-AUC over simple accuracy for imbalanced data, and tracking model drift in production.";
    } else if (rLower.includes('data anal') || rLower.includes('sql') || rLower.includes('bi')) {
      text = `For a ${difficulty}-level ${role} position, how do you use SQL Window functions (ROW_NUMBER, RANK) and statistical p-values to verify A/B test results?`;
      suggestedPoints = ["SQL Window functions & partitioning", "Statistical significance (p-value < 0.05)", "Tableau/PowerBI KPI design", "Data cleaning & ETL pipelines"];
      idealAnswer = "The ideal answer explains partitioning dataset rows with window functions, evaluating sample variance, and presenting actionable executive dashboards.";
    } else if (rLower.includes('mobile') || rLower.includes('ios') || rLower.includes('android')) {
      text = `For a ${difficulty}-level ${role} position, how do you manage mobile app memory (ARC / Garbage Collection), offline data sync, and 60fps UI rendering?`;
      suggestedPoints = ["Retain cycle prevention", "Offline SQLite / Room cache sync", "MVVM presentation layer", "Thread offloading for UI"];
      idealAnswer = "A strong answer details weak/unowned references to prevent memory leaks, background async thread processing, and syncing local SQLite tables with cloud REST endpoints.";
    } else if (rLower.includes('cyber') || rLower.includes('security')) {
      text = `For a ${difficulty}-level ${role} position, how do you mitigate OWASP Top 10 vulnerabilities (SQLi, XSS) and implement a Zero Trust IAM architecture?`;
      suggestedPoints = ["Input sanitization & parameterized queries", "Zero Trust authentication", "TLS 1.3 encryption handshakes", "RBAC & MFA access controls"];
      idealAnswer = "The ideal response details parameterized SQL queries, CSP headers for XSS, encrypting data at rest/in-transit, and enforcing principle of least privilege.";
    } else if (rLower.includes('product') || rLower.includes('pm')) {
      text = `As a ${role}, how do you use prioritization frameworks like RICE to balance engineering debt against business feature requests?`;
      suggestedPoints = ["RICE scoring (Reach, Impact, Confidence, Effort)", "User story acceptance criteria", "Retention & NPS telemetry", "Sprint backlog alignment"];
      idealAnswer = "A top response explains quantifying reach and impact metrics, conducting user interviews, framing clear MVP boundaries, and communicating transparent trade-offs.";
    } else if (rLower.includes('ui') || rLower.includes('ux') || rLower.includes('design')) {
      text = `As a ${role}, how do you apply WCAG accessibility standards, color contrast rules, and component-based Design Systems to web applications?`;
      suggestedPoints = ["WCAG 2.1 AAA contrast ratios", "Design System UI kit tokens", "Wireframing to high-fidelity workflow", "Fitts's Law CTA placement"];
      idealAnswer = "A strong response details visual hierarchy, contrast ratios for readability, component token reuse, and conducting iterative usability test sessions.";
    } else if (rLower.includes('qa') || rLower.includes('test')) {
      text = `For a ${difficulty}-level ${role} position, how do you structure an automated test framework using Page Object Model (POM) and integrate it into CI/CD builds?`;
      suggestedPoints = ["Testing Pyramid (Unit, Integration, E2E)", "Page Object Model structure", "Selenium/Playwright parallel execution", "CI/CD pull request gates"];
      idealAnswer = "The ideal answer explains separating page locators from test specs, executing parallel headless browser tests, and reporting clear failure logs.";
    } else if (rLower.includes('architect')) {
      text = `For a ${difficulty}-level ${role} position, how do you evaluate microservices versus monolithic architectures and apply CAP theorem trade-offs?`;
      suggestedPoints = ["CAP theorem (Consistency vs Availability)", "Modular monolith vs microservices", "Event-driven Saga pattern", "Database sharding & replication"];
      idealAnswer = "A top architectural answer details choosing eventual consistency for high availability, implementing circuit breakers, and designing isolated data boundaries.";
    } else {
      text = `For a ${difficulty}-level ${role} position, how would you design a scalable microservices structure to handle high-throughput read operations?`;
      suggestedPoints = ["Caching (Redis/Memcached)", "Read replicas", "Load balancing strategies", "Database indexes"];
      idealAnswer = "The ideal answer explains partitioning databases, caching popular records in-memory, splitting read/write traffic using read replicas, and routing through an API gateway.";
    }
  } else if (type === 'Coding') {
    text = `Given a ${difficulty} algorithmic challenge for a ${role}, how would you implement a solution that reduces time complexity from O(N²) to O(N log N) or O(N)?`;
    suggestedPoints = ["Use HashMaps or hash sets to store visited items", "Sort inputs first", "Two-pointer technique"];
    idealAnswer = "The ideal answer explains using extra memory (like a Hash Map) to lookup values in O(1) time, avoiding nested iterations and resolving the problem in linear runtime.";
  } else if (type === 'HR' || type === 'Behavioral') {
    text = `Tell me about a time you faced a tight project deadline or technical disagreement as a ${role}. How did you align deliverables and prioritize tasks?`;
    suggestedPoints = ["STAR framework structure", "Communicating trade-offs clearly", "Agile backlog prioritization"];
    idealAnswer = "The ideal response follows the STAR method: describe the Situation, specify the Task, outline your Actions (prioritizing critical paths, negotiating scope), and summarize the successful Result.";
  } else if (type === 'Company-Specific' || companyName) {
    const targetComp = companyName || 'our team';
    text = `What interests you about joining ${targetComp}'s team as a ${role}, and how do your technical skills align with their engineering standards?`;
    suggestedPoints = ["Company values and engineering culture", "Recent products or updates", "Personal growth and scale"];
    idealAnswer = `A strong answer connects your background directly with ${targetComp}'s technical stack, lists specific products you are excited to scale, and references their cultural principles.`;
  }

  // Customize based on resume/description if available
  if (resumeContent && resumeContent.trim() !== '') {
    text += ` (Tailored to your resume keywords: e.g. React/Node/Python)`;
  }
  if (language && language !== 'English') {
    text = `[In ${language}] ` + text;
  }

  return {
    text,
    suggestedPoints,
    idealAnswer
  };
};

/**
 * Evaluates the user's answer to a question
 */
const evaluateAnswer = async (questionText, userAnswer) => {
  if (hasApiKey()) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert mock interview evaluator. Grade the user's answer against the given question.
              Your evaluation MUST be returned as a valid JSON object matching this structure:
              {
                "score": 85, // number from 0 to 100
                "correctness": "Highly Accurate", // e.g. "Highly Accurate", "Partially Correct", "Needs Improvement"
                "confidenceFeedback": "Clear delivery with good structure, but could use more direct examples",
                "feedback": "A short summary paragraph critique",
                "strengths": ["Strength 1 mentioned", "Strength 2 mentioned"],
                "weaknesses": ["Weakness 1/missing detail 1", "Weakness 2/missing detail 2"],
                "improvementSuggestions": ["Tip 1 to improve", "Tip 2 to improve"],
                "hint": "Try highlighting base cases first", // Help prompt hint if answer score < 75, otherwise leave blank or empty
                "modelAnswer": "A high-scoring professional sample answer"
              }`
            },
            {
              role: 'user',
              content: `Question: "${questionText}"\nUser Answer: "${userAnswer}"`
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return JSON.parse(data.choices[0].message.content);
      }
      throw new Error('OpenAI empty response');
    } catch (error) {
      console.warn('OpenAI Evaluation error, using mock fallback:', error.message);
    }
  }

  // Fallback mock AI evaluation engine
  return new Promise((resolve) => {
    setTimeout(() => {
      const wordsCount = userAnswer ? userAnswer.trim().split(/\s+/).length : 0;
      
      let score = 75;
      let correctness = "Partially Correct";
      let confidenceFeedback = "Good pacing and direct tone. Lacks deeper technical context.";
      let hint = "";
      let strengths = ["Spoke clearly and addressed the topic's main keywords"];
      let weaknesses = ["Answer was slightly brief and lacked specific code examples"];
      let improvements = ["Try adding code syntax keywords", "Use structural STAR storytelling models"];
      let feedback = "Good start! You demonstrated core knowledge of the topic, but your answer could be structured better with direct examples from your projects to showcase your hands-on coding proficiency.";

      if (wordsCount < 5) {
        score = 30;
        correctness = "Needs Improvement";
        confidenceFeedback = "Extremely brief response, suggesting low confidence or lack of preparation.";
        hint = "Recall the main definition of the topic. E.g. what is its main goal or output?";
        feedback = "The answer was extremely short or empty. Please elaborate on your response to receive a thorough evaluation.";
        strengths = ["Responded to the prompt"];
        weaknesses = ["Incomplete answer, missing context, no technical terms"];
        improvements = ["Elaborate on definitions", "Explain the inner mechanics of the concepts"];
      } else if (wordsCount > 40) {
        score = 88;
        correctness = "Highly Accurate";
        confidenceFeedback = "Strong, detail-oriented answer showing solid communication confidence.";
        strengths.push("Provided a structured answer detailing workflow", "Demonstrated clear vocabulary knowledge");
        weaknesses = ["Lacks references to optimization metrics"];
        improvements.push("Discuss performance tradeoffs in production");
      } else {
        hint = "Think about how this concept compares to its alternatives (e.g. CSR vs SSR).";
      }

      resolve({
        score,
        correctness,
        confidenceFeedback,
        feedback,
        strengths,
        weaknesses,
        improvementSuggestions: improvements,
        hint,
        modelAnswer: `Ideal Response: An outstanding answer should define the concept clearly, provide a clean real-world analogy or code syntax snippet, explain why it matters (benefits: speed, security, maintainability), and list potential architectural trade-offs.`
      });
    }, 1000);
  });
};

/**
 * Generates hints for a coding challenge
 */
const getCodingHint = async (title, description, userCode) => {
  if (hasApiKey()) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI Coding Coach. Analyze the user's progress on the coding challenge and give a helpful progressive hint. Do NOT solve it for them completely. Write a short, encouraging snippet in markdown.`
            },
            {
              role: 'user',
              content: `Challenge: "${title}"\nDescription: "${description}"\nUser's Current Code:\n\`\`\`\n${userCode}\n\`\`\``
            }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }
      throw new Error('OpenAI empty response');
    } catch (error) {
      console.warn('OpenAI Coding Hint error, fallback to mock hint:', error.message);
    }
  }

  // Fallback coding hints
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`### AI Coding Assistant Hints:
* **Edge Cases**: Make sure to check for empty inputs or negative integers (e.g. if array length is 0, return null or empty values).
* **Efficiency**: Try to solve this in **O(N)** time complexity. Think about utilizing a **HashMap** or **Set** to keep track of indices you've visited, which avoids doing nested loops (*O(N²)*).
* **Dry Run**: Trace your variables with a small input (like \`[2, 7, 11]\` with target \`9\`) and verify the indexing updates!`);
    }, 600);
  });
};

module.exports = {
  getChatbotResponse,
  generateDynamicQuestion,
  evaluateAnswer,
  getCodingHint
};
