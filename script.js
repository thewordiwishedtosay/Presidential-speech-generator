// Function to simulate time.sleep()
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// DOM Elements
const outputDiv = document.getElementById('speech-output');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const statusIndicator = document.getElementById('status-indicator');

let isRunning = false; // Control flag for the loop

const electedText = "I was elected at this session to continue to serve as the president of the People's Republic of China (PRC). I would like to express my heartfelt gratitude for the trust placed in me by all the deputies and the Chinese people of all ethnic groups.<br><br>";

/**
 * Selects a random number of sentences (1 to 8) from the array.
 */
function sampleSentences(sentences) {
    const k = Math.floor(Math.random() * 8) + 1; 
    const shuffled = [...sentences].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, k);
}

/**
 * Appends text content to the display area.
 */
function displayText(text, className = '') {
    const p = document.createElement('p');
    if (className) p.classList.add(className);
    p.innerHTML = text; 
    outputDiv.appendChild(p);
    
    // Auto-scroll to the bottom nicely
    outputDiv.scrollTo({
        top: outputDiv.scrollHeight,
        behavior: 'smooth'
    });
}

// Function to reset and stop the execution
function stopExecution() {
    isRunning = false;
    startButton.disabled = false;
    stopButton.disabled = true;
    if(statusIndicator) statusIndicator.innerText = "Stopped";
    displayText('--- SPEECH STOPPED ---', 'system-message');
}

/**
 * Main function to run the speech generator loop.
 */
async function runSpeechGenerator() {
    // Reset state and UI
    outputDiv.innerHTML = '';
    isRunning = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    if(statusIndicator) statusIndicator.innerText = "Generating...";
    displayText('--- STARTING SPEECH GENERATOR ---', 'system-message');

    // 1. Fetch and process speech.txt
    let speech;
    try {
        const response = await fetch('speech.txt');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        speech = await response.text();
    } catch (error) {
        displayText(`<span style="color: red;">Error loading speech.txt: ${error.message}</span>`, 'error-message');
        stopExecution();
        return;
    }

    // Split text into sentences
    const sentences = speech.split(/([.!?]\s+)/).filter(s => s.trim().length > 0);

    // Rejoin the punctuation
    const finalSentences = [];
    for (let i = 0; i < sentences.length; i++) {
        const s = sentences[i].trim();
        if (s.match(/^[.!?]\s*$/)) {
            if (finalSentences.length > 0) {
                finalSentences[finalSentences.length - 1] += s;
            }
        } else {
            finalSentences.push(s);
        }
    }

    let count = 0;

    // The main loop
    while (isRunning) {
        count++;

        // --- SECTION 1: Elected Text ---
        displayText(`*** SECTION ${count} ***`, 'section-divider');
        displayText(electedText, 'elected-text');
        if (!isRunning) break;
        await sleep(3000); 

        // --- SECTION 2: 5 Sampled Stanzas ---
        for (let i = 0; i < 5 && isRunning; i++) {
            const sampled = sampleSentences(finalSentences);
            const fellowDeputies = "Fellow deputies" + "!".repeat(count);
            
            const stanza = `${fellowDeputies}<br><br>${sampled.join(' ')}`;
            displayText(stanza, 'stanza-text');
            await sleep(3000);
        }

        if (!isRunning) break;

        // --- SECTION 3: Thank You ---
        const thankYou = "Thank you" + "!".repeat(count);
        displayText(thankYou, 'thank-you-text'); 
        await sleep(5000);
    }

    if (!isRunning) stopExecution();
}

// Event Listeners
startButton.addEventListener('click', runSpeechGenerator);
stopButton.addEventListener('click', stopExecution);
