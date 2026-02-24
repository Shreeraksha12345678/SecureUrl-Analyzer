function analyzeURL() {
  const urlInput = document.getElementById("url");
  const output = document.getElementById("output");

  const url = urlInput.value.trim().toLowerCase();

  if (!url) {
    output.innerHTML = "⚠️ Please enter a URL.";
    output.style.color = "#ffcc00";
    return;
  }

  let score = 0;
  let reasons = [];

  if (url.length > 75) {
    score += 20;
    reasons.push("URL length is unusually long");
  }

  if (url.includes("@")) {
    score += 30;
    reasons.push("Contains '@' symbol (redirect technique)");
  }

  if (/(login|verify|bank|secure|account|update)/.test(url)) {
    score += 30;
    reasons.push("Contains phishing-related keywords");
  }

  if (/\d+\.\d+\.\d+\.\d+/.test(url)) {
    score += 20;
    reasons.push("Uses IP address instead of domain name");
  }

  let riskLevel = "";
  let confidence = 0;

  if (score >= 60) {
    riskLevel = "HIGH RISK";
    confidence = score;
    output.innerHTML = `🚨 High Risk Detected<br>AI Confidence: ${confidence}%`;
    output.style.color = "#ff5252";
  } else {
    riskLevel = "LOW RISK";
    confidence = 100 - score;
    output.innerHTML = `✅ Low Risk URL<br>AI Confidence: ${confidence}%`;
    output.style.color = "#00e676";
  }

  // Store report globally for download
  window.latestReport = `
PhishGuard AI – URL Safety Report
================================

Analyzed URL:
${url}

Risk Level:
${riskLevel}

AI Confidence:
${confidence}%

Detected Indicators:
${reasons.length > 0 ? reasons.map(r => "- " + r).join("\n") : "- No major phishing indicators found"}

AI Decision:
${riskLevel === "HIGH RISK"
  ? "This URL appears suspicious. Do NOT interact with it."
  : "This URL appears safe based on heuristic analysis."}

Report Generated On:
${new Date().toLocaleString()}
`;
}

function downloadReport() {
  if (!window.latestReport) {
    alert("⚠️ Please analyze a URL first.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const lines = doc.splitTextToSize(window.latestReport, 180);

  doc.setFont("courier", "normal");
  doc.setFontSize(11);
  doc.text(lines, 10, 10);

  doc.save("PhishGuard_AI_Report.pdf");
}