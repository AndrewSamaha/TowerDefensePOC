import React, { useState } from 'react';
import { useAnimationFrame } from '@haensl/react-hooks';
import PropTypes from 'prop-types';
import { observer } from "@legendapp/state/react"
import Victor from 'victor';
import first from 'lodash/first';

import { worldXtoScreenX, worldYtoScreenY } from '../../../helpers/viewport';
import { globalStore } from '../../../state/globalStore';

export const Char = observer(({ id, viewport }) => {
  const char = globalStore.interactive.dict[id].get();
  globalStore.interactive.dict[id].pos.use(); //get();
  if (!char) // handle the situation when char is null (it's been deleted)
    return (<div style={{display: 'none'}} />)

  const { pos, representation, moves, moveType, maxAge, history, shoots, shotsPerSecond, type } = char;
  const {x, y, dir, speed} = pos; 

  return (
    <div 
      style={{
        zIndex: 'inherit',
        position: 'absolute',
        left: `${worldXtoScreenX(x, viewport.pos.x.peek())}px`,
        top: `${worldYtoScreenY(y, viewport.pos.y.peek())}px`,
        transform: `rotate(${dir+3.142*1.5}rad)`}}>
          {representation}
    </div>
  )
});

Char.propTypes = {
  charData: PropTypes.object,
}