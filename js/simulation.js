// Parameters for Hick-Hyman Law and simulation
let a = 150; // Initial default base reaction time (will be updated after calibration)
const b = 150; // Hick-Hyman's Law constant in ms/bit
const roundsPerSet = 5; // 5 rounds per number of buttons
const minButtons = 4; // Start with 4 buttons
const maxButtons = 10; // End with 10 buttons
const calibrationRounds = 3; // Number of rounds for calibration (n = 1)
let currentButtons = minButtons; // Current number of buttons
let round = 0; // Current round in the set
let reactionTimes = []; // Store reaction times for the rounds
let calibrationTimes = []; // Store reaction times for calibration
let startTime, targetButton;
let results = []; // Store final RTs for each number of buttons
let isCalibrating = false; // Track calibration phase

function initializeButtons(numButtons) {
  const container = document.getElementById('buttonContainer');
  container.innerHTML = '';
  const positions = Array.from({ length: numButtons }, (_, i) => i);
  shuffle(positions); // Randomize positions

  for (let i = 0; i < numButtons; i++) {
    const button = document.createElement('button');
    button.className = 'sim-button';
    button.innerText = i + 1;
    button.style.order = positions[i]; // Randomized position
    button.onclick = () => checkReaction(button);
    container.appendChild(button);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startSimulation() {
  // Start with calibration phase
  isCalibrating = true;
  calibrationTimes = [];
  round = 0;
  currentButtons = 1;
  results = [];
  document.getElementById('result').innerText = '';
  document.getElementById('resultsTable').innerHTML = '';
  const chartCanvas = document.getElementById('reactionTimeChart');
  if (chartCanvas.chart) chartCanvas.chart.destroy(); // Clear previous chart
  document.getElementById('startButton').innerText = 'Restart Simulation';
  document.getElementById('status').innerText = `Calibration: Round ${round + 1} of ${calibrationRounds} (1 button)`;
  startRound();
}

function startRound() {
  round++;
  initializeButtons(currentButtons);
  const allButtons = document.querySelectorAll('.sim-button');
  targetButton = allButtons[Math.floor(Math.random() * currentButtons)];
  allButtons.forEach(btn => btn.classList.remove('active'));
  targetButton.classList.add('active');
  startTime = performance.now();

  if (isCalibrating) {
    document.getElementById('status').innerText = 
      `Calibration: Round ${round} of ${calibrationRounds} (1 button)`;
  } else {
    document.getElementById('status').innerText = 
      `Buttons: ${currentButtons} | Round: ${round} of ${roundsPerSet}`;
  }
}

function generateGaussianNoise(mean = 0, stdev = 30) {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdev + mean;
}

function checkReaction(button) {
  if (button !== targetButton) return;
  const endTime = performance.now();
  const measuredRT = endTime - startTime;

  if (isCalibrating) {
    calibrationTimes.push(measuredRT);

    if (round < calibrationRounds) {
      startRound(); // Continue calibration
    } else {
      // End calibration, calculate a
      a = calibrationTimes.reduce((sum, rt) => sum + rt, 0) / calibrationTimes.length;
      document.getElementById('result').innerHTML = 
        `<strong>Calibration Complete:</strong><br>` +
        `Estimated Base Reaction Time (a): ${a.toFixed(2)} ms<br><br>`;

      // Start main simulation
      isCalibrating = false;
      currentButtons = minButtons;
      round = 0;
      reactionTimes = [];
      startRound();
    }
  } else {
    reactionTimes.push(measuredRT);

    if (round < roundsPerSet) {
      startRound(); // Start the next round
    } else {
      // Calculate and store results after 5 rounds
      const avgMeasuredRT = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;

      // Hick-Hyman's Law: RT = a + b * log2(n), using estimated a
      const n = currentButtons;
      const hickRT = a + b * Math.log2(n);

      // Add Gaussian noise to the predicted RT
      const noise = generateGaussianNoise(0, 30);
      const finalRT = Math.max(0, hickRT + noise); // Ensure RT is non-negative

      results.push({ buttons: currentButtons, rt: finalRT });

      document.getElementById('result').innerHTML += 
        `<strong>Results for ${currentButtons} buttons:</strong><br>` +
        `Average Measured Reaction Time: ${avgMeasuredRT.toFixed(2)} ms<br>` +
        `Hick-Hyman's Law Predicted RT: ${hickRT.toFixed(2)} ms<br>` +
        `Final RT (with noise): ${finalRT.toFixed(2)} ms<br><br>`;

      // Move to the next number of buttons or end the simulation
      if (currentButtons < maxButtons) {
        currentButtons++;
        round = 0;
        reactionTimes = [];
        startRound();
      } else {
        document.getElementById('status').innerText = 'Simulation Complete!';
        document.getElementById('startButton').innerText = 'Start Simulation';
        displayResultsTable();
        drawChart();
      }
    }
  }
}

function displayResultsTable() {
  let tableHTML = '<table><tr><th># of Buttons</th><th>Reaction Time (ms)</th></tr>';
  results.forEach(result => {
    tableHTML += `<tr><td>${result.buttons}</td><td>${result.rt.toFixed(2)}</td></tr>`;
  });
  tableHTML += '</table>';
  document.getElementById('resultsTable').innerHTML = tableHTML;
}

function drawChart() {
  const ctx = document.getElementById('reactionTimeChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: results.map(r => r.buttons),
      datasets: [{
        label: 'Reaction Time (ms)',
        data: results.map(r => r.rt),
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        fill: true,
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `RT: ${context.parsed.y.toFixed(2)} ms`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Number of Buttons' }
        },
        y: {
          title: { display: true, text: 'Reaction Time (ms)' },
          beginAtZero: false
        }
      }
    }
  });
  document.getElementById('reactionTimeChart').chart = chart; // Store chart instance
}

// Initialize on page load
window.onload = () => {
  document.getElementById('startButton').innerText = 'Start Simulation';
  document.getElementById('status').innerText = 'Click "Start Simulation" to begin.';
};