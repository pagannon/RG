export class GameEngine {
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
        this.initializePlayer();
        this.monsters = this.generateMonsters();
    }

    initializePlayer() {
        let x = Math.floor(this.width / 2);
        let y = Math.floor(this.height / 2);
        while (this.map[y][x] === '#') {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        }
        this.player = { x, y };
    }

    generateMap() {
        const map = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(Math.random() < 0.2 ? '#' : '.');
            }
            map.push(row);
        }
        return map;
    }

    generateMonsters(numMonsters = 5) {
        const monsters = [];
        for (let i = 0; i < numMonsters; i++) {
            let x, y;
            let attempts = 0;
            do {
                x = Math.floor(Math.random() * this.width);
                y = Math.floor(Math.random() * this.height);
                attempts++;
            } while (this.map[y][x] === '#' || (x === this.player.x && y === this.player.y));

            if (attempts === 100) break;
            monsters.push({ x, y });
        }
        return monsters;
    }

    handleCollision() {
        this.isGameOver = true;
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        if (this.isValidMove(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
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
                case 0: dy = -1; break;
                case 1: dy = 1; break;
                case 2: dx = -1; break;
                case 3: dx = 1; break;
            }
            
            const newX = monster.x + dx;
            const newY = monster.y + dy;

            if (this.isValidMove(newX, newY, monster)) {
                monster.x = newX;
                monster.y = newY;

            }
        }
    }

    checkMonsterCollision() {
        return this.monsters.some(monster => 
            monster.x === this.player.x && 
            monster.y === this.player.y
        );
    }

    getGameState() {
        return {
            map: this.map,
            player: this.player,
            monsters: this.monsters,
            width: this.width,
            height: this.height,
            level: this.level,
            isGameOver: this.isGameOver,
            moveCount: this.moveCount
        };
    }

    update(input) {
        switch (input) {
            case 'w': this.movePlayer(0, -1); break;
            case 's': this.movePlayer(0, 1); break;
            case 'a': this.movePlayer(-1, 0); break;
            case 'd': this.movePlayer(1, 0); break;
        }

        if (this.checkMonsterCollision()) {
            this.isGameOver = true;
            return 'gameOver';
        }

        this.moveMonsters();

        if (this.checkMonsterCollision()) {
            this.isGameOver = true;
        }
        
        this.moveCount++;
        if (this.moveCount % 20 === 0) {
            this.level++;
            const additionalMonsters = Math.min(this.level, 3);
            this.monsters.push(...this.generateMonsters(additionalMonsters));
        }
    }
}