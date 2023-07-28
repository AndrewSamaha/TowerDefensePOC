import React from 'react';
import { observer } from "@legendapp/state/react";
import { useAnimationFrame } from '@haensl/react-hooks';
import { straightLineMove } from '../../../../helpers/physics';
import { softClamp } from '../../../../helpers/math';

export const Frag = observer(({initialPos, mapParams}) => {
    useAnimationFrame(deltaTime => {
        console.log('frag')
        const newFrags = Object.entries(frags).map(([key, frag]) => {
            const {maxAge, history} = frag;
            const {x, y, dir, speed} = frag.pos;

            if (true && maxAge && history) {
                if (!history.birthTime) history.birthTime = Date.now();
                if (Date.now() - history.birthTime > maxAge) {
                  history.remove = true;
                  return;
                }
              }
            const newPosition = straightLineMove({
                x,
                y,
                dir: softClamp(dir + 1 * deltaTime, Math.PI*2), 
                speed
            }, mapParams, deltaTime)
            return {
                ...frag,
                pos: newPosition,
                history,
                boop: true
            }
        });

});
