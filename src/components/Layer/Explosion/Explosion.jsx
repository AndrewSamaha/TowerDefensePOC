import { observer } from "@legendapp/state/react";
import React from 'react';
import { useAnimationFrame } from '@haensl/react-hooks';
import omit from 'lodash/omit';
import compact from 'lodash/compact';
import useInterval from 'react-useinterval';
import { makeFrag } from "../../../generators/units";
import { dropChar, addChar } from '../../../state/chars';
import { straightLineMove } from '../../../helpers/physics';
import { softClamp } from '../../../helpers/math';
import { worldXtoScreenX, worldYtoScreenY } from "../../../helpers/viewport";
import { globalStore } from "../../../state/globalStore";
import { MAX_FRAGS, MIN_FRAGS } from "../../../constants/frags";

const Frag = observer(({ explosionId, fragId, mapParams }) => {
    const viewport = globalStore.viewport;
    const explosion = globalStore.independent.dict[explosionId].peek();
    const frag = explosion.frags[fragId];
    
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
        if (!frag) {
            console.log('useAnimationFrame on non-existant frag id=', fragId)
            return;
        }

        if (!frag.pos) {
            console.log(`frag but no pos: ${fragId} - ${frag}`)
            dropThisFrag();
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
    for (let x = 1; x <= Math.floor(Math.random()*MAX_FRAGS)+MIN_FRAGS; x++) {
        addChar('independent', makeFrag(pos), store);
    }
    return { id: 'justFrags' };
}

export const Explosion = observer(({ id: independentId, mapParams }) => {
    console.log(`rendering explosion ${independentId}`)
    const independentChar = independentId ? globalStore.independent.dict[independentId].peek() : {};
    const { frags, test } = independentChar;

    useInterval(() => {
        const independentChar = independentId ? globalStore.independent.dict[independentId].peek() : {};
        const { frags } = independentChar;
        if (!frags) return;
        if (frags && Object.keys(frags).length <= 0) {
            console.log(`dropping explosion ${independentId}`)
            dropChar('independent', independentId, globalStore)
        }
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
        return (<></>);
    }
    
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
