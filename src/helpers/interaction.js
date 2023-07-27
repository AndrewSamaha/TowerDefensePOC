import first from 'lodash/first';
import Victor from 'victor';
import { CHARTYPES } from '../generators/units';

export const getNearestBug = (thisChar, allChars, minimumDist) => {
    const thisCharPos = new Victor(thisChar.pos.x, thisChar.pos.y);
    const target = 
        first(
            Object.entries(allChars).filter(
                ([, targetChar]) => 
                    (
                        targetChar.type === CHARTYPES.BUG &&
                        targetChar.id !== thisChar.id &&
                        (new Victor(targetChar.pos.x, targetChar.pos.y)).distanceSq(thisCharPos) <= minimumDist
                    )));
    if (target) {
        const [ , targetChar ] = target;
        return targetChar;
    }
    return null;
}

export const actOnNearestBug = (thisChar, allChars, minimumDist, callback) => {
    const target = getNearestBug(thisChar, allChars, minimumDist);
    if (target) callback(target);
}
