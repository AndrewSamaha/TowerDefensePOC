import { observer, useObservable, enableLegendStateReact } from "@legendapp/state/react";
import { observable } from "@legendapp/state"
import React, { useState } from 'react';
import { useAnimationFrame } from '@haensl/react-hooks';
import { v4 as uuid } from 'uuid';
import omit from 'lodash/omit';
import compact from 'lodash/compact';
import useInterval from 'react-useinterval';
import { makeChar, makeFrag } from "../../../generators/units";
import { charsObservable, dropChar, addChar } from '../../../state/chars';
import { rndSpeed, rndDir, straightLineMove } from '../../../helpers/physics';
import { softClamp } from '../../../helpers/math';
import { worldXtoScreenX, worldYtoScreenY } from "../../../helpers/viewport";
import { globalStore } from "../../../state/globalStore";

// enableLegendStateReact()

// const letters = 'aloisu.,:123oknndi';

// const makeFrag = ({ x, y }) => {
//     const id = uuid()
//     return {
//         id,
//         uuid: id,
//         representation: letters[Math.floor(letters.length * Math.random())],
//         pos: {
//             x,
//             y,
//             dir: rndDir(),
//             speed: rndSpeed(),
//             spin: rndDir()
//         },
//         maxAge: 200 * Math.random() + 1_000 * Math.random() + 3_000 * Math.random(),
//         type: 'FRAG',
//         history: {
//             remove: false
//         },
//         boop: false
//     }
// };

const dropFrag = (obs, id) => {
    //console.log(`dropFrag id=[${id}] ${JSON.stringify(obs[id].peek())}`)
    //console.log(`post omit=[${JSON.stringify(omit(obs.peek(), id))}]`)
    const numKeys = Object.keys(obs.peek()).length;
    const omitted = obs[id].peek();
    obs.set(omit(obs.peek(), id))
    const newNumKeys = Object.keys(obs.peek).length;
    console.log(`drop fragged successful, ${numKeys} -> ${newNumKeys}, uuid=${omitted.uuid}`)
};


const Frag = observer(({ explosionId, fragId, mapParams }) => {
    const viewport = globalStore.viewport;
    const explosion = globalStore.independent.dict[explosionId].peek();
    //console.log(`explosionId: ${explosionId}`)
    //console.log(`rendering frag ${fragId}`)
    //console.log(JSON.stringify(explosion))
    const frag = explosion.frags[fragId];
    //console.log(JSON.stringify(frag))
    //console.log(JSON.stringify(globalStore.independent.idArray.peek()))
    //debugger
    // const frag = explosion.frags[fragId];
    //const viewportPos = viewport.pos.use();
    //fragsObservable[id].use();

    //debugger;
    const dropThisFrag = () => {
        globalStore.independent.idArray[explosionId].frags.set(
            omit(
                globalStore.independent.idArray[explosionId].frags.peek(),
                fragId
            )
        )
    };

    const updateFrag = (newFrag) => {
        globalStore.independent.idArray[explosionId].frags[newFrag.id].set(
            newFrag
        )
    };

    useAnimationFrame(deltaTime => {
        // if (!fragsObservable[id].get()) {
        //     console.log(`bailing out of useAnimationFrame for frag ${id}`);
        //     return;}

        //const frag = fragsObservable[id].peek();

        if (!frag) {
            console.log('useAnimationFrame on non-existant frag id=', fragId)
            return;
        }

        if (!frag.pos) {
            console.log(`frag but no pos: ${fragId} - ${frag}`)
            // globalStore.independent.idArray[explosionId].frags.set(
            //     omit(
            //         globalStore.independent.idArray[explosionId].frags.peek(),
            //         fragId
            //     )
            // )
            dropThisFrag();
            //dropFrag(fragsObservable, id);
            return;
        }

        const { maxAge, history } = frag;
        const { x, y, dir, speed, spin } = frag.pos;

        if (true && maxAge && history) {
            if (!history.birthTime) history.birthTime = Date.now();
            if (Date.now() - history.birthTime > maxAge) {
                history.remove = true;
                console.log(`removing frag ${fragId} and ${Date.now()}`)
                dropThisFrag();
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

        updateFrag(newFrag)
    });

    //if (!fragsObservable[id].peek()) return (<div></div>);
    return (
        <div data={frag.type}
            style={{
                zIndex: 'inherit',
                position: 'absolute',
                left: `${worldXtoScreenX(frag.pos?.x, viewport.pos.x.peek())}px`,
                top: `${worldYtoScreenY(frag.pos?.y, viewport.pos.y.peek())}px`,
                transform: `rotate(${frag.pos?.spin + 3.142 * 1.5}rad)`,
                fontSize: '.7em'
            }}>
            {frag.representation}
        </div>
    );
})

export const createExplosion = ({ pos }, store) => {
    for (let x = 1; x <= Math.random()*4; x++) {
        addChar('independent', makeFrag(pos), store);
    }
    return { id: 'justFrags' };
}

export const Explosion = observer(({ id: independentId, mapParams }) => {
    // const viewportPos = viewport.pos.use();
    // const independentChar = independentId ? charsObservable.independent.dict[independentId].get() : {};
    console.log(`rendering explosion ${independentId}`)
    const independentChar = independentId ? globalStore.independent.dict[independentId].peek() : {};
    const { pos: initialPos, frags, test } = independentChar;

    useInterval(() => {
        //console.log('frag a')
        //fragsObservable.use();
        const independentChar = independentId ? globalStore.independent.dict[independentId].peek() : {};
        const { pos: initialPos, frags } = independentChar;
        if (!frags) return;
        if (frags && Object.keys(frags).length <= 0) {
            console.log(`dropping explosion ${independentId}`)
            dropChar('independent', independentId, globalStore)
        }
        //console.log('frag b')
    }, 1033)

    if (!independentId) {
        console.log('attempting to render with null id, bailing');
        return null;
    }
    if (!frags) {
        console.log(' explosion has no frags', test)
        return (<></>);
    }
    if (!Object.keys(frags).length) {
        // console.log('frag is empty', JSON.stringify(independentChar))
        // console.log('frags')
        // console.log(JSON.stringify(frags))
        return (<></>);
    }
    //fragsObservable.use();
    return (
        <div>
            {
                compact(Object.entries(frags).map(([key, frag]) => (
                    <Frag
                        key={`frag-${key}`}
                        id={key}
                        explosionId={independentId}
                        fragId={frag.id}
                        mapParams={mapParams}
                    />)))
            }
        </div>
    );
});
