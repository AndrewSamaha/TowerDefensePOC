import { observable } from "@legendapp/state"
import { makeBug, makeTower } from '../generators/units';
import omit from "lodash/omit";


export const createObjectStore = (object, entityArray, storeName = 'UnnamedStore') => {
    const store = entityArray.reduce((acc, cur) => {
        if (!cur.id) return acc;
        const id = cur.id;
        acc.dict[id] = cur;
        acc.idArray.push(id);
        return acc;
    }, {
        name: storeName,
        dict: {},
        idArray: []
    })
    return {
        ...object,
        [storeName]: store
    };
}

const createInitialGameState = () => {

    console.log('creating initial game state')
    const initialState = {
        numTowers: 2,
        numBugs: 4
    }
    
    const chars = {};
    for (let i = 0; i < initialState.numBugs; i++) {
        const A = makeBug();
        chars[A.id] = A;
    }
    for (let i = 0; i < initialState.numTowers; i++) {
        const A = makeTower();
        chars[A.id] = A;
    }
    return {
        independent: {
            dict: {},
            idArray: []
        },
        interactive: {
            dict: chars,
            idArray: Object.keys(chars)
        }
    };
}


export const charsObservable = observable(createInitialGameState());

export const dropChar = (storeName, id, thisObservable=charsObservable) => {
    thisObservable[storeName].idArray.set(
        thisObservable[storeName].idArray.get().filter(thisId => thisId !== id)
    );
    thisObservable[storeName].dict.set(
        omit(thisObservable[storeName].dict.get(), id)
    );
}

export const addChar = (storeName, char, thisObservable=charsObservable) => {
    thisObservable[storeName].idArray.set([...thisObservable[storeName].idArray.get(), char.id]);
    const newDict = {...thisObservable[storeName].dict.get(), [char.id]: char};
    thisObservable[storeName].dict.set(newDict);
}
