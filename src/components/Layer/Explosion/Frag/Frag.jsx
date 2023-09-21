import React from 'react';
import { observer } from "@legendapp/state/react";
import { worldXtoScreenX, worldYtoScreenY } from "../../../../helpers/viewport";
import { globalStore } from '../../../../state/globalStore';

export const Frag = observer(({ id }) => {
    const viewport = globalStore.viewport;
    const frag = globalStore.independent.dict[id].get();
    
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
});
