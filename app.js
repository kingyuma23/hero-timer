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
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    
    // State
    let timerInterval = null;
    let totalSeconds = 30 * 60; // 30 minutes default
    let isRunning = false;
    
    let currentBites = 0;
    const maxBites = 20; // Number of bites to reach 100%

    // もぐもぐクールダウン（よく噛む時間）
    const COOLDOWN_SECONDS = 10; // ← ここを変えると噛む時間を調整できます
    let cooldownRemaining = 0;
    let cooldownInterval = null;
    const beltText = document.querySelector('.belt-text');
    let busyMessageAt = 0;

    function startCooldown() {
        cooldownRemaining = COOLDOWN_SECONDS;
        btnEat.classList.remove('ready');
        btnEat.classList.add('cooldown');
        heroMask.classList.add('chewing');
        beltText.textContent = `もぐもぐ ${cooldownRemaining}`;

        clearInterval(cooldownInterval);
        cooldownInterval = setInterval(() => {
            cooldownRemaining--;
            if (cooldownRemaining > 0) {
                beltText.textContent = `もぐもぐ ${cooldownRemaining}`;
            } else {
                endCooldown();
            }
        }, 1000);
    }

    function endCooldown() {
        clearInterval(cooldownInterval);
        cooldownRemaining = 0;
        btnEat.classList.remove('cooldown');
        btnEat.classList.add('ready');
        heroMask.classList.remove('chewing');
        beltText.textContent = 'たべたよ！';
        showMessage('ごっくん！つぎのひとくちどうぞ！');
    }

    function cancelCooldown() {
        clearInterval(cooldownInterval);
        cooldownRemaining = 0;
        btnEat.classList.remove('cooldown', 'ready');
        heroMask.classList.remove('chewing');
        beltText.textContent = 'たべたよ！';
    }

    // ヒーローの成長（たべるたびに大きくなる）
    const heroMinScale = 0.5;
    const heroMaxScale = 1.15;
    function updateHeroSize(pop) {
        const t = Math.min(currentBites / maxBites, 1);
        const s = heroMinScale + (heroMaxScale - heroMinScale) * t;
        heroMask.style.setProperty('--hero-scale', s.toFixed(3));
    }
    
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

    }

    // 本物の時計：実際の時刻を針で表示し、長針の先から残り時間ぶんを赤く塗る
    function updateClock() {
        const now = new Date();
        const sec = now.getSeconds() + now.getMilliseconds() / 1000;
        const min = now.getMinutes() + sec / 60;
        const hr = (now.getHours() % 12) + min / 60;

        const secondAngle = sec * 6;   // 1秒 = 6度
        const minuteAngle = min * 6;   // 1分 = 6度
        const hourAngle = hr * 30;     // 1時間 = 30度

        if (hourHand) hourHand.setAttribute('transform', `rotate(${hourAngle} 50 50)`);
        if (minuteHand) minuteHand.setAttribute('transform', `rotate(${minuteAngle} 50 50)`);
        if (secondHand) secondHand.setAttribute('transform', `rotate(${secondAngle} 50 50)`);

        // 赤い扇形：いまの長針の位置から、残り時間ぶんを時計回りに塗る
        if (timeSlice) {
            const circumference = 125.664; // 2 * PI * r (r=20)
            let fraction = totalSeconds / 3600;
            if (fraction > 1) fraction = 1;
            if (fraction < 0) fraction = 0;
            timeSlice.setAttribute('transform', `rotate(${minuteAngle - 90} 50 50)`);
            timeSlice.style.strokeDasharray = `${circumference * fraction} ${circumference}`;
            timeSlice.style.strokeDashoffset = 0;
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
        // もぐもぐちゅうは押せない（よく噛もう！）
        if (cooldownRemaining > 0) {
            const now = Date.now();
            if (now - busyMessageAt > 2000) {
                busyMessageAt = now;
                showMessage('まだもぐもぐちゅう！よくかんでね');
            }
            btnEat.classList.add('shake');
            setTimeout(() => btnEat.classList.remove('shake'), 400);
            return;
        }
        btnEat.classList.remove('ready');

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
            updateHeroSize();

            if (currentBites === maxBites) {
                // Clear!
                cancelCooldown();
                heroMask.classList.add('happy');
                showMessage("みっしょんくりあ！！ぜんぶたべたね！");
                fireConfetti();
                if (isRunning) toggleTimer(); // Stop timer
            } else {
                if (currentBites % 5 === 0) {
                    // 成長の節目
                    showMessage("おおきくなってきた！");
                } else {
                    // Random message
                    const msg = messages[Math.floor(Math.random() * messages.length)];
                    showMessage(msg);
                }
                startCooldown(); // よく噛む時間スタート
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
        
        cancelCooldown();
        updateTimerDisplay();
        progressBar.style.width = '0%';
        updateHeroSize();
        heroMask.classList.remove('happy', 'eating', 'chewing');
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
    updateHeroSize();
    updateClock();
    setInterval(updateClock, 200); // 実時刻の時計は常に動かす
    
    // Add touch support for better mobile/iPad responsiveness
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });
});
