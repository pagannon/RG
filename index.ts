import { GameEngine } from './gameEngine.ts';
import { Renderer } from './renderer.ts';

const engine: GameEngine = new GameEngine(20, 10);
const renderer: Renderer = new Renderer();

renderer.draw(engine.getGameState());

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (key: string) => {
    let lcKey = key.toLowerCase();
    if (lcKey === '\u0003' || lcKey === 'q') { // Ctrl+C / q / Q
        process.exit();
    }

    if (engine.getGameState().isGameOver) {
        if (lcKey === 'r') {
            engine.restart();
        }
    } else {
        renderer.clear();
        engine.update(lcKey);
        let state = engine.getGameState();
                
        if (state.isGameOver) {
            renderer.showGameOver();
        } else {
            renderer.draw(engine.getGameState());
        }
    }
});