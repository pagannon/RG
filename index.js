class GameEngine {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.map = this.generateMap();
        this.player = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
    }

    generateMap() {
        const map = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(Math.random() < 0.2 ? '#' : '.'); // 20% chance of wall
            }
            map.push(row);
        }
        return map;
    }

    drawMap() {
        for (let y = 0; y < this.height; y++) {
            let row = '';
            for (let x = 0; x < this.width; x++) {
                if (this.player.x === x && this.player.y === y) {
                    row += '@';
                } else {
                    row += this.map[y][x];
                }
            }
            console.log(row);
        }
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height && this.map[newY][newX] === '.') {
            this.player.x = newX;
            this.player.y = newY;
        }
    }

    handleInput(input) {
        switch (input) {
            case 'w':
                this.movePlayer(0, -1);
                break;
            case 's':
                this.movePlayer(0, 1);
                break;
            case 'a':
                this.movePlayer(-1, 0);
                break;
            case 'd':
                this.movePlayer(1, 0);
                break;
        }
    }
}

const game = new GameEngine(20, 10);
game.drawMap();

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (key) => {
    if (key === '\u0003') { // Ctrl+C
        process.exit();
    }
    game.handleInput(key);
    console.clear();
    game.drawMap();
});