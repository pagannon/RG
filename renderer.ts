export class Renderer {
    symbols: { player: string, monster: string, wall: string, empty: string };

    constructor() {
        this.symbols = {
            player: '@',
            monster: 'M',
            wall: '#',
            empty: '.'
        };
    }

    clear() {
        console.clear();
    }

    draw(gameState: GameState) {
        const { map, player, monsters, width, height } = gameState;
        const monsterPositions = new Map(
            monsters.map(m => [`${m.x},${m.y}`, true])
        );
        
        for (let y = 0; y < height; y++) {
            let row = '';
            for (let x = 0; x < width; x++) {
                if (player.x === x && player.y === y) {
                    row += this.symbols.player;
                } else if (monsterPositions.has(`${x},${y}`)) {
                    row += this.symbols.monster;
                } else {
                    row += map[y][x];
                }
            }
            console.log(row);
        }
    }

    showGameOver() {
        console.log('Game Over! You were killed by a monster.');
        console.log('Press R to restart or Q to quit');
    }

    showLevelUp(level: number) {
        console.log(`Level ${level}! More monsters appeared!`);
    }
}
