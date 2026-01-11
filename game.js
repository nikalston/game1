// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio setup
let audioCtx = null;
let musicPlaying = false;
let musicGain = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        musicGain = audioCtx.createGain();
        musicGain.gain.value = 0.3;
        musicGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Sound effect: Player shoot
function playShootSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
}

// Sound effect: Alien explosion
function playExplosionSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.2);
}

// Sound effect: Player explosion (LOUD!)
function playPlayerExplosionSound() {
    if (!audioCtx) return;

    // Layer 1: Low rumble
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(80, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.8);
    gain1.gain.setValueAtTime(0.7, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.8);

    // Layer 2: Mid crunch
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
    gain2.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc2.start(audioCtx.currentTime);
    osc2.stop(audioCtx.currentTime + 0.5);

    // Layer 3: High sizzle
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);
    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc3.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
    gain3.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc3.start(audioCtx.currentTime);
    osc3.stop(audioCtx.currentTime + 0.3);

    // Layer 4: Noise burst using rapid frequency changes
    for (let i = 0; i < 5; i++) {
        const noiseOsc = audioCtx.createOscillator();
        const noiseGain = audioCtx.createGain();
        noiseOsc.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noiseOsc.type = 'square';
        noiseOsc.frequency.setValueAtTime(Math.random() * 500 + 100, audioCtx.currentTime + i * 0.05);
        noiseGain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.05);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.05 + 0.15);
        noiseOsc.start(audioCtx.currentTime + i * 0.05);
        noiseOsc.stop(audioCtx.currentTime + i * 0.05 + 0.15);
    }
}

// Sound effect: Level up
function playLevelUpSound() {
    if (!audioCtx) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.15);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.15);
    });
}

// Sound effect: Game over
function playGameOverSound() {
    if (!audioCtx) return;
    const notes = [392, 330, 262, 196];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.2 + 0.25);
        osc.start(audioCtx.currentTime + i * 0.2);
        osc.stop(audioCtx.currentTime + i * 0.2 + 0.25);
    });
}

// Background music - ominous dark bass line
let musicInterval = null;
let droneOsc = null;
let droneGain = null;
function startMusic() {
    if (!audioCtx || musicPlaying) return;
    musicPlaying = true;

    // Deep ominous bass line in E minor with tritone (Bb) for tension
    const bassLine = [41.2, 41.2, 46.25, 41.2, 55, 51.91, 41.2, 38.89];
    let noteIndex = 0;

    // Create a constant low drone for atmosphere
    droneOsc = audioCtx.createOscillator();
    droneGain = audioCtx.createGain();
    droneOsc.connect(droneGain);
    droneGain.connect(musicGain);
    droneOsc.type = 'sawtooth';
    droneOsc.frequency.value = 27.5; // Very low A0
    droneGain.gain.value = 0.15;
    droneOsc.start();

    function playNote() {
        if (!musicPlaying) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(musicGain);

        osc.type = 'sawtooth';
        osc.frequency.value = bassLine[noteIndex];

        // Slower attack and decay for more menacing feel
        gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.35);

        noteIndex = (noteIndex + 1) % bassLine.length;
    }

    playNote();
    musicInterval = setInterval(playNote, 400);
}

function stopMusic() {
    musicPlaying = false;
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
    if (droneOsc) {
        droneOsc.stop();
        droneOsc = null;
    }
}

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 5;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 7;
const ALIEN_ROWS = 5;
const ALIEN_COLS = 11;
const ALIEN_WIDTH = 40;
const ALIEN_HEIGHT = 30;
const ALIEN_PADDING = 10;
const ALIEN_START_Y = 80;
const SHIELD_COUNT = 4;

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameover'
let score = 0;
let highScore = localStorage.getItem('spaceInvadersHighScore') || 0;
let lives = 3;
let level = 1;

// Starfield for background
const stars = [];
const STAR_COUNT = 150;

function createStars() {
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
            brightness: Math.random()
        });
    }
}

