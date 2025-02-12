let points = 0;
let pointsPerClick = 1;
let autoPointsPerSecond = 0;

const upgrades = [
    { cost: 10, multiplier: 1.2, autoMultiplier: 1.2 },   // Amélioration 1
    { cost: 50, multiplier: 2, autoMultiplier: 2 },      // Amélioration 2
    { cost: 200, multiplier: 5, autoMultiplier: 5 },     // Amélioration 3
    { cost: 1000, multiplier: 10, autoMultiplier: 10 },  // Amélioration 4
    { cost: 5000, multiplier: 20, autoMultiplier: 20 },
    { cost: 10000, multiplier: 50, autoMultiplier: 50 },
];

const pointsDisplay = document.getElementById('points');
const pointsPerClickDisplay = document.getElementById('points-per-click');
const autoPointsPerSecondDisplay = document.getElementById('auto-points-per-second');
const clickButton = document.getElementById('click-button');
const upgradeButtons = document.getElementById('upgrade-buttons');

clickButton.addEventListener('click', () => {
    points += pointsPerClick;
    points = Math.floor(points);
    pointsDisplay.textContent = points;
    checkUpgradeAvailability();
});

upgrades.forEach((upgrade, index) => {
    const button = document.createElement('button');
    button.textContent = `Amélioration ${index + 1} (${upgrade.cost} points)`;
    button.addEventListener('click', () => purchaseUpgrade(index, button));
    upgradeButtons.appendChild(button);
});

function purchaseUpgrade(index, button) {
    const upgrade = upgrades[index];
    if (points >= upgrade.cost) {
        points -= upgrade.cost;
        pointsPerClick += upgrade.multiplier;
        autoPointsPerSecond += upgrade.autoMultiplier;
        points = Math.floor(points);

        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        button.textContent = `Amélioration ${index + 1} (${upgrade.cost} points)`;

        // Arrondir les valeurs pour l'affichage
        pointsPerClickDisplay.textContent = Math.floor(pointsPerClick);
        autoPointsPerSecondDisplay.textContent = Math.floor(autoPointsPerSecond);
        
        checkUpgradeAvailability();
    }
}

function checkUpgradeAvailability() {
    upgrades.forEach((upgrade, index) => {
        const button = upgradeButtons.children[index];
        button.disabled = points < upgrade.cost;
    });
}

function generateAutoPoints() {
    points += autoPointsPerSecond;
    points = Math.floor(points);
    pointsDisplay.textContent = points;
    checkUpgradeAvailability();
}

setInterval(generateAutoPoints, 1000);

checkUpgradeAvailability();
