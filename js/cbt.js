const questions = [
    {
      type: "mcq",
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      answer: 2,
      feedback: "Paris is the capital of France."
    },
    {
      type: "truefalse",
      question: "The sun rises in the east.",
      answer: true,
      feedback: "Correct. The sun rises in the east and sets in the west."
    },
    {
      type: "text",
      question: "What is the color of the clear daytime sky?",
      answer: "blue",
      feedback: "Typically, the sky appears blue during a clear day due to Rayleigh scattering."
    }
  ];
  
  let currentQuestion = 0;
  let userAnswers = new Array(questions.length).fill(null);
  
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const resultContainer = document.getElementById("result-container");
  const quizContainer = document.getElementById("quiz-container");
  const scoreEl = document.getElementById("score");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");
  
  function loadQuestion(index) {
    const q = questions[index];
    questionEl.textContent = `Q${index + 1}: ${q.question}`;
    optionsEl.innerHTML = "";
  
    if (q.type === "mcq") {
      q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "w-full text-left px-4 py-2 border rounded hover:bg-gray-100";
        btn.textContent = opt;
        if (userAnswers[index] === i) btn.classList.add("bg-blue-100");
        btn.onclick = () => {
          userAnswers[index] = i;
          loadQuestion(index);
        };
        optionsEl.appendChild(btn);
      });
    } else if (q.type === "truefalse") {
      ["True", "False"].forEach((val, i) => {
        const btn = document.createElement("button");
        btn.className = "w-full text-left px-4 py-2 border rounded hover:bg-gray-100";
        btn.textContent = val;
        if (userAnswers[index] === (i === 0)) btn.classList.add("bg-blue-100");
        btn.onclick = () => {
          userAnswers[index] = (i === 0);
          loadQuestion(index);
        };
        optionsEl.appendChild(btn);
      });
    } else if (q.type === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "w-full px-4 py-2 border rounded";
      input.placeholder = "Type your answer here";
      input.value = userAnswers[index] ?? "";
      input.oninput = (e) => {
        userAnswers[index] = e.target.value.trim();
      };
      optionsEl.appendChild(input);
    }
  
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === questions.length - 1 ? "Submit" : "Next";
  }
  
  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion(currentQuestion);
    } else {
      showResult();
    }
  }
  
  function prevQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion);
    }
  }
  
  function showResult() {
    let score = 0;
    let reviewHTML = "";
  
    userAnswers.forEach((ans, i) => {
      const q = questions[i];
      let correct = false;
  
      if (q.type === "mcq" && ans === q.answer) correct = true;
      if (q.type === "truefalse" && ans === q.answer) correct = true;
      if (q.type === "text" && typeof ans === "string" && ans.toLowerCase() === q.answer.toLowerCase()) correct = true;
  
      if (correct) score++;
  
      let userAnswerDisplay = q.type === "text" ? ans || "(blank)" :
        q.type === "truefalse" ? (ans === true ? "True" : "False") :
        typeof ans === "number" ? q.options[ans] : "(No answer)";
  
      let correctAnswerDisplay = q.type === "text" ? q.answer :
        q.type === "truefalse" ? (q.answer ? "True" : "False") :
        q.options[q.answer];
  
      reviewHTML += `
        <div class="border rounded p-4 mb-3 ${correct ? 'bg-green-50' : 'bg-red-50'}">
          <p class="font-medium mb-2">Q${i + 1}: ${q.question}</p>
          <p><strong>Your answer:</strong> ${userAnswerDisplay}</p>
          <p><strong>Correct answer:</strong> ${correctAnswerDisplay}</p>
          <p class="italic text-sm mt-2 text-gray-700">${q.feedback}</p>
          <p class="font-bold mt-1 ${correct ? 'text-green-600' : 'text-red-600'}">${correct ? 'Correct ✅' : 'Incorrect ❌'}</p>
        </div>
      `;
    });
  
    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreEl.innerHTML = `You scored <strong>${score}</strong> out of <strong>${questions.length}</strong><br><br>${reviewHTML}`;
  }
  
  function restartQuiz() {
    currentQuestion = 0;
    userAnswers.fill(null);
    resultContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    loadQuestion(currentQuestion);
  }
  
  prevBtn.addEventListener("click", prevQuestion);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", restartQuiz);
  
  loadQuestion(currentQuestion);