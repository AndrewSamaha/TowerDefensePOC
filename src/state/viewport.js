import Victor from "victor";
import { GAME_SIZE } from "../constants/game";

export const createInitialViewportState = (globalStore) => ({
    pos: {
        x: GAME_SIZE.width/2,
        y: GAME_SIZE.height/2,
        dir: 0,
        speed: 0
    },
    input: { }, // Used to track keyboard input,
    force: new Victor(0,0),
    convertKeysToForce: (now = Date.now()) => {
        let vector = Object.entries(globalStore.viewport.input.peek()).reduce((acc, [key, startTime]) => {
          if (!startTime) return acc;
          let length = now - startTime;

          // set keytime to now
          globalStore.viewport.input[key].set(now);

          // Create vector and add to accumulator
          const vector = new Victor(length, 0);
          if (key === 'KeyD') return acc.add(vector);
          if (key === 'KeyW') return acc.add(vector.rotateByDeg(270));
          if (key === 'KeyA') return acc.add(vector.rotateByDeg(180));
          if (key === 'KeyS') return acc.add(vector.rotateByDeg(90));
          
          throw(`convertKeysToForce, unknown key $(key)`)
        }, new Victor(0,0))
        if (vector.lengthSq() == 0) return;
        if (vector.lengthSq() < 10) {
          console.log('truncating vector', vector.length(), vector.lengthSq())
          vector = new Victor(0,0);
        }
        globalStore.viewport.force.set(vector);
    },
    moveViewport: (delta) => {
        const moveVector = globalStore.viewport.force.peek();
        if (moveVector.lengthSq() < 1.1) return;
        const pos = globalStore.viewport.pos.peek();
        const distance = delta / 70;
        const position = new Victor(pos.x, pos.y)
          .add(moveVector.multiply(new Victor(distance,distance)));
        globalStore.viewport.pos.x.set(position.x);
        globalStore.viewport.pos.y.set(position.y);
    }
});
