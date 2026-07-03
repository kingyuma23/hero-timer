document.addEventListener('DOMContentLoaded', () => {
    // ===== Elements =====
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
    const beltText = document.querySelector('.belt-text');
    const btnDex = document.getElementById('btnDex');
    const btnSettings = document.getElementById('btnSettings');
    const dexModal = document.getElementById('dexModal');
    const settingsModal = document.getElementById('settingsModal');
    const dexGrid = document.getElementById('dexGrid');
    const streakBox = document.getElementById('streakBox');

    // ===== 保存ヘルパー（localStorageが使えない環境でも動く） =====
    const store = {
        get(key, fallback) {
            try {
                const v = localStorage.getItem(key);
                return v ? JSON.parse(v) : fallback;
            } catch (e) { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
        }
    };

    // ===== おうちのひと せってい =====
    const settings = Object.assign(
        { maxBites: 20, cooldown: 5, sound: true, voice: true },
        store.get('mogu-settings', {})
    );
    function saveSettings() { store.set('mogu-settings', settings); }

    const CHARACTERS = {
        egg: { name: 'たまごのモグ', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_egg"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<ellipse cx="100" cy="115" rx="60" ry="72" fill="#fffaf0" stroke="#f0dcc0" stroke-width="5"/>
<circle cx="70" cy="82" r="9" fill="#ffd9e0"/><circle cx="133" cy="70" r="7" fill="#c8f2e0"/><circle cx="127" cy="155" r="9" fill="#cfe3ff"/><circle cx="70" cy="152" r="6" fill="#fff1b8"/>
<ellipse class="eye" cx="82" cy="112" rx="7" ry="9" fill="#3a3a3a"/>
<ellipse class="eye" cx="118" cy="112" rx="7" ry="9" fill="#3a3a3a"/>
<circle cx="84.5" cy="108" r="2.5" fill="#fff"/><circle cx="120.5" cy="108" r="2.5" fill="#fff"/>
<ellipse cx="64" cy="127" rx="9" ry="6" fill="#ffc2cc"/><ellipse cx="136" cy="127" rx="9" ry="6" fill="#ffc2cc"/>
<path class="mouth" d="M 91 129 Q 100 138 109 129" fill="none" stroke="#e08585" stroke-width="4" stroke-linecap="round"/></svg>` },
        egg_gold: { name: 'ゴールドたまご', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_egggold"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<ellipse cx="100" cy="115" rx="74" ry="86" fill="rgba(255,215,0,0.12)"/><ellipse cx="100" cy="115" rx="60" ry="72" fill="#fff3c8" stroke="#ffd700" stroke-width="5"/>
<path d="M 70.0,73.0 L 72.1,79.1 L 78.6,79.2 L 73.4,83.1 L 75.3,89.3 L 70.0,85.6 L 64.7,89.3 L 66.6,83.1 L 61.4,79.2 L 67.9,79.1 Z" fill="#ffe27a"/><path d="M 133.0,63.0 L 134.6,67.7 L 139.7,67.8 L 135.7,70.9 L 137.1,75.7 L 133.0,72.8 L 128.9,75.7 L 130.3,70.9 L 126.3,67.8 L 131.4,67.7 Z" fill="#ffe27a"/><path d="M 127.0,146.0 L 129.1,152.1 L 135.6,152.2 L 130.4,156.1 L 132.3,162.3 L 127.0,158.6 L 121.7,162.3 L 123.6,156.1 L 118.4,152.2 L 124.9,152.1 Z" fill="#ffe27a"/><path d="M 70.0,146.0 L 71.4,150.1 L 75.7,150.1 L 72.3,152.7 L 73.5,156.9 L 70.0,154.4 L 66.5,156.9 L 67.7,152.7 L 64.3,150.1 L 68.6,150.1 Z" fill="#ffe27a"/>
<ellipse class="eye" cx="82" cy="112" rx="7" ry="9" fill="#3a3a3a"/>
<ellipse class="eye" cx="118" cy="112" rx="7" ry="9" fill="#3a3a3a"/>
<circle cx="84.5" cy="108" r="2.5" fill="#fff"/><circle cx="120.5" cy="108" r="2.5" fill="#fff"/>
<ellipse cx="64" cy="127" rx="9" ry="6" fill="#ffc2cc"/><ellipse cx="136" cy="127" rx="9" ry="6" fill="#ffc2cc"/>
<path class="mouth" d="M 91 129 Q 100 138 109 129" fill="none" stroke="#e08585" stroke-width="4" stroke-linecap="round"/></svg>` },
        puni: { name: 'ぷにモグ', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_puni"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<path d="M 100 42 C 146 42 166 82 163 122 C 161 162 136 178 100 178 C 64 178 39 162 37 122 C 34 82 54 42 100 42 Z" fill="#c9f2e4" stroke="#a5e2cd" stroke-width="5"/>
<path d="M 100 42 Q 98 24 112 17" fill="none" stroke="#a5e2cd" stroke-width="5" stroke-linecap="round"/>
<circle cx="114" cy="16" r="8" fill="#ffd700" filter="url(#glow_puni)"/>
<ellipse class="eye" cx="78" cy="106" rx="12" ry="15" fill="#3a3a3a"/>
<ellipse class="eye" cx="122" cy="106" rx="12" ry="15" fill="#3a3a3a"/>
<circle cx="82" cy="100" r="4.5" fill="#fff"/><circle cx="126" cy="100" r="4.5" fill="#fff"/>
<circle cx="74" cy="111" r="2" fill="#fff" opacity="0.8"/><circle cx="118" cy="111" r="2" fill="#fff" opacity="0.8"/>
<ellipse cx="56" cy="128" rx="10" ry="7" fill="#ffb6c1"/><ellipse cx="144" cy="128" rx="10" ry="7" fill="#ffb6c1"/>
<path class="mouth" d="M 88 131 Q 100 143 112 131" fill="none" stroke="#e77" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="80" cy="176" rx="14" ry="8" fill="#a5e2cd"/><ellipse cx="120" cy="176" rx="14" ry="8" fill="#a5e2cd"/></svg>` },
        momo: { name: 'ももモグ', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_momo"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<path d="M 100 42 C 146 42 166 82 163 122 C 161 162 136 178 100 178 C 64 178 39 162 37 122 C 34 82 54 42 100 42 Z" fill="#ffd9e6" stroke="#ffb3cd" stroke-width="5"/>
<path d="M 100 42 Q 98 24 112 17" fill="none" stroke="#ffb3cd" stroke-width="5" stroke-linecap="round"/>
<path d="M 114 22 c -3 -6 -13 -4 -13 3 c 0 6 13 11 13 11 c 0 0 13 -5 13 -11 c 0 -7 -10 -9 -13 -3 Z" fill="#ff6b81"/>
<ellipse class="eye" cx="78" cy="106" rx="12" ry="15" fill="#3a3a3a"/>
<ellipse class="eye" cx="122" cy="106" rx="12" ry="15" fill="#3a3a3a"/>
<circle cx="82" cy="100" r="4.5" fill="#fff"/><circle cx="126" cy="100" r="4.5" fill="#fff"/>
<circle cx="74" cy="111" r="2" fill="#fff" opacity="0.8"/><circle cx="118" cy="111" r="2" fill="#fff" opacity="0.8"/>
<ellipse cx="56" cy="128" rx="10" ry="7" fill="#ffb6c1"/><ellipse cx="144" cy="128" rx="10" ry="7" fill="#ffb6c1"/>
<path class="mouth" d="M 88 131 Q 100 143 112 131" fill="none" stroke="#e77" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="80" cy="176" rx="14" ry="8" fill="#ffb3cd"/><ellipse cx="120" cy="176" rx="14" ry="8" fill="#ffb3cd"/></svg>` },
        chibi: { name: 'ちびモグヒーロー', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_chibi"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<circle cx="100" cy="118" r="66" fill="#fefefe" stroke="#e8e8e8" stroke-width="4"/>
<path d="M 38.1 95 A 66 66 0 0 1 161.9 95 Z" fill="#ff8fa3"/>
<path d="M 38.1 95 L 161.9 95" stroke="#ff7590" stroke-width="4" stroke-linecap="round"/>
<circle cx="100" cy="49" r="8" fill="#ffd700" filter="url(#glow_chibi)"/><path d="M 100.0,63.0 L 102.6,70.4 L 110.5,70.6 L 104.3,75.4 L 106.5,82.9 L 100.0,78.5 L 93.5,82.9 L 95.7,75.4 L 89.5,70.6 L 97.4,70.4 Z" fill="#fff" opacity="0.9"/>
<ellipse class="eye" cx="74" cy="122" rx="11" ry="14" fill="#3a3a3a"/>
<ellipse class="eye" cx="126" cy="122" rx="11" ry="14" fill="#3a3a3a"/>
<circle cx="78" cy="116" r="4" fill="#fff"/><circle cx="130" cy="116" r="4" fill="#fff"/>
<ellipse cx="52" cy="142" rx="10" ry="7" fill="#ffb6c1"/><ellipse cx="148" cy="142" rx="10" ry="7" fill="#ffb6c1"/>
<path class="mouth" d="M 86 146 Q 100 158 114 146" fill="none" stroke="#e77" stroke-width="5" stroke-linecap="round"/></svg>` },
        mori: { name: 'もりモグ', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_mori"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<circle cx="100" cy="118" r="66" fill="#fefefe" stroke="#e8e8e8" stroke-width="4"/>
<path d="M 38.1 95 A 66 66 0 0 1 161.9 95 Z" fill="#8bd48b"/>
<path d="M 38.1 95 L 161.9 95" stroke="#6fc06f" stroke-width="4" stroke-linecap="round"/>
<path d="M 100 50 Q 100 40 106 34" fill="none" stroke="#5a9e5a" stroke-width="4" stroke-linecap="round"/><ellipse cx="114" cy="30" rx="13" ry="7" fill="#6fc06f" transform="rotate(-28 114 30)"/><path d="M 100.0,64.0 L 102.4,70.8 L 109.5,70.9 L 103.8,75.2 L 105.9,82.1 L 100.0,78.0 L 94.1,82.1 L 96.2,75.2 L 90.5,70.9 L 97.6,70.8 Z" fill="#eaffea" opacity="0.9"/>
<ellipse class="eye" cx="74" cy="122" rx="11" ry="14" fill="#3a3a3a"/>
<ellipse class="eye" cx="126" cy="122" rx="11" ry="14" fill="#3a3a3a"/>
<circle cx="78" cy="116" r="4" fill="#fff"/><circle cx="130" cy="116" r="4" fill="#fff"/>
<ellipse cx="52" cy="142" rx="10" ry="7" fill="#ffb6c1"/><ellipse cx="148" cy="142" rx="10" ry="7" fill="#ffb6c1"/>
<path class="mouth" d="M 86 146 Q 100 158 114 146" fill="none" stroke="#e77" stroke-width="5" stroke-linecap="round"/></svg>` },
        sora: { name: 'そらモグ', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_sora"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<circle cx="100" cy="118" r="66" fill="#fefefe" stroke="#e8e8e8" stroke-width="4"/>
<path d="M 38.1 95 A 66 66 0 0 1 161.9 95 Z" fill="#7ec8ff"/>
<path d="M 38.1 95 L 161.9 95" stroke="#5ab3f5" stroke-width="4" stroke-linecap="round"/>
<circle cx="88" cy="52" r="8" fill="#fff"/><circle cx="100" cy="47" r="10" fill="#fff"/><circle cx="112" cy="52" r="8" fill="#fff"/><path d="M 100.0,64.0 L 102.4,70.8 L 109.5,70.9 L 103.8,75.2 L 105.9,82.1 L 100.0,78.0 L 94.1,82.1 L 96.2,75.2 L 90.5,70.9 L 97.6,70.8 Z" fill="#eaf5ff" opacity="0.95"/>
<ellipse class="eye" cx="74" cy="122" rx="11" ry="14" fill="#3a3a3a"/>
<ellipse class="eye" cx="126" cy="122" rx="11" ry="14" fill="#3a3a3a"/>
<circle cx="78" cy="116" r="4" fill="#fff"/><circle cx="130" cy="116" r="4" fill="#fff"/>
<ellipse cx="52" cy="142" rx="10" ry="7" fill="#ffb6c1"/><ellipse cx="148" cy="142" rx="10" ry="7" fill="#ffb6c1"/>
<path class="mouth" d="M 86 146 Q 100 158 114 146" fill="none" stroke="#e77" stroke-width="5" stroke-linecap="round"/></svg>` },
        hero: { name: 'モグモグヒーロー', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_hero"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="eyeg_hero" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#6fc3ff"/><stop offset="100%" stop-color="#1f7ae0"/></linearGradient></defs>
<path class="antenna" d="M 100 36 L 87 68 L 113 68 Z" fill="#ffd700" stroke="#ffb400" stroke-width="4" stroke-linejoin="round" filter="url(#glow_hero)"/><circle cx="100" cy="34" r="11" fill="#ffd700"/>
<circle cx="100" cy="120" r="70" fill="#fefefe" stroke="#e0e0e0" stroke-width="4"/>
<circle cx="30" cy="120" r="12" fill="#ff8fa3"/><circle cx="170" cy="120" r="12" fill="#ff8fa3"/>
<path d="M 30 120 A 70 70 0 0 1 170 120 L 170 106 A 70 70 0 0 0 30 106 Z" fill="#ff6b81"/>
<ellipse class="eye" cx="68" cy="118" rx="20" ry="27" fill="url(#eyeg_hero)"/>
<ellipse class="eye" cx="132" cy="118" rx="20" ry="27" fill="url(#eyeg_hero)"/>
<circle cx="74" cy="106" r="7" fill="#fff"/><circle cx="138" cy="106" r="7" fill="#fff"/>
<circle cx="62" cy="126" r="3" fill="#fff" opacity="0.8"/><circle cx="126" cy="126" r="3" fill="#fff" opacity="0.8"/>
<ellipse cx="45" cy="150" rx="12" ry="8" fill="#ffb6c1" opacity="0.9"/><ellipse cx="155" cy="150" rx="12" ry="8" fill="#ffb6c1" opacity="0.9"/>
<path class="mouth" d="M 84 160 Q 100 176 116 160" fill="none" stroke="#ff6b81" stroke-width="5" stroke-linecap="round"/></svg>` },
        flame: { name: 'フレイムモグ', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_flame"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="eyeg_flame" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffd76e"/><stop offset="100%" stop-color="#ff7b2e"/></linearGradient></defs>
<path d="M 100 22 C 90 40 88 52 100 66 C 112 52 110 40 100 22 Z" fill="#ff7b2e" stroke="#e85d00" stroke-width="3" filter="url(#glow_flame)"/><path d="M 100 36 C 95 46 95 52 100 60 C 105 52 105 46 100 36 Z" fill="#ffd76e"/>
<circle cx="100" cy="120" r="70" fill="#fefefe" stroke="#e0e0e0" stroke-width="4"/>
<circle cx="30" cy="120" r="12" fill="#ffb26b"/><circle cx="170" cy="120" r="12" fill="#ffb26b"/>
<path d="M 30 120 A 70 70 0 0 1 170 120 L 170 106 A 70 70 0 0 0 30 106 Z" fill="#ff8c42"/>
<ellipse class="eye" cx="68" cy="118" rx="20" ry="27" fill="url(#eyeg_flame)"/>
<ellipse class="eye" cx="132" cy="118" rx="20" ry="27" fill="url(#eyeg_flame)"/>
<circle cx="74" cy="106" r="7" fill="#fff"/><circle cx="138" cy="106" r="7" fill="#fff"/>
<circle cx="62" cy="126" r="3" fill="#fff" opacity="0.8"/><circle cx="126" cy="126" r="3" fill="#fff" opacity="0.8"/>
<ellipse cx="45" cy="150" rx="12" ry="8" fill="#ffb6c1" opacity="0.9"/><ellipse cx="155" cy="150" rx="12" ry="8" fill="#ffb6c1" opacity="0.9"/>
<path class="mouth" d="M 84 160 Q 100 176 116 160" fill="none" stroke="#ff8c42" stroke-width="5" stroke-linecap="round"/></svg>` },
        aqua: { name: 'アクアモグ', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_aqua"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="eyeg_aqua" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#a8e6ff"/><stop offset="100%" stop-color="#2a9bea"/></linearGradient></defs>
<path d="M 100 24 C 91 42 89 50 100 62 C 111 50 109 42 100 24 Z" fill="#5ec4ff" stroke="#2a9bea" stroke-width="3" filter="url(#glow_aqua)"/><circle cx="96" cy="46" r="3.5" fill="#fff" opacity="0.85"/>
<circle cx="100" cy="120" r="70" fill="#fefefe" stroke="#e0e0e0" stroke-width="4"/>
<circle cx="30" cy="120" r="12" fill="#8fd0ff"/><circle cx="170" cy="120" r="12" fill="#8fd0ff"/>
<path d="M 30 120 A 70 70 0 0 1 170 120 L 170 106 A 70 70 0 0 0 30 106 Z" fill="#4facfe"/>
<ellipse class="eye" cx="68" cy="118" rx="20" ry="27" fill="url(#eyeg_aqua)"/>
<ellipse class="eye" cx="132" cy="118" rx="20" ry="27" fill="url(#eyeg_aqua)"/>
<circle cx="74" cy="106" r="7" fill="#fff"/><circle cx="138" cy="106" r="7" fill="#fff"/>
<circle cx="62" cy="126" r="3" fill="#fff" opacity="0.8"/><circle cx="126" cy="126" r="3" fill="#fff" opacity="0.8"/>
<ellipse cx="45" cy="150" rx="12" ry="8" fill="#ffb6c1" opacity="0.9"/><ellipse cx="155" cy="150" rx="12" ry="8" fill="#ffb6c1" opacity="0.9"/>
<path class="mouth" d="M 84 160 Q 100 176 116 160" fill="none" stroke="#4facfe" stroke-width="5" stroke-linecap="round"/></svg>` },
        gold: { name: '✨ゴールドモグ✨', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_gold"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="fin_gold" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffe066"/><stop offset="100%" stop-color="#ffb400"/></linearGradient></defs>
<circle cx="100" cy="120" r="84" fill="rgba(255,215,0,0.12)"/>
<circle cx="100" cy="120" r="78" fill="none" stroke="rgba(255,215,0,0.45)" stroke-width="2" stroke-dasharray="6 8"/>
<path class="antenna" d="M 100 32 L 85 66 L 115 66 Z" fill="url(#fin_gold)" stroke="#ffb400" stroke-width="4" stroke-linejoin="round" filter="url(#glow_gold)"/>
<path d="M 100.0,15.0 L 103.1,23.8 L 112.4,24.0 L 104.9,29.6 L 107.6,38.5 L 100.0,33.2 L 92.4,38.5 L 95.1,29.6 L 87.6,24.0 L 96.9,23.8 Z" fill="#ffd700" filter="url(#glow_gold)"/>
<path d="M 30 118 Q 8 100 14 76 Q 34 88 40 106 Z" fill="url(#fin_gold)" opacity="0.95"/><path d="M 170 118 Q 192 100 186 76 Q 166 88 160 106 Z" fill="url(#fin_gold)" opacity="0.95"/><path d="M 38.0,44.0 L 39.9,49.4 L 45.6,49.5 L 41.0,53.0 L 42.7,58.5 L 38.0,55.2 L 33.3,58.5 L 35.0,53.0 L 30.4,49.5 L 36.1,49.4 Z" fill="#ffd700" opacity="0.9"/><path d="M 166.0,60.0 L 167.4,64.1 L 171.7,64.1 L 168.3,66.7 L 169.5,70.9 L 166.0,68.4 L 162.5,70.9 L 163.7,66.7 L 160.3,64.1 L 164.6,64.1 Z" fill="#ffd700" opacity="0.9"/>
<circle cx="100" cy="120" r="70" fill="#fffbe8" stroke="#ffe066" stroke-width="4"/>
<path d="M 30 120 A 70 70 0 0 1 170 120 L 170 106 A 70 70 0 0 0 30 106 Z" fill="url(#fin_gold)"/>
<ellipse class="eye" cx="68" cy="118" rx="20" ry="27" fill="#4a3200"/><ellipse class="eye" cx="132" cy="118" rx="20" ry="27" fill="#4a3200"/><path d="M 72.0,102.0 L 73.9,107.4 L 79.6,107.5 L 75.0,111.0 L 76.7,116.5 L 72.0,113.2 L 67.3,116.5 L 69.0,111.0 L 64.4,107.5 L 70.1,107.4 Z" fill="#fff"/><path d="M 136.0,102.0 L 137.9,107.4 L 143.6,107.5 L 139.0,111.0 L 140.7,116.5 L 136.0,113.2 L 131.3,116.5 L 133.0,111.0 L 128.4,107.5 L 134.1,107.4 Z" fill="#fff"/>
<circle cx="62" cy="128" r="3" fill="#fff" opacity="0.8"/><circle cx="126" cy="128" r="3" fill="#fff" opacity="0.8"/>
<ellipse cx="45" cy="150" rx="12" ry="8" fill="#ffcf8a" opacity="0.95"/><ellipse cx="155" cy="150" rx="12" ry="8" fill="#ffcf8a" opacity="0.95"/>
<path class="mouth" d="M 82 158 Q 100 178 118 158" fill="none" stroke="#e6a23c" stroke-width="5" stroke-linecap="round"/></svg>` },
        rainbow: { name: '🌈レインボーモグ🌈', svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow_rainbow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="fin_rainbow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff6b6b"/><stop offset="20%" stop-color="#ffa94d"/><stop offset="40%" stop-color="#ffe066"/><stop offset="60%" stop-color="#69db7c"/><stop offset="80%" stop-color="#74c0fc"/><stop offset="100%" stop-color="#b197fc"/></linearGradient></defs>
<circle cx="100" cy="120" r="84" fill="rgba(177,151,252,0.15)"/>
<path d="M 30 60 A 78 78 0 0 1 170 60" fill="none" stroke="url(#fin_rainbow)" stroke-width="8" stroke-linecap="round" opacity="0.9"/>
<path class="antenna" d="M 100 32 L 85 66 L 115 66 Z" fill="url(#fin_rainbow)" stroke="#ffb400" stroke-width="4" stroke-linejoin="round" filter="url(#glow_rainbow)"/>
<path d="M 100.0,15.0 L 103.1,23.8 L 112.4,24.0 L 104.9,29.6 L 107.6,38.5 L 100.0,33.2 L 92.4,38.5 L 95.1,29.6 L 87.6,24.0 L 96.9,23.8 Z" fill="#ffd700" filter="url(#glow_rainbow)"/>
<path d="M 34.0,113.0 L 35.6,117.7 L 40.7,117.8 L 36.7,120.9 L 38.1,125.7 L 34.0,122.8 L 29.9,125.7 L 31.3,120.9 L 27.3,117.8 L 32.4,117.7 Z" fill="#74c0fc"/><path d="M 166.0,113.0 L 167.6,117.7 L 172.7,117.8 L 168.7,120.9 L 170.1,125.7 L 166.0,122.8 L 161.9,125.7 L 163.3,120.9 L 159.3,117.8 L 164.4,117.7 Z" fill="#ff6b6b"/>
<circle cx="100" cy="120" r="70" fill="#ffffff" stroke="#e6e0ff" stroke-width="4"/>
<path d="M 30 120 A 70 70 0 0 1 170 120 L 170 106 A 70 70 0 0 0 30 106 Z" fill="url(#fin_rainbow)"/>
<ellipse class="eye" cx="68" cy="118" rx="20" ry="27" fill="#4a3a6b"/><ellipse class="eye" cx="132" cy="118" rx="20" ry="27" fill="#4a3a6b"/><path d="M 72.0,102.0 L 73.9,107.4 L 79.6,107.5 L 75.0,111.0 L 76.7,116.5 L 72.0,113.2 L 67.3,116.5 L 69.0,111.0 L 64.4,107.5 L 70.1,107.4 Z" fill="#ffe066"/><path d="M 136.0,102.0 L 137.9,107.4 L 143.6,107.5 L 139.0,111.0 L 140.7,116.5 L 136.0,113.2 L 131.3,116.5 L 133.0,111.0 L 128.4,107.5 L 134.1,107.4 Z" fill="#74c0fc"/>
<circle cx="62" cy="128" r="3" fill="#fff" opacity="0.8"/><circle cx="126" cy="128" r="3" fill="#fff" opacity="0.8"/>
<ellipse cx="45" cy="150" rx="12" ry="8" fill="#ffc2e0" opacity="0.95"/><ellipse cx="155" cy="150" rx="12" ry="8" fill="#ffc2e0" opacity="0.95"/>
<path class="mouth" d="M 82 158 Q 100 178 118 158" fill="none" stroke="#b197fc" stroke-width="5" stroke-linecap="round"/></svg>` }
    };

    // 進化ツリー：各ステージの候補（w = 出やすさ）
    const STAGE_BRANCHES = [
        [{ id: 'egg', w: 1 }], // ※れんぞく3日以上でゴールドたまごに！
        [{ id: 'puni', w: 1 }, { id: 'momo', w: 1 }],
        [{ id: 'chibi', w: 1 }, { id: 'mori', w: 1 }, { id: 'sora', w: 1 }],
        [{ id: 'hero', w: 1 }, { id: 'flame', w: 1 }, { id: 'aqua', w: 1 }],
        [{ id: 'gold', w: 3 }, { id: 'rainbow', w: 1 }] // レインボーはレア！
    ];
    const DEX_ORDER = ['egg', 'egg_gold', 'puni', 'momo', 'chibi', 'mori', 'sora', 'hero', 'flame', 'aqua', 'gold', 'rainbow'];

    // ===== モグずかん =====
    let dex = store.get('mogu-dex', []);
    function collect(id) {
        if (!dex.includes(id)) {
            dex.push(id);
            store.set('mogu-dex', dex);
        }
    }

    // ===== 完食スタンプ＆れんぞく記録 =====
    function dateKey(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
    }
    function getStamps() { return store.get('mogu-stamps', {}); }
    function getStreak() {
        const stamps = getStamps();
        const d = new Date();
        if (!stamps[dateKey(d)]) d.setDate(d.getDate() - 1); // 今日まだなら昨日から数える
        let n = 0;
        while (stamps[dateKey(d)]) { n++; d.setDate(d.getDate() - 1); }
        return n;
    }
    function recordClear() {
        const stamps = getStamps();
        stamps[dateKey(new Date())] = true;
        store.set('mogu-stamps', stamps);
        return getStreak();
    }

    // ===== 効果音（Web Audio API・音声ファイル不要） =====
    let audioCtx = null;
    function ensureAudio() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        } catch (e) {}
    }
    function tone(freq, start, dur, type, vol) {
        const t0 = audioCtx.currentTime + start;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type || 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(t0);
        o.stop(t0 + dur + 0.05);
    }
    const SFX = {
        munch()   { tone(240, 0, 0.08, 'square', 0.10); tone(190, 0.09, 0.08, 'square', 0.08); },
        blocked() { tone(150, 0, 0.18, 'sawtooth', 0.06); },
        gulp()    { tone(420, 0, 0.09, 'sine', 0.14); tone(300, 0.08, 0.09, 'sine', 0.14); tone(200, 0.16, 0.16, 'sine', 0.14); },
        ready()   { tone(880, 0, 0.12, 'sine', 0.14); tone(1320, 0.1, 0.16, 'sine', 0.11); },
        evolve()  { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.26, 'triangle', 0.15)); },
        clear()   { [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.1, 0.32, 'triangle', 0.15)); },
        warn()    { tone(740, 0, 0.2, 'sine', 0.12); tone(740, 0.3, 0.2, 'sine', 0.12); },
        timeup()  { tone(660, 0, 0.35, 'sine', 0.14); tone(660, 0.45, 0.35, 'sine', 0.14); tone(660, 0.9, 0.5, 'sine', 0.14); }
    };
    function play(name) {
        if (!settings.sound) return;
        ensureAudio();
        if (!audioCtx) return;
        try { SFX[name](); } catch (e) {}
    }

    // ===== 声（Web Speech API） =====
    function speak(text) {
        if (!settings.voice) return;
        try {
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'ja-JP';
            u.rate = 1.0;
            u.pitch = 1.35;
            speechSynthesis.speak(u);
        } catch (e) {}
    }

    // ===== State =====
    let timerInterval = null;
    let totalSeconds = 30 * 60;
    let isRunning = false;
    let warnedFiveMin = false;
    let currentBites = 0;
    let mealPath = {};   // このごはんの進化ルート {stageIdx: charId}
    let currentStage = -1;

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

    // ===== 進化 =====
    function stageThresholds() {
        return [0, 0.25, 0.5, 0.75, 1].map(k => Math.round(k * settings.maxBites));
    }
    function pickBranch(idx) {
        if (mealPath[idx]) return mealPath[idx];
        let id;
        if (idx === 0) {
            id = getStreak() >= 3 ? 'egg_gold' : 'egg'; // れんぞくボーナス
        } else {
            const pool = STAGE_BRANCHES[idx];
            const total = pool.reduce((s, c) => s + c.w, 0);
            let r = Math.random() * total;
            for (const c of pool) { r -= c.w; if (r <= 0) { id = c.id; break; } }
            if (!id) id = pool[0].id;
        }
        mealPath[idx] = id;
        return id;
    }
    function updateHeroStage(silent) {
        const th = stageThresholds();
        let idx = 0;
        for (let i = 0; i < th.length; i++) {
            if (currentBites >= th[i]) idx = i;
        }
        if (idx === currentStage) return false;
        const evolved = currentStage >= 0 && idx > currentStage;
        currentStage = idx;
        const charId = pickBranch(idx);
        const ch = CHARACTERS[charId];
        heroMask.innerHTML = ch.svg;
        collect(charId);
        if (evolved && !silent) {
            heroMask.classList.add('evolving');
            setTimeout(() => heroMask.classList.remove('evolving'), 900);
            showMessage(`しんか！「${ch.name}」になった！`);
            play('evolve');
            speak(`しんか！${ch.name.replace(/[✨🌈]/g, '')}になった！`);
            if (typeof confetti === 'function') {
                confetti({ particleCount: 70, spread: 90, startVelocity: 35, origin: { x: 0.28, y: 0.45 }, zIndex: 9999 });
            }
        }
        return evolved;
    }

    // ===== ヒーローの成長（たべるたびに大きくなる） =====
    const heroMinScale = 0.5;
    const heroMaxScale = 1.15;
    function updateHeroSize() {
        const t = Math.min(currentBites / settings.maxBites, 1);
        const s = heroMinScale + (heroMaxScale - heroMinScale) * t;
        heroMask.style.setProperty('--hero-scale', s.toFixed(3));
    }

    // ===== もぐもぐクールダウン（よく噛む時間） =====
    let cooldownRemaining = 0;
    let cooldownInterval = null;
    let busyMessageAt = 0;

    function startCooldown() {
        cooldownRemaining = settings.cooldown;
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
        play('ready');
    }
    function cancelCooldown() {
        clearInterval(cooldownInterval);
        cooldownRemaining = 0;
        btnEat.classList.remove('cooldown', 'ready');
        heroMask.classList.remove('chewing');
        beltText.textContent = 'たべたよ！';
    }

    // ===== タイマー =====
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

        if (hourHand) hourHand.setAttribute('transform', `rotate(${hr * 30} 50 50)`);
        if (minuteHand) minuteHand.setAttribute('transform', `rotate(${min * 6} 50 50)`);
        if (secondHand) secondHand.setAttribute('transform', `rotate(${sec * 6} 50 50)`);

        if (timeSlice) {
            const circumference = 125.664; // 2 * PI * r (r=20)
            let fraction = totalSeconds / 3600;
            if (fraction > 1) fraction = 1;
            if (fraction < 0) fraction = 0;
            timeSlice.setAttribute('transform', `rotate(${min * 6 - 90} 50 50)`);
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
            if (totalSeconds > 5 * 60) warnedFiveMin = false;
            timerInterval = setInterval(() => {
                totalSeconds--;
                updateTimerDisplay();
                if (totalSeconds === 5 * 60 && !warnedFiveMin) {
                    warnedFiveMin = true;
                    showMessage('あと5ふん！');
                    play('warn');
                    speak('あと5ふんだよ');
                }
                if (totalSeconds <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    btnStart.textContent = "スタート";
                    btnStart.classList.remove('running');
                    showMessage("じかんになったよ！");
                    play('timeup');
                    speak('じかんになったよ');
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
        if (totalSeconds > 5 * 60) warnedFiveMin = false;
        updateTimerDisplay();
    }

    // ===== メッセージ =====
    let messageTimeout;
    function showMessage(text) {
        message.textContent = text;
        message.classList.add('show');
        clearTimeout(messageTimeout);
        messageTimeout = setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    // ===== たべたよ！ =====
    function eatAction() {
        ensureAudio();

        // もぐもぐちゅうは押せない（よく噛もう！）
        if (cooldownRemaining > 0) {
            const now = Date.now();
            if (now - busyMessageAt > 2000) {
                busyMessageAt = now;
                showMessage('まだもぐもぐちゅう！よくかんでね');
                play('blocked');
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

        if (currentBites < settings.maxBites) {
            currentBites++;
            play('munch');
            const percentage = Math.min(currentBites / settings.maxBites, 1) * 100;
            progressBar.style.width = `${percentage}%`;
            updateHeroSize();
            const evolved = updateHeroStage(); // 進化チェック

            if (currentBites >= settings.maxBites) {
                // Clear!
                cancelCooldown();
                heroMask.classList.add('happy');
                const streak = recordClear();
                const streakText = streak >= 2 ? `🔥${streak}にちれんぞく！` : '';
                setTimeout(() => {
                    showMessage(`みっしょんくりあ！！${streakText}`);
                    play('clear');
                    speak(`ミッションクリア！ぜんぶたべたね！${streak >= 2 ? streak + 'にちれんぞく、すごい！' : 'えらい！'}`);
                }, evolved ? 1500 : 0);
                fireConfetti();
                if (isRunning) toggleTimer(); // Stop timer
            } else {
                if (!evolved) {
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
        if (typeof confetti !== 'function') return;
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
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }

    // ===== リセット =====
    function resetApp() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            btnStart.textContent = "スタート";
            btnStart.classList.remove('running');
        }
        cancelCooldown();
        totalSeconds = 30 * 60;
        currentBites = 0;
        warnedFiveMin = false;
        mealPath = {};
        currentStage = -1;

        updateTimerDisplay();
        progressBar.style.width = '0%';
        updateHeroSize();
        updateHeroStage(true); // たまごに戻る
        heroMask.classList.remove('happy', 'eating', 'chewing');
        message.classList.remove('show');

        if (typeof confetti === 'function' && confetti.reset) {
            confetti.reset();
        }
    }

    // ===== ずかん＆せってい モーダル =====
    function openModal(m) { m.classList.remove('hidden'); }
    function closeModal(m) { m.classList.add('hidden'); }
    document.querySelectorAll('.modal-overlay').forEach(ov => {
        ov.addEventListener('click', (e) => {
            if (e.target === ov || e.target.hasAttribute('data-close')) closeModal(ov);
        });
    });

    function renderDex() {
        const stamps = getStamps();
        const streak = getStreak();
        const dayNames = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
        let row = '';
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const got = !!stamps[dateKey(d)];
            row += `<div class="stamp ${got ? 'got' : ''}"><span class="stamp-mark">${got ? '⭐' : '・'}</span><span class="stamp-day">${dayNames[d.getDay()]}</span></div>`;
        }
        const bonus = streak >= 3 ? '<div class="streak-bonus">🥚 ゴールドたまごボーナスちゅう！</div>' :
            '<div class="streak-bonus dim">3にちれんぞくでゴールドたまごに！</div>';
        streakBox.innerHTML = `<div class="streak-count">🔥 れんぞく ${streak} にち</div><div class="stamp-row">${row}</div>${bonus}`;

        dexGrid.innerHTML = DEX_ORDER.map(id => {
            const ch = CHARACTERS[id];
            const got = dex.includes(id);
            return `<div class="dex-cell ${got ? '' : 'locked'}"><div class="dex-icon">${ch.svg}</div><div class="dex-name">${got ? ch.name : '？？？'}</div></div>`;
        }).join('');
    }

    function optButtons(container, values, labels, current, onPick) {
        container.innerHTML = '';
        values.forEach((v, i) => {
            const b = document.createElement('button');
            b.className = 'opt-btn' + (v === current ? ' selected' : '');
            b.textContent = labels[i];
            b.addEventListener('click', () => { onPick(v); renderSettings(); });
            container.appendChild(b);
        });
    }
    function renderSettings() {
        optButtons(document.getElementById('optBites'),
            [10, 15, 20, 25, 30],
            ['10くち', '15くち', '20くち', '25くち', '30くち'],
            settings.maxBites,
            v => {
                settings.maxBites = v;
                saveSettings();
                progressBar.style.width = `${Math.min(currentBites / settings.maxBites, 1) * 100}%`;
                updateHeroSize();
                updateHeroStage(true);
            });
        optButtons(document.getElementById('optCooldown'),
            [5, 10, 20, 30],
            ['5びょう', '10びょう', '20びょう', '30びょう'],
            settings.cooldown,
            v => { settings.cooldown = v; saveSettings(); });
        optButtons(document.getElementById('optSound'),
            [true, false], ['ON', 'OFF'], settings.sound,
            v => { settings.sound = v; saveSettings(); if (v) play('ready'); });
        optButtons(document.getElementById('optVoice'),
            [true, false], ['ON', 'OFF'], settings.voice,
            v => { settings.voice = v; saveSettings(); if (v) speak('こえ、オンにしたよ'); });
    }

    // ===== Event Listeners =====
    btnStart.addEventListener('click', () => { ensureAudio(); toggleTimer(); });
    btnMinus.addEventListener('click', () => addTime(-5));
    btnPlus.addEventListener('click', () => addTime(5));
    btnReset.addEventListener('click', resetApp);
    btnEat.addEventListener('click', eatAction);
    btnDex.addEventListener('click', () => { renderDex(); openModal(dexModal); });
    btnSettings.addEventListener('click', () => { renderSettings(); openModal(settingsModal); });

    // ===== Initial setup =====
    updateTimerDisplay();
    updateHeroSize();
    updateHeroStage(true); // たまごからスタート
    updateClock();
    setInterval(updateClock, 200); // 実時刻の時計は常に動かす

    // モーダル内はスクロール可、それ以外はスクロール抑止（iPad向け）
    document.addEventListener('touchmove', function(e) {
        if (!e.target.closest('.modal')) e.preventDefault();
    }, { passive: false });
});
