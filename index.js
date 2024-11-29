class GameEngine {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.map = this.generateMap();
        this.player = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
        this.monsters = this.generateMonsters();
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

    generateMonsters() {
        const monsters = [];
        for (let i = 0; i < 5; i++) { // Generate 5 monsters
            let x, y;
            let attempts = 0;
            do {
                x = Math.floor(Math.random() * this.width);
                y = Math.floor(Math.random() * this.height);
                attempts++;
            } while (this.map[y][x] === '#' || (x === this.player.x && y === this.player.y));

            if (attempts === 100) {
                console.warn('Could not place all monsters due to limited space.');
                break;
            }

            monsters.push({ x, y });
        }
        return monsters;
    }

    drawMap() {
        for (let y = 0; y < this.height; y++) {
            let row = '';
            for (let x = 0; x < this.width; x++) {
                if (this.player.x === x && this.player.y === y) {
                    row += '@';
                } else if (this.monsters.some(monster => monster.x === x && monster.y === y)) {
                    row += 'M';
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
            this.checkCollision();
        }
    }

    moveMonsters() {
        for (const monster of this.monsters) {
            const direction = Math.floor(Math.random() * 4);
            let dx = 0, dy = 0;
            switch (direction) {
                case 0: dy = -1; break; // Up
                case 1: dy = 1; break;  // Down
                case 2: dx = -1; break; // Left
                case 3: dx = 1; break;  // Right
            }
            const newX = monster.x + dx;
            const newY = monster.y + dy;
            const positionOccupied = this.monsters.some(otherMonster => 
                otherMonster !== monster && 
                otherMonster.x === newX && 
                otherMonster.y === newY
            );

            if (newX >= 0 && 
                newX < this.width && 
                newY >= 0 && 
                newY < this.height && 
                this.map[newY][newX] === '.' && 
                !positionOccupied
            ) {
                monster.x = newX;
                monster.y = newY;
            }
        }
        this.checkCollision();
    }

    checkCollision() {
        for (const monster of this.monsters) {
            if (monster.x === this.player.x && monster.y === this.player.y) {
                console.log('Game Over! You were killed by a monster.');
                process.exit();
            }
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
        this.moveMonsters();
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