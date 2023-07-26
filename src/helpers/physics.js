import Victor from "victor";
import { SPEED_LIMIT } from "../constants/physics";
import { hardClamp, softClamp } from "./math";
import { GAME_SIZE } from "../constants/game";

export const rndSpeed = () => Math.random() / 10;
export const rndDir = () => Math.random() * 6.28;
export const rndPos = () => ({
    x: GAME_SIZE.width * Math.random(),
    y: GAME_SIZE.height * Math.random()
})
export const rndSpeedNudge = (speed=0) => hardClamp(speed + (Math.random()-0.5)/10, SPEED_LIMIT);
export const rndDirNudge = (dir=0) => softClamp(dir + Math.random() - 0.5, Math.PI * 2);
export const straightLineMove = (pos, mapParams, delta) => {
    const straightLineDistance = delta * pos.speed;
    const vec = new Victor(0, straightLineDistance);
    let {x, y} = vec.rotateBy(pos.dir);
    x += pos.x;
    y += pos.y;

    if (x > mapParams.width) x = 0;
    else if (x < 0) x = mapParams.width;

    if (y > mapParams.height) y = 0;
    else if (y < 0) y = mapParams.height;
    return {
        x,
        y,
        dir: pos.dir,
        speed: pos.speed
    }
;
}