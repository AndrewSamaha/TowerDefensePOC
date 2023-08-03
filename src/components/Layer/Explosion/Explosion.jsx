import { observer, useObservable, enableLegendStateReact } from "@legendapp/state/react";
import React, { useState } from 'react';
import { useAnimationFrame } from '@haensl/react-hooks';
import omit from 'lodash/omit';
import useInterval from 'react-useinterval';
import { charsObservable, dropChar, addChar } from '../../../state/chars';
import { rndSpeed, rndDir, straightLineMove } from '../../../helpers/physics';
import { softClamp } from '../../../helpers/math';

enableLegendStateReact()

const letters = 'aloisu.,:123oknndi';

const makeFrag = (id, {x, y}) => ({
    id,
    representation: letters[Math.floor(letters.length*Math.random())],
    pos: {
        x,
        y,
        dir: rndDir(),
        speed: rndSpeed(),
        spin: rndDir()
    },
    maxAge: 200 * Math.random() + 1_000 * Math.random() + 3_000 * Math.random(),
    type: 'FRAG',
    history: {
        remove: false
    },
    boop: false
});

const dropFrag = (observable, id) => observable.set(omit(observable[id].get(), id));


const Frag = observer(({ fragsObservable, id, mapParams }) => {

    useAnimationFrame(deltaTime => {
        if (!fragsObservable[id].get()) return;
        
        const frag = fragsObservable[id].get();

        if (!frag) {
            console.log('useAnimationFrame on non-existant frag id=', id)
            return;
        }
            
        if (id === 'id' || id === '0') {
            dropFrag(fragsObservable, id);
            return;
        }

        if (!frag.pos) {
            console.log(`frag but no pos: ${id} - ${frag}`)
            dropFrag(fragsObservable, id);
            return;
        }
    
        const {maxAge, history} = frag;
        const {x, y, dir, speed, spin} = frag.pos;

        if (true && maxAge && history) {
            if (!history.birthTime) history.birthTime = Date.now();
            if (Date.now() - history.birthTime > maxAge) {
                history.remove = true;
                dropFrag(fragsObservable, id);
            }
        }
        const newPosition = straightLineMove({
            x,
            y,
            dir,
            speed
        }, mapParams, deltaTime)

        const newFrag = {
            ...frag,
            pos: {
                ...newPosition,
                spin: softClamp(spin + .1 * deltaTime, Math.PI * 2)
            },
            history,
            boop: true
        };

        fragsObservable[id].set(newFrag)
    });
    
    if (!fragsObservable[id].get()) return (<></>);
    return (<div data={fragsObservable[id].get().type}
        style={{
            zIndex: 'inherit',
            position: 'absolute',
            left: `${fragsObservable[id].get().pos?.x}px`, top: `${fragsObservable[id].get().pos?.y}px`,
            transform: `rotate(${fragsObservable[id].get().pos?.spin+3.142*1.5}rad)`,
            fontSize: '.7em'}}>
            {fragsObservable[id].representation}
    </div>);
})

export const Explosion = ({ id: independentId, mapParams }) => {
    
    const independentChar = independentId ? charsObservable.independent.dict[independentId].get() : {};
    const {pos: initialPos} = independentChar;

    const fragsObservable = useObservable({
        a: makeFrag('a', initialPos),
        b: makeFrag('b', initialPos),
        c: makeFrag('c', initialPos),
        d: makeFrag('d', initialPos),
        e: makeFrag('e', initialPos),
        f: makeFrag('f', initialPos),
        g: makeFrag('g', initialPos),
        h: makeFrag('h', initialPos),
        i: makeFrag('i', initialPos),
    });

    useInterval(() => {
        if (Object.keys(fragsObservable.get()).length <= 0) {
            dropChar('independent', independentId)
        }
    }, 1033)

    if (!independentId) {
        console.log('attempting to render with null id, bailing');
        return null;
    }

    return (
        <div>
            {
                Object.entries(fragsObservable.get()).map(([key, frag]) => (
                    <Frag
                        key={`frag-${key}`}
                        id={key} 
                        fragsObservable={fragsObservable}
                        mapParams={mapParams}
                    />))
            }
        </div>
    );
};
