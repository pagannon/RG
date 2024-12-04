import { GameEngine } from './gameEngine.mjs';
import { Renderer } from './renderer.mjs';

const engine = new GameEngine(20, 10);
const renderer = new Renderer();

renderer.draw(engine.getGameState());

document.addEventListener('keydown', (event) => {
    let key = event.key.toLowerCase();
    if (key === 'q') {
        window.close();
    }

    if (engine.getGameState().isGameOver) {
        if (key === 'r') {
            engine.restart();
        }
    } else {
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
