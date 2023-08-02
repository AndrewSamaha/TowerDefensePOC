import { observable } from "@legendapp/state"
import { makeBug, makeTower } from '../generators/units';
import omit from "lodash/omit";

const createInitialGameState = (entityArray) => {

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
        dict: chars,
        idArray: Object.keys(chars)
    };
}

/**
 * Converts an array of objects into an store. A store is an obj that is ready to be maintained
 * as state.
 * @param {object} entityArray - An array of objects, each containg at least an id field
 * @param {string} storeName - the name of the objectStore
 * @return {object} Contains 
 */
export const createObjectStore = (entityArray, storeName = 'UnnamedStore') => {
    const store = entityArray.reduce((acc, cur) => {
        if (!cur.id) return acc;
        const id = cur;
        acc.dict[id] = cur;
        acc.idArray.push(id);
    }, {
        name: storeName,
        dict: {},
        idArray: []
    })
    return store;
}

export const addToStore = (store, entity) => {
    store.idArray.set([...store.idArray.get(), entity.id]);
    const newDict = {...store.dict.get(), [entity.id]: entity};
    store.dict.set(newDict);
}

export const removeFromStore = (store, entityOrId) => {
    let id = -1;
    if (typeof entityOrId === 'object' && entityOrId.id) id = entityOrId.id;
    else if (Number.isInteger(entityOrId)) id = entityOrId;
    else throw(`Unable to remove from store ${store.name}`);
    store.idArray.set(store.idArray.get().filter(thisId => thisId !== id))
    store.dict.set(omit(store.dict.get(), id));
}

export const makeObservable = (entityArray, storeName) => observable(createObjectStore(entityArray, storeName));