function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        star.brightness += (Math.random() - 0.5) * 0.1;
        star.brightness = Math.max(0.3, Math.min(1, star.brightness));
        if (star.y > CANVAS_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * CANVAS_WIDTH;
        }
    });
}

function drawStars() {
    stars.forEach(star => {
        const alpha = star.brightness;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Initialize stars
createStars();

// Input tracking
const keys = {
    left: false,
    right: false,
    space: false
};

// Player
const player = {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - 60,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    canShoot: true,
    shootCooldown: 0
};

// Arrays for game objects
let aliens = [];
let playerBullets = [];
let alienBullets = [];
let shields = [];
let explosionParticles = [];

// Player respawn state
let playerDead = false;
let respawnTimer = 0;
const RESPAWN_DELAY = 60; // 1 second at 60fps

// Alien movement
let alienDirection = 1;
let alienSpeed = 1;
let alienMoveDown = false;
let alienShootTimer = 0;

// Create player explosion
function createPlayerExplosion(x, y) {
    const colors = ['#ff0000', '#ff6600', '#ffff00', '#ffffff', '#ff3333', '#ffaa00'];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
        const speed = 2 + Math.random() * 6;
        explosionParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 60 + Math.random() * 30,
            maxLife: 90,
            size: 3 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    // Add some debris chunks
    for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        explosionParticles.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: 80 + Math.random() * 40,
            maxLife: 120,
            size: 5 + Math.random() * 8,
            color: '#33ff33',
            isDebris: true
        });
    }
}

// Update explosion particles
function updateExplosionParticles() {
    explosionParticles = explosionParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.vx *= 0.98; // drag
        p.life--;
        return p.life > 0;
    });
}

// Draw explosion particles
function drawExplosionParticles() {
    explosionParticles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;

        if (p.isDebris) {
            // Draw debris as rectangles
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 0.6);
        } else {
            // Draw particles as circles
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.globalAlpha = 1;
}

// Initialize aliens
function createAliens() {
    aliens = [];
    const startX = (CANVAS_WIDTH - (ALIEN_COLS * (ALIEN_WIDTH + ALIEN_PADDING))) / 2;

    for (let row = 0; row < ALIEN_ROWS; row++) {
        for (let col = 0; col < ALIEN_COLS; col++) {
            aliens.push({
                x: startX + col * (ALIEN_WIDTH + ALIEN_PADDING),
                y: ALIEN_START_Y + row * (ALIEN_HEIGHT + ALIEN_PADDING) + (level - 1) * 30,
                width: ALIEN_WIDTH,
                height: ALIEN_HEIGHT,
                row: row,
                alive: true
            });
        }
    }
}

// Initialize shields
function createShields() {
    shields = [];
    const shieldWidth = 80;
    const shieldHeight = 60;
    const shieldY = CANVAS_HEIGHT - 150;
    const spacing = CANVAS_WIDTH / (SHIELD_COUNT + 1);

    for (let i = 0; i < SHIELD_COUNT; i++) {
        const shieldX = spacing * (i + 1) - shieldWidth / 2;
        const pixels = [];

        // Create pixel grid for destructible shield
        for (let py = 0; py < shieldHeight; py += 4) {
            for (let px = 0; px < shieldWidth; px += 4) {
                // Create arch shape
                const centerX = shieldWidth / 2;
                const distFromCenter = Math.abs(px - centerX);
                const archCutout = py > shieldHeight * 0.6 && distFromCenter < shieldWidth * 0.25;

                if (!archCutout) {
                    pixels.push({
                        x: px,
                        y: py,
                        alive: true
                    });
                }
            }
        }

        shields.push({
            x: shieldX,
            y: shieldY,
            width: shieldWidth,
            height: shieldHeight,
            pixels: pixels
        });
    }
}

