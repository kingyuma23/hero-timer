document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const heroMask = document.getElementById('heroMask');
    const message = document.getElementById('message');
    const progressBar = document.getElementById('progressBar');
    const timerDisplay = document.getElementById('timer');
    const btnStart = document.getElementById('btnStart');
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const btnEat = document.getElementById('btnEat');
    const btnReset = document.getElementById('btnReset');
    const timeSlice = document.getElementById('timeSlice');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    
    // State
    let timerInterval = null;
    let totalSeconds = 30 * 60; // 30 minutes default
    let isRunning = false;
    
    let currentBites = 0;
    const maxBites = 20; // Number of bites to reach 100%
    
    const messages = [
        "すごい！",
        "そのちょうし！",
        "もぐもぐ！",
        "かっこいい！",
        "ぱわーあっぷ！",
        "さいこう！",
        "えねるぎーちゃーじ！",
        "ひーろーみたい！",
        "いいぞいいぞ！"
    ];

    // Timer functions
    function updateTimerDisplay() {
        if (totalSeconds < 0) totalSeconds = 0;
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        if (totalSeconds <= 5 * 60 && totalSeconds > 0) {
            timerDisplay.classList.add('danger');
            if (timeSlice) timeSlice.setAttribute('stroke', '#ff0000');
        } else {
            timerDisplay.classList.remove('danger');
            if (timeSlice) timeSlice.setAttribute('stroke', '#ff4b4b');
        }

        // Update clock UI
        if (timeSlice && minuteHand && secondHand) {
            const fractionOfHour = totalSeconds / 3600;
            const circumference = 150.796;
            let clampedFraction = fractionOfHour;
            if (clampedFraction > 1) clampedFraction = 1;
            
            const minuteAngle = (1 - clampedFraction) * 360;
            
            timeSlice.setAttribute('transform', `rotate(${minuteAngle - 90} 50 50)`);
            timeSlice.style.strokeDasharray = `${circumference * clampedFraction} ${circumference}`;
            timeSlice.style.strokeDashoffset = 0;
            
            minuteHand.setAttribute('transform', `rotate(${minuteAngle} 50 50)`);
            
            const elapsedSeconds = (60 - s) % 60;
            const secondAngle = (elapsedSeconds / 60) * 360;
            secondHand.setAttribute('transform', `rotate(${secondAngle} 50 50)`);
        }
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            btnStart.textContent = "スタート";
            btnStart.classList.remove('running');
        } else {
            if (totalSeconds <= 0) return;
            timerInterval = setInterval(() => {
                totalSeconds--;
                updateTimerDisplay();
                if (totalSeconds <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    btnStart.textContent = "スタート";
                    btnStart.classList.remove('running');
                    showMessage("じかんになったよ！");
                }
            }, 1000);
            btnStart.textContent = "ストップ";
            btnStart.classList.add('running');
        }
        isRunning = !isRunning;
    }

    function addTime(mins) {
        totalSeconds += mins * 60;
        if (totalSeconds < 0) totalSeconds = 0;
        updateTimerDisplay();
    }

    // Interaction functions
    let messageTimeout;
    function showMessage(text) {
        message.textContent = text;
        message.classList.add('show');
        clearTimeout(messageTimeout);
        messageTimeout = setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    function eatAction() {
        // Play sound if possible (browser might block it without interaction, but this is a click handler)
        // Here we just do visual feedback
        
        heroMask.classList.add('eating');
        btnEat.classList.add('active');
        
        setTimeout(() => {
            heroMask.classList.remove('eating');
            btnEat.classList.remove('active');
        }, 300);

        // Progress
        if (currentBites < maxBites) {
            currentBites++;
            const percentage = (currentBites / maxBites) * 100;
            progressBar.style.width = `${percentage}%`;
            
            if (currentBites === maxBites) {
                // Clear!
                heroMask.classList.add('happy');
                showMessage("みっしょんくりあ！！ぜんぶたべたね！");
                fireConfetti();
                if (isRunning) toggleTimer(); // Stop timer
            } else {
                // Random message
                const msg = messages[Math.floor(Math.random() * messages.length)];
                showMessage(msg);
            }
        } else {
             // Already finished
             heroMask.classList.add('happy');
             setTimeout(() => heroMask.classList.remove('happy'), 500);
             fireConfetti();
        }
    }

    function fireConfetti() {
        if (typeof confetti !== 'function') return; // in case library failed to load
        
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999, colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'] };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }

    function resetApp() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            btnStart.textContent = "スタート";
            btnStart.classList.remove('running');
        }
        
        totalSeconds = 30 * 60; // 30 minutes
        currentBites = 0;
        
        updateTimerDisplay();
        progressBar.style.width = '0%';
        heroMask.classList.remove('happy', 'eating');
        message.classList.remove('show');
        
        if (typeof confetti === 'function' && confetti.reset) {
            confetti.reset();
        }
    }

    // Event Listeners
    btnStart.addEventListener('click', toggleTimer);
    btnMinus.addEventListener('click', () => addTime(-5));
    btnPlus.addEventListener('click', () => addTime(5));
    btnReset.addEventListener('click', resetApp);
    btnEat.addEventListener('click', eatAction);

    // Initial setup
    updateTimerDisplay();
    
    // Add touch support for better mobile/iPad responsiveness
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });
});
