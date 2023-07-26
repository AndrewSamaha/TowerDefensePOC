import { rndPos } from "../helpers/physics";

export const MOVETYPES = {
    NONE: 0,
    STRAIGHT_LINE: 1,
    RANDOM_WALK: 2,
}

export const makeChar = () => ({
    id: crypto.randomUUID(),
    pos: rndPos(),
    moves: false,
    history: {
        remove: false
    },
    moveType: MOVETYPES.NONE
});
  
export const makeBug = () => ({
    ...makeChar(),
    representation: 'A',
    moves: true,
    maxAge: 10_000 * Math.random(),
    moveType: MOVETYPES.RANDOM_WALK
})

export const makeBullet = () => ({
    ...makeChar(),
    representation: '+',
    moves: true,
    maxAge: 1_000,
    moveType: MOVETYPES.STRAIGHT_LINE
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
    shotsPerSecond: 2
});