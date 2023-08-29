import React, { useState } from 'react';
import { useAnimationFrame } from '@haensl/react-hooks';
import PropTypes from 'prop-types';
import { observer } from "@legendapp/state/react"
import Victor from 'victor';
import first from 'lodash/first';

// import { charsObservable, dropChar, addChar } from '../../../state/chars';
import { dropChar, addChar } from '../../../state/chars';
import { MOVETYPES, CHARTYPES, makeBullet, makeChar } from '../../../generators/units';
import { rndDirNudge, rndSpeedNudge, straightLineMove } from '../../../helpers/physics';
import { actOnNearestBug } from '../../../helpers/interaction';
import { GAME_SIZE } from '../../../constants/game';
import { worldXtoScreenX, worldYtoScreenY } from '../../../helpers/viewport';
import { globalStore } from '../../../state/globalStore';



export const animate = (deltaTime, viewport, store, storeName, mapParams, id) => {
  // console.log('  char.animate start')
  const char = store.interactive.dict[id].get();
  //store.interactive.dict[id].use();

  if (!char) return;
  //if (Math.random() > .95) 
  // console.log('  char.animate destructuring' )
  const { pos, representation, moves, moveType, maxAge, history, shoots, shotsPerSecond, type, lastFireTime } = char;
  // console.log('  char.animate destructuring 2' )
  const {x, y, dir, speed} = pos; 

  // Age
  // console.log('   char.age')
  if (true && maxAge && history) {
    
    if (!history.birthTime) history.birthTime = Date.now();
    if (Date.now() - history.birthTime > maxAge) {
      dropChar(storeName, id);
      // console.log('    dropChar')
      return;
    }
  }

  // console.log('   char.shoot')
  if (true && shoots) {
    if (!lastFireTime || Date.now() - lastFireTime > (1 / shotsPerSecond * 1000)) {
      actOnNearestBug(char, globalStore.interactive.dict.get(), 10_000, (target) => {
        addChar(storeName, {
          ...makeBullet(),
          pos: {
            x,
            y,
            dir: (new Victor(target.pos.x, target.pos.y)).subtract((new Victor(pos.x, pos.y))).angle() + Math.PI,
            speed: .2
          }
        })
        // lastFireTime = Date.now();
        store.interactive.dict[id].lastFireTime.set(Date.now());
      })
    } 
  }

  // console.log('   char.bullet.kill')
  if (type === CHARTYPES.BULLET)
    actOnNearestBug(char, globalStore.interactive.dict.get(), 400, (target) => {
      addChar('independent', {
        ...makeChar(),
        pos: target.pos
      });
      dropChar(storeName, target.id);
      dropChar(storeName, char.id)
      
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

  // console.log('   char.move')
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

  // console.log('   char.animate.set')
  store.interactive.dict[id].pos.set(newPosition);
}

export const Char = observer(({ id, mapParams, storeName, viewport }) => {
  const [lastFireTime, setLastFireTime] = useState(0);

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