// Simpelt bundle med spørgeflow og AI-opkald
const questions = [
  "Hvad er din forretningsidé – kort fortalt?",
  "Hvad er din vision for virksomheden?",
  "Hvad gør din idé unik eller innovativ?",
  "Hvilket konkret problem forsøger du at løse?",
  "Hvordan løser dit produkt eller service problemet?",
  "Hvem er dine kunder?",
  "Hvad kendetegner deres behov og adfærd?",
  "Hvordan ser markedet ud – størrelse, vækst, konkurrence?",
  "Hvem er dine største konkurrenter?",
  "Hvad er din Unique Selling Proposition (USP)?",
  "Hvordan vil du tjene penge?",
  "Hvad er dine vigtigste omkostninger?",
  "Hvor meget kapital har du brug for?",
  "Hvornår forventer du at være profitabel?",
  "Hvordan får du dine første kunder?",
  "Hvilke kanaler vil du bruge til markedsføring?",
  "Hvem står bag virksomheden?",
  "Hvilken erfaring har du og dit team?",
  "Hvilke milepæle har I nået – og hvad er de næste?"
];

let step = 0;
let answers = [];

function renderQuestion() {
  const root = document.getElementById("root");
  root.innerHTML = `
    <h2>${questions[step]}</h2>
    <textarea id="answer" rows="4"></textarea><br/>
    <button onclick="next()">Næste</button>
  `;
}

function next() {
  const value = document.getElementById("answer").value.trim();
  if (!value) {
    alert("Skriv et svar før du går videre 🙏");
    return;
  }
  answers.push(value);
  step++;
  if (step < questions.length) {
    renderQuestion();
  } else {
    renderEditor();
  }
}

function renderEditor() {
  const root = document.getElementById("root");
  let output = "<h2>Gennemgå og redigér din plan</h2>";
  for (let i = 0; i < questions.length; i++) {
    output += `<p><strong>${questions[i]}</strong><br/><textarea rows="3" data-index="${i}">${answers[i]}</textarea></p>`;
  }
  output += `<button onclick="generateAI()">Generér professionel plan med AI 🤖</button>`;
  root.innerHTML = output;
}

function generateAI() {
  const updated = document.querySelectorAll("textarea[data-index]");
  answers = Array.from(updated).map(el => el.value.trim());

  const prompt = questions.map((q, i) => `${q}\n${answers[i]}`).join("\n\n");
  const fullPrompt = `Skriv en professionel dansk forretningsplan baseret på følgende:\n\n${prompt}`;

  const root = document.getElementById("root");
  root.innerHTML = "<h2>🧠 GPT-4 genererer din forretningsplan...</h2><p>Vent venligst...</p>";

  fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: fullPrompt }] })
  })
  .then(res => res.json())
  .then(data => {
    const content = data.choices?.[0]?.message?.content || "⚠️ AI kunne ikke generere planen.";
    root.innerHTML = `
      <h2>🎉 Din AI-genererede forretningsplan</h2>
      <div id="ai-output" contenteditable="true">${content}</div>
      <button onclick="downloadPDF()">Download som PDF</button>
    `;
  })
  .catch(err => {
    root.innerHTML = "<p style='color:red;'>❌ Fejl under AI-generering. Tjek API-nøgle eller netværk.</p>";
    console.error(err);
  });
}

function downloadPDF() {
  const element = document.getElementById("ai-output");
  html2pdf().from(element).save("Edward_Forretningsplan.pdf");
}

renderQuestion();
