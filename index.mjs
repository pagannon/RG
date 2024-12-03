import { GameEngine } from './gameEngine.mjs';
import { Renderer } from './renderer.mjs';

const engine = new GameEngine(20, 10);
const renderer = new Renderer();

renderer.draw(engine.getGameState());

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (key) => {
    if (key === '\u0003' || key.toLowerCase() === 'q') { // Ctrl+C / q / Q
        process.exit();
    }

    if (engine.getGameState().isGameOver) {
        if (key.toLowerCase() === 'r') {
            engine.restart();
        }
    }
    else {
        renderer.clear();
        engine.update(key);
        let state = engine.getGameState();
                
        if (state.isGameOver) {
            renderer.showGameOver();
        } else {
            renderer.draw(engine.getGameState());
        }
    }
});