import { v4 as uuidv4 } from 'uuid';
import { rndPos } from "../helpers/physics";

export const CHARTYPES = {
    NONE: 'NONE',
    TOWER: 'TOWER',
    BUG: 'BUG',
    BULLET: 'BULLET'
}

export const MOVETYPES = {
    NONE: 0,
    STRAIGHT_LINE: 1,
    RANDOM_WALK: 2,
}

export const makeChar = () => ({
    id: uuidv4(),
    pos: rndPos(),
    moves: false,
    history: {
        remove: false
    },
    moveType: MOVETYPES.NONE,
    type: CHARTYPES.NONE
});
  
export const makeBug = () => ({
    ...makeChar(),
    representation: 'A',
    moves: true,
    maxAge: 30_000 * Math.random(),
    moveType: MOVETYPES.RANDOM_WALK,
    type: CHARTYPES.BUG
})

export const makeBullet = () => ({
    ...makeChar(),
    representation: '+',
    moves: true,
    maxAge: 1_000,
    moveType: MOVETYPES.STRAIGHT_LINE,
    type: CHARTYPES.BULLET
})

export const makeTower = () => ({
    ...makeChar(),
    representation: 'T',
    pos: {
      ...rndPos(),
      dir: Math.PI*.5
    },
    shoots: true,
    moves: false,
    shotsPerSecond: 2,
    type: CHARTYPES.TOWER
});