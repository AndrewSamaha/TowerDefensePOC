//import { createObjectStore } from "./charsThree";
import { expect, describe, it } from 'vitest';
import { createObjectStore } from './charsThree.js';

describe('createObjectStore', () => {
    const testStore = {
        name: 'testStore',
        dict: { 
            '1': { 
                id: '1',
                name: 'objectone'
            },
            '2': { 
                id: '2',
                name: 'objecttwo'
            }
        },
        idArray: ['1','2']
    };
    const secondStore = {
        name: 'secondStore',
        dict: { 
            'three': { 
                id: 'three',
                name: 'object3'
            },
            'four': { 
                id: 'four',
                name: 'object4'
            }
        },
        idArray: ['three','four']
    };

    it('should create an object store', () => {
        const entityArray = [
            { ...testStore.dict['1'] },
            { ...testStore.dict['2'] },
        ];
        const storeName = 'testStore';
        const store = createObjectStore({}, entityArray, storeName);
        expect(store).toStrictEqual({ testStore });
    });

    it('should store things cumulatively', () => {
        const entityArray = [
            { ...secondStore.dict['three'] },
            { ...secondStore.dict['four'] }
        ];
        const storeName = 'secondStore';
        const store = createObjectStore({ testStore }, entityArray, storeName);
        expect(store).toStrictEqual({ testStore, secondStore })
    });
});
