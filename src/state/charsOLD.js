import { create } from 'zustand';
import { makeBug, makeTower } from '../generators/units';

export const useCharStoreOld = create((set) => ({
    chars: [],
    addChar: (char) => set((state) => ({ chars: state.chars.concat([char])})),
    removeChar: (id) => set((state) => {
        const matches = state.chars.filter(char => char.id === id);
        if (!matches || !matches.length) ({ chars: state.chars });
        const char = matches[0];
        console.log(`removing ${char.representation} ${id}`)
        return ({ chars: state.chars.filter(char => char.id !== id)})
    }),
    mutateChar: (passedChar) => set((state) => {
        
        const { id: passedId } = passedChar;
        const matchingIndex = state.chars.findIndex(char => char.id === passedId);
        //console.log(`mutate idx ${matchingIndex} -- char ${passedChar.representation} ${passedChar.id}`)
        if (matchingIndex < 0) {
            console.log(`  INDEX NOT FOUND!`)
            return ({ chars: state.chars });
        }
        state.chars[matchingIndex] = passedChar;
        return ({ chars: state.chars });
    })
}));

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
    return chars;
}
export const useCharStore = create((set) => ({
    chars: createInitialGameState(),
    addChar: (char) => set((state) => {
        state.chars[`${char.id}`] = char;
        return state
    }),
    removeChar: (id) => set((state) => {
        delete state.chars[`${id}`]
        return state;
    }),
    removeDead: () => set((state) => {
        return state;
        // not finished!
        const newChars = Object.entries(state.chars).filter(([key, char]) => !char.remove)
    })
}));
