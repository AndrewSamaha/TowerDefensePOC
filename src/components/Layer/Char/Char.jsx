import React, { useState } from 'react';
import { useAnimationFrame } from '@haensl/react-hooks';
import PropTypes from 'prop-types';
import { observer } from "@legendapp/state/react"
// import { useCharStore } from '../../../state/chars';
import { charsObservable } from '../../../state/chars';
import { MOVETYPES, makeBullet } from '../../../generators/units';
import { rndDirNudge, rndSpeedNudge, straightLineMove, rndDir } from '../../../helpers/physics';

export const Char = observer(({id, mapParams, updateLayerState}) => {
  const char = charsObservable.dict[id].get();
  const { pos, representation, moves, moveType, maxAge, history, shoots, shotsPerSecond } = char;
  const {x, y, dir, speed} = pos; 
  const [lastFireTime, setLastFireTime] = useState(0);

  useAnimationFrame(deltaTime => {
    //console.log('boop')
    // Age
    if (true && maxAge && history) {
      if (!history.birthTime) history.birthTime = Date.now();
      if (Date.now() - history.birthTime > maxAge) {
        charsObservable.idArray.set(charsObservable.idArray.get().filter(thisId => thisId !== id));
        return;
      }
    }

    if (false && shoots) {
      if (!lastFireTime || Date.now() - lastFireTime > (1 / shotsPerSecond * 1000)) {
        console.log('boom')
        addChar({
          ...makeBullet(),
          pos: {
            x,
            y,
            dir: rndDir(),
            speed: .2
          }
        })
        setLastFireTime(Date.now())
      } 
    }

    // Movement
    if (!moves) {
      // console.log(`  -- moves == FALSE, bailing out`)
      return;
    }
    
    // console.log(`animate ${representation} ${id} ${charData.moveType}`)
    let newPosition = {
      x,
      y,
      dir,
      speed
    };

    switch (moveType) {
      case MOVETYPES.RANDOM_WALK:
        newPosition = straightLineMove({
          x,
          y,
          dir: rndDirNudge(dir), 
          speed: rndSpeedNudge(speed)
        }, mapParams, deltaTime)
        break;
      case MOVETYPES.STRAIGHT_LINE:
        newPosition = straightLineMove({
          x,
          y,
          dir, 
          speed
        }, mapParams, deltaTime)
        break;
      case MOVETYPES.NONE:
      default:
        break
    }

    charsObservable.dict[id].pos.set(newPosition);
  })

  return (
    <div style={{zIndex: 'inherit', position: 'absolute', left: `${x}px`, top: `${y}px`, transform: `rotate(${dir+3.142*1.5}rad)`}}>{representation}</div>
  )
});

Char.propTypes = {
  charData: PropTypes.object,
}