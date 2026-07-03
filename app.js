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
    const COOLDOWN_SECONDS = 5; // ← ここを変えると噛む時間を調整できます
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

    // ===== たまごっち風 進化ステージ =====
    const HERO_STAGES = [
        { name: 'たまごのモグ', minBites: 0, svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<ellipse cx="100" cy="115" rx="60" ry="72" fill="#fffaf0" stroke="#f0dcc0" stroke-width="5"/>
<circle cx="70" cy="82" r="9" fill="#ffd9e0"/>
<circle cx="133" cy="70" r="7" fill="#c8f2e0"/>
<circle cx="127" cy="155" r="9" fill="#cfe3ff"/>
<circle cx="70" cy="152" r="6" fill="#fff1b8"/>
<ellipse class="eye" cx="82" cy="112" rx="7" ry="9" fill="#3a3a3a"/>
<ellipse class="eye" cx="118" cy="112" rx="7" ry="9" fill="#3a3a3a"/>
<circle cx="84.5" cy="108" r="2.5" fill="#fff"/>
<circle cx="120.5" cy="108" r="2.5" fill="#fff"/>
<ellipse cx="64" cy="127" rx="9" ry="6" fill="#ffc2cc"/>
<ellipse cx="136" cy="127" rx="9" ry="6" fill="#ffc2cc"/>
<path class="mouth" d="M 91 129 Q 100 138 109 129" fill="none" stroke="#e08585" stroke-width="4" stroke-linecap="round"/>
</svg>` },
        { name: 'ぷにモグ', minBites: 5, svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<path d="M 100 42 C 146 42 166 82 163 122 C 161 162 136 178 100 178 C 64 178 39 162 37 122 C 34 82 54 42 100 42 Z" fill="#c9f2e4" stroke="#a5e2cd" stroke-width="5"/>
<path d="M 100 42 Q 98 24 112 17" fill="none" stroke="#8fd9b6" stroke-width="5" stroke-linecap="round"/>
<circle cx="114" cy="16" r="8" fill="#ffd700" filter="url(#glow)"/>
<ellipse class="eye" cx="78" cy="106" rx="12" ry="15" fill="#3a3a3a"/>
<ellipse class="eye" cx="122" cy="106" rx="12" ry="15" fill="#3a3a3a"/>
<circle cx="82" cy="100" r="4.5" fill="#fff"/>
<circle cx="126" cy="100" r="4.5" fill="#fff"/>
<circle cx="74" cy="111" r="2" fill="#fff" opacity="0.8"/>
<circle cx="118" cy="111" r="2" fill="#fff" opacity="0.8"/>
<ellipse cx="56" cy="128" rx="10" ry="7" fill="#ffb6c1"/>
<ellipse cx="144" cy="128" rx="10" ry="7" fill="#ffb6c1"/>
<path class="mouth" d="M 88 131 Q 100 143 112 131" fill="none" stroke="#e77" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="80" cy="176" rx="14" ry="8" fill="#a5e2cd"/>
<ellipse cx="120" cy="176" rx="14" ry="8" fill="#a5e2cd"/>
</svg>` },
        { name: 'ちびモグヒーロー', minBites: 10, svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<circle cx="100" cy="118" r="66" fill="#fefefe" stroke="#e8e8e8" stroke-width="4"/>
<path d="M 38.1 95 A 66 66 0 0 1 161.9 95 Z" fill="#ff8fa3"/>
<path d="M 38.1 95 L 161.9 95" stroke="#ff7590" stroke-width="4" stroke-linecap="round"/>
<circle cx="100" cy="49" r="8" fill="#ffd700" filter="url(#glow)"/>
<path d="M 100.0,63.0 L 102.6,70.4 L 110.5,70.6 L 104.3,75.4 L 106.5,82.9 L 100.0,78.5 L 93.5,82.9 L 95.7,75.4 L 89.5,70.6 L 97.4,70.4 Z" fill="#fff" opacity="0.9"/>
<ellipse class="eye" cx="74" cy="122" rx="11" ry="14" fill="#3a3a3a"/>
<ellipse class="eye" cx="126" cy="122" rx="11" ry="14" fill="#3a3a3a"/>
<circle cx="78" cy="116" r="4" fill="#fff"/>
<circle cx="130" cy="116" r="4" fill="#fff"/>
<ellipse cx="52" cy="142" rx="10" ry="7" fill="#ffb6c1"/>
<ellipse cx="148" cy="142" rx="10" ry="7" fill="#ffb6c1"/>
<path class="mouth" d="M 86 146 Q 100 158 114 146" fill="none" stroke="#e77" stroke-width="5" stroke-linecap="round"/>
</svg>` },
        { name: 'モグモグヒーロー', minBites: 15, svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="eyeg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#6fc3ff"/><stop offset="100%" stop-color="#1f7ae0"/></linearGradient>
</defs>
<path class="antenna" d="M 100 36 L 87 68 L 113 68 Z" fill="#ffd700" stroke="#ffb400" stroke-width="4" stroke-linejoin="round" filter="url(#glow)"/>
<circle cx="100" cy="34" r="11" fill="#ffd700"/>
<circle cx="100" cy="120" r="70" fill="#fefefe" stroke="#e0e0e0" stroke-width="4"/>
<circle cx="30" cy="120" r="12" fill="#ff8fa3"/>
<circle cx="170" cy="120" r="12" fill="#ff8fa3"/>
<path d="M 30 120 A 70 70 0 0 1 170 120 L 170 106 A 70 70 0 0 0 30 106 Z" fill="#ff6b81"/>
<ellipse class="eye" cx="68" cy="118" rx="20" ry="27" fill="url(#eyeg)"/>
<ellipse class="eye" cx="132" cy="118" rx="20" ry="27" fill="url(#eyeg)"/>
<circle cx="74" cy="106" r="7" fill="#fff"/>
<circle cx="138" cy="106" r="7" fill="#fff"/>
<circle cx="62" cy="126" r="3" fill="#fff" opacity="0.8"/>
<circle cx="126" cy="126" r="3" fill="#fff" opacity="0.8"/>
<ellipse cx="45" cy="150" rx="12" ry="8" fill="#ffb6c1" opacity="0.9"/>
<ellipse cx="155" cy="150" rx="12" ry="8" fill="#ffb6c1" opacity="0.9"/>
<path class="mouth" d="M 84 160 Q 100 176 116 160" fill="none" stroke="#ff6b81" stroke-width="5" stroke-linecap="round"/>
</svg>` },
        { name: '✨ゴールドモグ✨', minBites: 20, svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="goldg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffe066"/><stop offset="100%" stop-color="#ffb400"/></linearGradient>
</defs>
<circle cx="100" cy="120" r="84" fill="rgba(255,215,0,0.12)"/>
<circle cx="100" cy="120" r="78" fill="none" stroke="rgba(255,215,0,0.45)" stroke-width="2" stroke-dasharray="6 8"/>
<path d="M 38.0,44.0 L 39.9,49.4 L 45.6,49.5 L 41.0,53.0 L 42.7,58.5 L 38.0,55.2 L 33.3,58.5 L 35.0,53.0 L 30.4,49.5 L 36.1,49.4 Z" fill="#ffd700" opacity="0.9"/>
<path d="M 166.0,60.0 L 167.4,64.1 L 171.7,64.1 L 168.3,66.7 L 169.5,70.9 L 166.0,68.4 L 162.5,70.9 L 163.7,66.7 L 160.3,64.1 L 164.6,64.1 Z" fill="#ffd700" opacity="0.9"/>
<path d="M 172.0,151.0 L 173.6,155.7 L 178.7,155.8 L 174.7,158.9 L 176.1,163.7 L 172.0,160.8 L 167.9,163.7 L 169.3,158.9 L 165.3,155.8 L 170.4,155.7 Z" fill="#ffd700" opacity="0.9"/>
<path class="antenna" d="M 100 32 L 85 66 L 115 66 Z" fill="url(#goldg)" stroke="#ffb400" stroke-width="4" stroke-linejoin="round" filter="url(#glow)"/>
<path d="M 100.0,15.0 L 103.1,23.8 L 112.4,24.0 L 104.9,29.6 L 107.6,38.5 L 100.0,33.2 L 92.4,38.5 L 95.1,29.6 L 87.6,24.0 L 96.9,23.8 Z" fill="#ffd700" filter="url(#glow)"/>
<path d="M 30 118 Q 8 100 14 76 Q 34 88 40 106 Z" fill="url(#goldg)" opacity="0.95"/>
<path d="M 170 118 Q 192 100 186 76 Q 166 88 160 106 Z" fill="url(#goldg)" opacity="0.95"/>
<circle cx="100" cy="120" r="70" fill="#fffbe8" stroke="#ffe066" stroke-width="4"/>
<path d="M 30 120 A 70 70 0 0 1 170 120 L 170 106 A 70 70 0 0 0 30 106 Z" fill="url(#goldg)"/>
<ellipse class="eye" cx="68" cy="118" rx="20" ry="27" fill="#4a3200"/>
<ellipse class="eye" cx="132" cy="118" rx="20" ry="27" fill="#4a3200"/>
<path d="M 72.0,102.0 L 73.9,107.4 L 79.6,107.5 L 75.0,111.0 L 76.7,116.5 L 72.0,113.2 L 67.3,116.5 L 69.0,111.0 L 64.4,107.5 L 70.1,107.4 Z" fill="#fff"/>
<path d="M 136.0,102.0 L 137.9,107.4 L 143.6,107.5 L 139.0,111.0 L 140.7,116.5 L 136.0,113.2 L 131.3,116.5 L 133.0,111.0 L 128.4,107.5 L 134.1,107.4 Z" fill="#fff"/>
<circle cx="62" cy="128" r="3" fill="#fff" opacity="0.8"/>
<circle cx="126" cy="128" r="3" fill="#fff" opacity="0.8"/>
<ellipse cx="45" cy="150" rx="12" ry="8" fill="#ffcf8a" opacity="0.95"/>
<ellipse cx="155" cy="150" rx="12" ry="8" fill="#ffcf8a" opacity="0.95"/>
<path class="mouth" d="M 82 158 Q 100 178 118 158" fill="none" stroke="#e6a23c" stroke-width="5" stroke-linecap="round"/>
</svg>` }
    ];
    let currentStage = -1;

    function updateHeroStage() {
        let idx = 0;
        for (let i = 0; i < HERO_STAGES.length; i++) {
            if (currentBites >= HERO_STAGES[i].minBites) idx = i;
        }
        if (idx === currentStage) return false;
        const evolved = currentStage >= 0 && idx > currentStage;
        currentStage = idx;
        heroMask.innerHTML = HERO_STAGES[idx].svg;
        if (evolved) {
            heroMask.classList.add('evolving');
            setTimeout(() => heroMask.classList.remove('evolving'), 900);
            showMessage(`しんか！「${HERO_STAGES[idx].name}」になった！`);
            if (typeof confetti === 'function') {
                confetti({ particleCount: 70, spread: 90, startVelocity: 35, origin: { x: 0.28, y: 0.45 }, zIndex: 9999 });
            }
        }
        return evolved;
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
            const evolved = updateHeroStage(); // 進化チェック

            if (currentBites === maxBites) {
                // Clear!
                cancelCooldown();
                heroMask.classList.add('happy');
                setTimeout(() => showMessage("みっしょんくりあ！！さいしゅうしんかだ！"), evolved ? 1500 : 0);
                fireConfetti();
                if (isRunning) toggleTimer(); // Stop timer
            } else {
                if (!evolved) {
                    // Random message（進化メッセージがある時はそちらを優先）
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
        currentStage = -1;
        updateHeroStage(); // たまごに戻る
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
    updateHeroStage(); // たまごからスタート
    updateClock();
    setInterval(updateClock, 200); // 実時刻の時計は常に動かす
    
    // Add touch support for better mobile/iPad responsiveness
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });
});