// Draw player ship - 90s style with glow and detail
function drawPlayer() {
    if (playerDead) return; // Don't draw if dead

    const x = player.x;
    const y = player.y;
    const w = player.width;
    const h = player.height;

    // Engine glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(x + w * 0.3, y + h - 2, w * 0.15, 6 + Math.random() * 4);
    ctx.fillRect(x + w * 0.55, y + h - 2, w * 0.15, 6 + Math.random() * 4);

    // Main body glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#33ff33';

    // Main hull - darker base
    ctx.fillStyle = '#1a8c1a';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y);
    ctx.lineTo(x + w * 0.65, y + h * 0.3);
    ctx.lineTo(x + w * 0.85, y + h * 0.5);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w * 0.15, y + h * 0.5);
    ctx.lineTo(x + w * 0.35, y + h * 0.3);
    ctx.closePath();
    ctx.fill();

    // Hull highlight
    ctx.fillStyle = '#33ff33';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + 4);
    ctx.lineTo(x + w * 0.6, y + h * 0.35);
    ctx.lineTo(x + w * 0.7, y + h * 0.6);
    ctx.lineTo(x + w * 0.5, y + h * 0.8);
    ctx.lineTo(x + w * 0.3, y + h * 0.6);
    ctx.lineTo(x + w * 0.4, y + h * 0.35);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#66ffff';
    ctx.fillStyle = '#66ffff';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.5, y + h * 0.45, w * 0.1, h * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing details
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f5c0f';
    ctx.fillRect(x + 2, y + h * 0.7, w * 0.2, 4);
    ctx.fillRect(x + w * 0.78, y + h * 0.7, w * 0.2, 4);

    // Cannon tip glow
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffff00';
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(x + w * 0.47, y - 2, w * 0.06, 4);

    ctx.shadowBlur = 0;
}

// Animation frame counter for aliens
let alienAnimFrame = 0;
setInterval(() => { alienAnimFrame = (alienAnimFrame + 1) % 2; }, 500);

