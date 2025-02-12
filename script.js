let points = 0;
let pointsPerClick = 1;
let autoPointsPerSecond = 0;

const upgrades = [
    { cost: 10, multiplier: 1.2, autoMultiplier: 1.2, name: ' Upgrade 1' },
    { cost: 50, multiplier: 2, autoMultiplier: 2, name: ' Upgrade 2' },
    { cost: 200, multiplier: 5, autoMultiplier: 5, name: ' Upgrade 3 ' },
    { cost: 1000, multiplier: 10, autoMultiplier: 10, name: ' Upgrade 4' },
    { cost: 5000, multiplier: 20, autoMultiplier: 20, name: ' Upgrade 5' },
    { cost: 10000, multiplier: 50, autoMultiplier: 50, name: ' Upgrade 6' }
];

const pointsDisplay = document.getElementById('points');
const pointsPerClickDisplay = document.getElementById('points-per-click');
const autoPointsPerSecondDisplay = document.getElementById('auto-points-per-second');
const clickButton = document.getElementById('click-button');
const upgradeButtons = document.getElementById('upgrade-buttons');

function saveGame() {
    localStorage.setItem('clickerGameSave', JSON.stringify({
        points, pointsPerClick, autoPointsPerSecond, upgrades
    }));
}

function loadGame() {
    const savedData = localStorage.getItem('clickerGameSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        points = gameData.points;
        pointsPerClick = gameData.pointsPerClick;
        autoPointsPerSecond = gameData.autoPointsPerSecond;
        gameData.upgrades.forEach((upgrade, index) => {
            upgrades[index].cost = upgrade.cost;
        });
        updateDisplay();
    }
}

function formatNumber(num) {
    if (num >= 1000000) return (num/1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num/1000).toFixed(2) + 'K';
    return Math.floor(num);
}

function updateDisplay() {
    pointsDisplay.textContent = formatNumber(points);
    pointsPerClickDisplay.textContent = formatNumber(pointsPerClick);
    autoPointsPerSecondDisplay.textContent = formatNumber(autoPointsPerSecond);
    
    upgrades.forEach((upgrade, index) => {
        if (upgradeButtons.children[index]) {
            const button = upgradeButtons.children[index];
            button.textContent = `${upgrade.name} (${formatNumber(upgrade.cost)} )`;
            button.disabled = points < upgrade.cost;
            button.className = points >= upgrade.cost ? 'upgrade-button available' : 'upgrade-button';
        }
    });
}

function generateAutoPoints() {
    if (autoPointsPerSecond > 0) {
        points += autoPointsPerSecond;
        updateDisplay();
        saveGame();
    }
}

function createFloatingText(value) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = `+${formatNumber(value)}`;
    clickButton.parentElement.appendChild(floatingText);
    
    setTimeout(() => floatingText.remove(), 1000);
}

function purchaseUpgrade(index, button) {
    const upgrade = upgrades[index];
    if (points >= upgrade.cost) {
        points -= upgrade.cost;
        pointsPerClick += upgrade.multiplier;
        autoPointsPerSecond += upgrade.autoMultiplier;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        
        button.classList.add('upgrade-animation');
        setTimeout(() => button.classList.remove('upgrade-animation'), 300);
        
        updateDisplay();
        saveGame();
    }
}

upgrades.forEach((upgrade, index) => {
    const button = document.createElement('button');
    button.className = 'upgrade-button';
    button.textContent = `${upgrade.name} (${formatNumber(upgrade.cost)} )`;
    button.addEventListener('click', () => purchaseUpgrade(index, button));
    upgradeButtons.appendChild(button);
});

clickButton.addEventListener('click', () => {
    points += pointsPerClick;
    createFloatingText(pointsPerClick);
    clickButton.classList.add('click-animation');
    setTimeout(() => clickButton.classList.remove('click-animation'), 100);
    updateDisplay();
    saveGame();
});

loadGame();
setInterval(generateAutoPoints, 1000);
setInterval(saveGame, 30000);
updateDisplay();
