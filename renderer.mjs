export class Renderer {
    constructor() {
        this.symbols = {
            player: '@',
            monster: 'M',
            wall: '#',
            empty: '.'
        };
        this.gameContainer = document.getElementById('game-container');
    }

    clear() {
        this.gameContainer.innerHTML = '';
    }

    draw(gameState) {
        const { map, player, monsters, width, height } = gameState;
        const monsterPositions = new Map(
            monsters.map(m => [`${m.x},${m.y}`, true])
        );

        this.clear();

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = document.createElement('div');
                if (player.x === x && player.y === y) {
                    tile.textContent = this.symbols.player;
                } else if (monsterPositions.has(`${x},${y}`)) {
                    tile.textContent = this.symbols.monster;
                } else {
                    tile.textContent = map[y][x];
                }
                this.gameContainer.appendChild(tile);
            }
        }
    }

    showGameOver() {
        const gameOverMessage = document.createElement('div');
        gameOverMessage.textContent = 'Game Over! You were killed by a monster. Press R to restart or Q to quit';
        this.gameContainer.appendChild(gameOverMessage);
    }

    showLevelUp(level) {
        const levelUpMessage = document.createElement('div');
        levelUpMessage.textContent = `Level ${level}! More monsters appeared!`;
        this.gameContainer.appendChild(levelUpMessage);
    }
}
