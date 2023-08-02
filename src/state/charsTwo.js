import { makeObservable, createObjectStore } from '../helpers/genericState';
import { makeBug, makeTower } from '../generators/units';
import omit from "lodash/omit";

const createInitialGameState = () => {

    console.log('creating initial game state')
    const initialState = {
        numTowers: 2,
        numBugs: 4
    }
    
    const chars = [];
    for (let i = 0; i < initialState.numBugs; i++) {
        chars.push(makeBug());
    }
    for (let i = 0; i < initialState.numTowers; i++) {
        chars.push(makeTower());
    }
    return chars;
}


export const charsObservable = makeObservable(createInitialGameState(), 'interactive');
/*
{
    interactiveThings: objectStore
    independentThings: objectStore
}
*/
export const dropChar = (id) => {
    charsObservable.idArray.set(charsObservable.idArray.get().filter(thisId => thisId !== id))
    charsObservable.dict.set(omit(charsObservable.dict.get(), id));
}

export const addChar = (char) => {
    charsObservable.idArray.set([...charsObservable.idArray.get(), char.id]);
    const newDict = {...charsObservable.dict.get(), [char.id]: char};
    charsObservable.dict.set(newDict);
}
