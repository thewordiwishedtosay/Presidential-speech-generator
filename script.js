// Helper for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const outputDiv = document.getElementById('speech-output');

// Initial starting number for the congress (will start at 13th)
let congressCount = 12;

const electedText = "I was elected at this session to continue to serve as the president of the People's Republic of China (PRC). I would like to express my heartfelt gratitude for the trust placed in me by all the deputies and the Chinese people of all ethnic groups.";

// Select random sentences
function sampleSentences(sentences) {
    const k = Math.floor(Math.random() * 5) + 2; 
    const shuffled = [...sentences].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, k);
}

// Display function with auto-scroll
function displayText(text, className = '') {
    const p = document.createElement('p');
    if (className) p.className = className;
    p.innerHTML = text; 
    outputDiv.appendChild(p);
    
    outputDiv.scrollTo({
        top: outputDiv.scrollHeight,
        behavior: 'smooth'
    });
}

async function runSpeechGenerator() {
    outputDiv.innerHTML = '';
    
    // Fetch speech text
    let speech;
    try {
        const response = await fetch('speech.txt');
        if (!response.ok) throw new Error("File not found");
        speech = await response.text();
    } catch (error) {
        displayText(`Error: ${error.message}`, 'elected-text');
        return;
    }

    // Process sentences
    const sentences = speech.split(/([.!?]\s+)/).filter(s => s.trim().length > 0);
    const finalSentences = [];
    for (let i = 0; i < sentences.length; i++) {
        const s = sentences[i].trim();
        if (s.match(/^[.!?]\s*$/)) {
            if (finalSentences.length > 0) finalSentences[finalSentences.length - 1] += s;
        } else {
            finalSentences.push(s);
        }
    }

    // --- INFINITE LOOP ---
    while (true) {
        congressCount++; 

        // 1. HEADER
        displayText(`The ${congressCount}th National People's Congress`, 'congress-header');
        await sleep(4000); // Slower (4s)

        // 2. ELECTED TEXT
        displayText(electedText, 'elected-text');
        await sleep(5000); // Slower (5s)

        // 3. STANZAS (Loop 4 times)
        for (let i = 0; i < 4; i++) {
            const sampled = sampleSentences(finalSentences);
            
            // "Fellow Deputies!!!"
            const exclamations = "!".repeat(Math.min(congressCount - 12, 10));
            displayText("Fellow deputies" + exclamations, "shout-text");
            await sleep(3000); // Wait 3s before body text

            // The Content
            displayText(sampled.join('<br><br>'), 'stanza-text');
            await sleep(6000); // Wait 6s to read
        }

        // 4. THANK YOU (Special Red Style)
        const thankYouExclamations = "!".repeat(Math.min(congressCount - 12, 15));
        displayText("Thank you" + thankYouExclamations, "final-shout");
        
        await sleep(8000); // Long pause (8s) before next cycle
    }
}

// Auto-start immediately
window.addEventListener('DOMContentLoaded', runSpeechGenerator);
