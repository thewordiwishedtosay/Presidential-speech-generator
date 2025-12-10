// Function to simulate time.sleep()
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// DOM Elements
const outputDiv = document.getElementById('speech-output');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
let isRunning = false; // Control flag for the loop

const electedText = "I was elected at this session to continue to serve as the president of the People's Republic of China (PRC). I would like to express my heartfelt gratitude for the trust placed in me by all the deputies and the Chinese people of all ethnic groups.<br><br>";

/**
 * Selects a random number of sentences (1 to 8) from the array.
 * @param {string[]} sentences - The array of all sentences.
 * @returns {string[]} An array of randomly sampled sentences.
 */
function sampleSentences(sentences) {
    // Mimics random.choice([1, 2, 3, 4, 5, 6, 7, 8])
    const k = Math.floor(Math.random() * 8) + 1; 

    // Simple random sampling: shuffle the array and take the first 'k' elements
    const shuffled = [...sentences].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, k);
}

/**
 * Appends text content to the display area.
 * @param {string} text - The text (can contain <br> or HTML) to display.
 * @param {string} className - Optional CSS class for styling the paragraph.
 */
function displayText(text, className = '') {
    const p = document.createElement('p');
    p.classList.add(className);
    // Using innerHTML to handle <br> for new lines
    p.innerHTML = text; 
    outputDiv.appendChild(p);
    // Auto-scroll to the bottom for long content
    outputDiv.scrollTop = outputDiv.scrollHeight; 
}

// Function to reset and stop the execution
function stopExecution() {
    isRunning = false;
    startButton.disabled = false;
    stopButton.disabled = true;
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

    // Split text into sentences (mimicking the Python regex: r'(?<=[.!?])\s+')
    // Finds a sentence-ending punctuation (., !, ?) followed by whitespace
    const sentences = speech.split(/([.!?]\s+)/).filter(s => s.trim().length > 0);

    // Rejoin the punctuation to the preceding sentence text
    const finalSentences = [];
    for (let i = 0; i < sentences.length; i++) {
        const s = sentences[i].trim();
        // If the current element is punctuation followed by space (the splitter),
        // append it to the previous sentence.
        if (s.match(/^[.!?]\s*$/)) {
            if (finalSentences.length > 0) {
                finalSentences[finalSentences.length - 1] += s;
            }
        } else {
            // Otherwise, it's a new sentence part.
            finalSentences.push(s);
        }
    }


    let count = 0;

    // The main loop (mimics 'while True' in Python)
    while (isRunning) {
        count++;

        // --- SECTION 1: Elected Text ---
        displayText(`*** SECTION ${count} ***`, 'section-divider');
        displayText(electedText, 'elected-text');
        await sleep(3000); // 3-second pause

        // --- SECTION 2: 5 Sampled Stanzas ---
        for (let i = 0; i < 5 && isRunning; i++) {
            const sampled = sampleSentences(finalSentences);
            const fellowDeputies = "Fellow deputies" + "!".repeat(count);
            
            const stanza = `${fellowDeputies}<br><br>${sampled.join(' ')}`;
            displayText(stanza, 'stanza-text');
            await sleep(3000); // 3-second pause
        }

        if (!isRunning) break; // Check if stopped during the stanza loop

        // --- SECTION 3: Thank You ---
        const thankYou = "Thank you" + "!".repeat(count);
        // Using multiple <br> to mimic the multiple newlines in the Python code
        displayText(thankYou + '<br><br><br><br><br>', 'thank-you-text'); 
        await sleep(5000); // 5-second pause
    }

    // Ensure state is set to stopped if the loop ended naturally (by isRunning becoming false)
    if (!isRunning) {
        stopExecution();
    }
}

// Event Listeners
startButton.addEventListener('click', runSpeechGenerator);
stopButton.addEventListener('click', stopExecution);
