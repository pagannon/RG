class GameEngine {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.restart();
    }

    restart() {
        this.isGameOver = false;
        this.level = 1;
        this.moveCount = 0;
        this.map = this.generateMap();

        let x = Math.floor(this.width / 2);
        let y = Math.floor(this.height / 2);
        // Ensure player doesn't spawn on a wall
        while (this.map[y][x] === '#') {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        }

        this.player = { x, y };

        try {
            this.monsters = this.generateMonsters();
            if (this.monsters.length === 0) {
                throw new Error('Failed to generate any monsters');
            }
        } catch (error) {
            console.error('Failed to initialize monsters:', error);
            this.monsters = [];
        }
    }

    createMonsterPositionMap() {
        return new Map(
            this.monsters.map(m => [`${m.x},${m.y}`, true])
        );
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

    generateMonsters(numMonsters = 5) {
        const monsters = [];
        for (let i = 0; i < numMonsters; i++) { // Generate 5 monsters
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
        const monsterPositions = this.createMonsterPositionMap();
        for (let y = 0; y < this.height; y++) {
            let row = '';
            for (let x = 0; x < this.width; x++) {
                if (this.player.x === x && this.player.y === y) {
                    row += '@';
                } else if (monsterPositions.has(`${x},${y}`)) {
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
        else {
            console.log('Cannot move there!');
        }
    }

    isValidMove(x, y, ignoreMonster = null) {
        const positionOccupied = this.monsters.some(monster => 
            monster !== ignoreMonster && 
            monster.x === x && 
            monster.y === y
        );
        
        return x >= 0 && 
            x < this.width && 
            y >= 0 && 
            y < this.height && 
            this.map[y][x] === '.' && 
            !positionOccupied;
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

            if (this.isValidMove(newX, newY, monster)) {
                monster.x = newX;
                monster.y = newY;
            }
        }

        this.checkCollision();
    }

    checkCollision() {
        for (const monster of this.monsters) {
            if (monster.x === this.player.x && monster.y === this.player.y) {
                this.gameOver();
                return true;
            }
        }
    }

    gameOver() {
        console.clear();
        console.log('Game Over! You were killed by a monster.');
        console.log('Press R to restart or Q to quit');
        this.isGameOver = true;
    }

    handleInput(input) {
        if (this.isGameOver) {
            if (input.toLowerCase() === 'r') {
                this.restart();
            } else if (input.toLowerCase() === 'q') {
                process.exit();
            }
            return;
        }

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
        this.moveCount++;
        if (this.moveCount % 20 === 0) {
            this.level++;
            const additionalMonsters = Math.min(this.level, 3);
            this.monsters.push(...this.generateMonsters(additionalMonsters));
            console.log(`Level ${this.level}! More monsters appeared!`);
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
    console.clear();
    game.handleInput(key);
    game.drawMap();
});