import React, { useState } from 'react';
import { useAnimationFrame } from '@haensl/react-hooks';
import PropTypes from 'prop-types';
import { observer } from "@legendapp/state/react"
import Victor from 'victor';
import first from 'lodash/first';
// import { useCharStore } from '../../../state/chars';
import { charsObservable, dropChar, addChar } from '../../../state/chars';
import { MOVETYPES, CHARTYPES, makeBullet } from '../../../generators/units';
import { rndDirNudge, rndSpeedNudge, straightLineMove, rndDir } from '../../../helpers/physics';
import { getNearestBug, actOnNearestBug } from '../../../helpers/interaction';

export const Char = observer(({id, mapParams, updateLayerState}) => {
  const [lastFireTime, setLastFireTime] = useState(0);

  const char = charsObservable.dict[id].get();
  if (!char) // handle the situation when char is null (it's been deleted)
    return (<div style={{display: 'none'}} />)

  const { pos, representation, moves, moveType, maxAge, history, shoots, shotsPerSecond, type } = char;
  const {x, y, dir, speed} = pos; 



  useAnimationFrame(deltaTime => {
    // Age
    if (true && maxAge && history) {
      if (!history.birthTime) history.birthTime = Date.now();
      if (Date.now() - history.birthTime > maxAge) {
        dropChar(id);
        return;
      }
    }

    if (true && shoots) {
      if (!lastFireTime || Date.now() - lastFireTime > (1 / shotsPerSecond * 1000)) {
        actOnNearestBug(char, charsObservable.dict.get(), 10_000, (target) => {
          addChar({
            ...makeBullet(),
            pos: {
              x,
              y,
              dir: (new Victor(target.pos.x, target.pos.y)).subtract((new Victor(pos.x, pos.y))).angle() + Math.PI,
              speed: .2
            }
          })
          setLastFireTime(Date.now())
        })
      } 
    }

    if (type === CHARTYPES.BULLET)
      actOnNearestBug(char, charsObservable.dict.get(), 400, (target) => {
        dropChar(target.id);
        dropChar(char.id)
      });

    // Movement
    if (!moves) {
      return;
    }
    
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