// Draw aliens - 90s style with animation and glow
function drawAliens() {
    aliens.forEach(alien => {
        if (!alien.alive) return;

        const x = alien.x;
        const y = alien.y;
        const w = alien.width;
        const h = alien.height;

        let mainColor, darkColor, glowColor;

        // Different colors based on row
        if (alien.row === 0) {
            mainColor = '#ff3333';
            darkColor = '#aa0000';
            glowColor = '#ff6666';
        } else if (alien.row < 3) {
            mainColor = '#ffff33';
            darkColor = '#aaaa00';
            glowColor = '#ffff88';
        } else {
            mainColor = '#33ffff';
            darkColor = '#00aaaa';
            glowColor = '#88ffff';
        }

        // Glow effect
        ctx.shadowBlur = 12;
        ctx.shadowColor = glowColor;

        if (alien.row === 0) {
            // Top row - squid type
            ctx.fillStyle = darkColor;
            ctx.beginPath();
            ctx.ellipse(x + w * 0.5, y + h * 0.35, w * 0.35, h * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = mainColor;
            ctx.beginPath();
            ctx.ellipse(x + w * 0.5, y + h * 0.3, w * 0.25, h * 0.22, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tentacles animated
            const tentacleOffset = alienAnimFrame === 0 ? 0 : h * 0.08;
            ctx.fillStyle = mainColor;
            ctx.fillRect(x + w * 0.15, y + h * 0.5 + tentacleOffset, w * 0.12, h * 0.4 - tentacleOffset);
            ctx.fillRect(x + w * 0.35, y + h * 0.55, w * 0.1, h * 0.4);
            ctx.fillRect(x + w * 0.55, y + h * 0.55, w * 0.1, h * 0.4);
            ctx.fillRect(x + w * 0.73, y + h * 0.5 - tentacleOffset, w * 0.12, h * 0.4 + tentacleOffset);

            // Eyes
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(x + w * 0.38, y + h * 0.28, w * 0.08, h * 0.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + w * 0.62, y + h * 0.28, w * 0.08, h * 0.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(x + w * 0.38, y + h * 0.28, w * 0.04, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w * 0.62, y + h * 0.28, w * 0.04, 0, Math.PI * 2);
            ctx.fill();
        } else if (alien.row < 3) {
            // Middle rows - crab type
            ctx.fillStyle = darkColor;
            ctx.fillRect(x + w * 0.2, y + h * 0.15, w * 0.6, h * 0.5);

            ctx.fillStyle = mainColor;
            ctx.fillRect(x + w * 0.25, y + h * 0.2, w * 0.5, h * 0.35);

            // Claws animated
            const clawAngle = alienAnimFrame === 0 ? 0.2 : -0.2;
            ctx.save();
            ctx.translate(x + w * 0.15, y + h * 0.4);
            ctx.rotate(clawAngle);
            ctx.fillRect(-w * 0.15, -h * 0.1, w * 0.2, h * 0.2);
            ctx.restore();
            ctx.save();
            ctx.translate(x + w * 0.85, y + h * 0.4);
            ctx.rotate(-clawAngle);
            ctx.fillRect(-w * 0.05, -h * 0.1, w * 0.2, h * 0.2);
            ctx.restore();

            // Legs
            ctx.fillRect(x + w * 0.25, y + h * 0.6, w * 0.12, h * 0.35);
            ctx.fillRect(x + w * 0.44, y + h * 0.65, w * 0.12, h * 0.3);
            ctx.fillRect(x + w * 0.63, y + h * 0.6, w * 0.12, h * 0.35);

            // Eyes
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + w * 0.32, y + h * 0.25, w * 0.12, h * 0.15);
            ctx.fillRect(x + w * 0.56, y + h * 0.25, w * 0.12, h * 0.15);
            ctx.fillStyle = '#000';
            ctx.shadowBlur = 0;
            ctx.fillRect(x + w * 0.35, y + h * 0.28, w * 0.06, h * 0.09);
            ctx.fillRect(x + w * 0.59, y + h * 0.28, w * 0.06, h * 0.09);
        } else {
            // Bottom rows - octopus type
            ctx.fillStyle = darkColor;
            ctx.beginPath();
            ctx.arc(x + w * 0.5, y + h * 0.4, w * 0.4, 0, Math.PI, true);
            ctx.fill();

            ctx.fillStyle = mainColor;
            ctx.beginPath();
            ctx.arc(x + w * 0.5, y + h * 0.35, w * 0.32, 0, Math.PI, true);
            ctx.fill();

            // Dome top
            ctx.beginPath();
            ctx.ellipse(x + w * 0.5, y + h * 0.25, w * 0.28, h * 0.2, 0, Math.PI, Math.PI * 2);
            ctx.fill();

            // Tentacles animated wave
            const wave = alienAnimFrame === 0 ? 1 : -1;
            for (let i = 0; i < 4; i++) {
                const tx = x + w * (0.2 + i * 0.2);
                const offset = (i % 2 === 0 ? wave : -wave) * h * 0.05;
                ctx.fillRect(tx, y + h * 0.5 + offset, w * 0.1, h * 0.45);
            }

            // Eyes
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x + w * 0.35, y + h * 0.3, w * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w * 0.65, y + h * 0.3, w * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(x + w * 0.35, y + h * 0.32, w * 0.05, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w * 0.65, y + h * 0.32, w * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.shadowBlur = 0;
    });
}

// Draw shields with glow
function drawShields() {
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#33ff33';
    ctx.fillStyle = '#33ff33';
    shields.forEach(shield => {
        shield.pixels.forEach(pixel => {
            if (pixel.alive) {
                ctx.fillRect(shield.x + pixel.x, shield.y + pixel.y, 4, 4);
            }
        });
    });
    ctx.shadowBlur = 0;
}

// Draw bullets with glow effects
function drawBullets() {
    // Player bullets - bright cyan/white laser
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    playerBullets.forEach(bullet => {
        // Outer glow
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(bullet.x - 1, bullet.y, BULLET_WIDTH + 2, BULLET_HEIGHT);
        // Inner bright core
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });

    // Alien bullets - menacing red/orange
    ctx.shadowColor = '#ff3300';
    alienBullets.forEach(bullet => {
        // Outer glow
        ctx.fillStyle = '#ff3300';
        ctx.fillRect(bullet.x - 1, bullet.y, BULLET_WIDTH + 2, BULLET_HEIGHT);
        // Inner core
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
    ctx.shadowBlur = 0;
}

// Draw UI with glow
function drawUI() {
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#33ff33';
    ctx.fillStyle = '#33ff33';
    ctx.font = 'bold 20px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 20, 30);
    ctx.fillText(`HIGH: ${highScore}`, 20, 55);

    ctx.textAlign = 'right';
    ctx.fillText(`LIVES: ${lives}`, CANVAS_WIDTH - 20, 30);
    ctx.fillText(`LEVEL: ${level}`, CANVAS_WIDTH - 20, 55);

    // Draw lives as mini ships with glow
    ctx.shadowBlur = 6;
    for (let i = 0; i < lives - 1; i++) {
        const lx = CANVAS_WIDTH - 100 - i * 35;
        ctx.beginPath();
        ctx.moveTo(lx + 12, 35);
        ctx.lineTo(lx + 20, 45);
        ctx.lineTo(lx + 25, 55);
        ctx.lineTo(lx, 55);
        ctx.lineTo(lx + 5, 45);
        ctx.closePath();
        ctx.fill();
    }
    ctx.shadowBlur = 0;
}

// Draw start screen with 90s style
function drawStartScreen() {
    // Title with heavy glow
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#33ff33';
    ctx.fillStyle = '#33ff33';
    ctx.font = 'bold 52px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('SPACE INVADERS', CANVAS_WIDTH / 2, 200);

    // Subtitle
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 24px Courier New';
    ctx.fillText('Press ENTER to Start', CANVAS_WIDTH / 2, 300);

    // Pulsing effect on start text
    const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
    ctx.globalAlpha = pulse;
    ctx.fillText('Press ENTER to Start', CANVAS_WIDTH / 2, 300);
    ctx.globalAlpha = 1;

    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';
    ctx.font = '18px Courier New';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Controls:', CANVAS_WIDTH / 2, 380);
    ctx.fillText('← → Arrow Keys to Move', CANVAS_WIDTH / 2, 410);
    ctx.fillText('SPACE to Shoot', CANVAS_WIDTH / 2, 440);

    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffff33';
    ctx.fillStyle = '#ffff33';
    ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH / 2, 500);
    ctx.shadowBlur = 0;
}

// Draw game over screen with 90s style
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Game over text with red glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#ff0000';
    ctx.fillStyle = '#ff3333';
    ctx.font = 'bold 52px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 250);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Courier New';
    ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, 320);

    if (score >= highScore) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffff00';
        ctx.fillStyle = '#ffff33';
        ctx.font = 'bold 28px Courier New';
        ctx.fillText('★ NEW HIGH SCORE! ★', CANVAS_WIDTH / 2, 365);
    }

    ctx.shadowBlur = 12;
    ctx.shadowColor = '#33ff33';
    ctx.fillStyle = '#33ff33';
    ctx.font = '24px Courier New';

    // Pulsing restart text
    const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
    ctx.globalAlpha = pulse;
    ctx.fillText('Press ENTER to Restart', CANVAS_WIDTH / 2, 420);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}

// Update player
function updatePlayer() {
    // Handle respawn timer
    if (playerDead) {
        respawnTimer--;
        if (respawnTimer <= 0) {
            playerDead = false;
            player.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
        }
        return; // Don't process input while dead
    }

    if (keys.left && player.x > 0) {
        player.x -= PLAYER_SPEED;
    }
    if (keys.right && player.x < CANVAS_WIDTH - player.width) {
        player.x += PLAYER_SPEED;
    }

    // Shooting cooldown
    if (player.shootCooldown > 0) {
        player.shootCooldown--;
    } else {
        player.canShoot = true;
    }

    // Shoot
    if (keys.space && player.canShoot) {
        playerBullets.push({
            x: player.x + player.width / 2 - BULLET_WIDTH / 2,
            y: player.y
        });
        player.canShoot = false;
        player.shootCooldown = 15;
        playShootSound();
    }
}

// Update aliens
function updateAliens() {
    if (aliens.filter(a => a.alive).length === 0) {
        // Level complete
        level++;
        alienSpeed = 1 + level * 0.5;
        createAliens();
        createShields();
        playLevelUpSound();
        return;
    }

    // Find boundaries
    let leftMost = CANVAS_WIDTH;
    let rightMost = 0;
    let bottomMost = 0;

    aliens.forEach(alien => {
        if (alien.alive) {
            if (alien.x < leftMost) leftMost = alien.x;
            if (alien.x + alien.width > rightMost) rightMost = alien.x + alien.width;
            if (alien.y + alien.height > bottomMost) bottomMost = alien.y + alien.height;
        }
    });

    // Check if aliens reached player level
    if (bottomMost >= player.y) {
        createPlayerExplosion(player.x + player.width / 2, player.y + player.height / 2);
        playPlayerExplosionSound();
        gameOver();
        return;
    }

    // Move aliens
    if (alienMoveDown) {
        aliens.forEach(alien => {
            if (alien.alive) {
                alien.y += 20;
            }
        });
        alienMoveDown = false;
        alienDirection *= -1;
    } else {
        let hitEdge = false;

        aliens.forEach(alien => {
            if (alien.alive) {
                alien.x += alienSpeed * alienDirection;

                if (alien.x <= 0 || alien.x + alien.width >= CANVAS_WIDTH) {
                    hitEdge = true;
                }
            }
        });

        if (hitEdge) {
            alienMoveDown = true;
        }
    }

    // Alien shooting
    alienShootTimer++;
    if (alienShootTimer > 60 - level * 5) {
        alienShootTimer = 0;

        // Get bottom-most aliens in each column
        const bottomAliens = [];
        for (let col = 0; col < ALIEN_COLS; col++) {
            for (let row = ALIEN_ROWS - 1; row >= 0; row--) {
                const alien = aliens[row * ALIEN_COLS + col];
                if (alien && alien.alive) {
                    bottomAliens.push(alien);
                    break;
                }
            }
        }

        // Random alien shoots
        if (bottomAliens.length > 0) {
            const shooter = bottomAliens[Math.floor(Math.random() * bottomAliens.length)];
            alienBullets.push({
                x: shooter.x + shooter.width / 2 - BULLET_WIDTH / 2,
                y: shooter.y + shooter.height
            });
        }
    }
}

// Update bullets
function updateBullets() {
    // Player bullets
    playerBullets = playerBullets.filter(bullet => {
        bullet.y -= BULLET_SPEED;
        return bullet.y > -BULLET_HEIGHT;
    });

    // Alien bullets
    alienBullets = alienBullets.filter(bullet => {
        bullet.y += BULLET_SPEED - 2;
        return bullet.y < CANVAS_HEIGHT;
    });
}

// Check collisions
function checkCollisions() {
    // Player bullets vs aliens
    playerBullets.forEach((bullet, bulletIndex) => {
        aliens.forEach(alien => {
            if (alien.alive && rectCollision(bullet, BULLET_WIDTH, BULLET_HEIGHT, alien, alien.width, alien.height)) {
                alien.alive = false;
                playerBullets.splice(bulletIndex, 1);
                playExplosionSound();

                // Score based on row
                if (alien.row === 0) {
                    score += 30;
                } else if (alien.row < 3) {
                    score += 20;
                } else {
                    score += 10;
                }
            }
        });
    });

    // Alien bullets vs player (only if not already dead)
    if (!playerDead) {
        alienBullets.forEach((bullet, bulletIndex) => {
            if (rectCollision(bullet, BULLET_WIDTH, BULLET_HEIGHT, player, player.width, player.height)) {
                alienBullets.splice(bulletIndex, 1);
                lives--;

                // Create explosion at player position
                createPlayerExplosion(player.x + player.width / 2, player.y + player.height / 2);
                playPlayerExplosionSound();

                if (lives <= 0) {
                    gameOver();
                } else {
                    // Start respawn timer
                    playerDead = true;
                    respawnTimer = RESPAWN_DELAY;
                }
            }
        });
    }

    // Bullets vs shields
    shields.forEach(shield => {
        // Player bullets
        playerBullets.forEach((bullet, bulletIndex) => {
            shield.pixels.forEach(pixel => {
                if (pixel.alive) {
                    const pixelX = shield.x + pixel.x;
                    const pixelY = shield.y + pixel.y;

                    if (bullet.x < pixelX + 4 && bullet.x + BULLET_WIDTH > pixelX &&
                        bullet.y < pixelY + 4 && bullet.y + BULLET_HEIGHT > pixelY) {
                        pixel.alive = false;
                        playerBullets.splice(bulletIndex, 1);
                    }
                }
            });
        });

        // Alien bullets
        alienBullets.forEach((bullet, bulletIndex) => {
            shield.pixels.forEach(pixel => {
                if (pixel.alive) {
                    const pixelX = shield.x + pixel.x;
                    const pixelY = shield.y + pixel.y;

                    if (bullet.x < pixelX + 4 && bullet.x + BULLET_WIDTH > pixelX &&
                        bullet.y < pixelY + 4 && bullet.y + BULLET_HEIGHT > pixelY) {
                        pixel.alive = false;
                        alienBullets.splice(bulletIndex, 1);
                    }
                }
            });
        });

        // Aliens vs shields
        aliens.forEach(alien => {
            if (alien.alive) {
                shield.pixels.forEach(pixel => {
                    if (pixel.alive) {
                        const pixelX = shield.x + pixel.x;
                        const pixelY = shield.y + pixel.y;

                        if (alien.x < pixelX + 4 && alien.x + alien.width > pixelX &&
                            alien.y < pixelY + 4 && alien.y + alien.height > pixelY) {
                            pixel.alive = false;
                        }
                    }
                });
            }
        });
    });
}

// Rectangle collision helper
function rectCollision(obj1, w1, h1, obj2, w2, h2) {
    return obj1.x < obj2.x + w2 &&
           obj1.x + w1 > obj2.x &&
           obj1.y < obj2.y + h2 &&
           obj1.y + h1 > obj2.y;
}

// Game over
function gameOver() {
    gameState = 'gameover';
    stopMusic();
    playGameOverSound();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('spaceInvadersHighScore', highScore);
    }
}

// Reset game
function resetGame() {
    initAudio();

    score = 0;
    lives = 3;
    level = 1;
    alienSpeed = 1;
    alienDirection = 1;
    alienMoveDown = false;
    alienShootTimer = 0;

    player.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    player.canShoot = true;
    player.shootCooldown = 0;

    playerBullets = [];
    alienBullets = [];
    explosionParticles = [];
    playerDead = false;
    respawnTimer = 0;

    createAliens();
    createShields();

    gameState = 'playing';
    startMusic();
}

// CRT scanline effect overlay
function drawScanlines() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let y = 0; y < CANVAS_HEIGHT; y += 4) {
        ctx.fillRect(0, y, CANVAS_WIDTH, 2);
    }

    // Vignette effect - darker corners
    const gradient = ctx.createRadialGradient(
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_HEIGHT * 0.4,
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_HEIGHT * 0.8
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Main game loop
function gameLoop() {
    // Clear canvas with dark blue gradient for space feel
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#000011');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Always update and draw stars
    updateStars();
    drawStars();

    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        updatePlayer();
        updateAliens();
        updateBullets();
        checkCollisions();
        updateExplosionParticles();

        drawShields();
        drawAliens();
        drawPlayer();
        drawBullets();
        drawExplosionParticles();
        drawUI();
    } else if (gameState === 'gameover') {
        updateExplosionParticles();

        drawShields();
        drawAliens();
        drawPlayer();
        drawBullets();
        drawExplosionParticles();
        drawUI();
        drawGameOver();
    }

    // Draw CRT scanline effect
    drawScanlines();

    requestAnimationFrame(gameLoop);
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
    }
    if (e.key === ' ') {
        e.preventDefault();
        keys.space = true;
    }
    if (e.key === 'Enter') {
        if (gameState === 'start' || gameState === 'gameover') {
            resetGame();
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
    }
    if (e.key === ' ') {
        keys.space = false;
    }
});

// Start the game
gameLoop();
