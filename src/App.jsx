import React, { useState, useEffect, useSelector } from 'react'
import Victor from 'victor';
import useInterval from 'react-useinterval';
import { enableReactUse } from '@legendapp/state/config/enableReactUse';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Layer } from './components/Layer/Layer'
import { rndSpeed, rndDir, rndPos } from './helpers/physics'
import { GAME_SIZE } from './constants/game'
import { makeBug, makeTower } from './generators/units'
import './App.css'
import { useObservable } from '@legendapp/state/react';
import { observable } from '@legendapp/state';
import { VIEWPORT_KEYS } from './constants/input';
import { hardClamp } from './helpers/math';
import { useAnimationFrame } from '@haensl/react-hooks';

import { createInitialViewportState } from './state/viewport';
import { createInitialGameState } from './state/chars';

const layer = {
  zIndex: 0,
  clickable: false
}

const mapParams = GAME_SIZE;
enableReactUse();
const PUSH_FORCE = 0.1;
const MAX_FORCE = 1;
const MIN_VIEWPORT_SPEED = 0.1;
const VIEWPORT_FRICTION = 0.997;
const PX_PER_MS = .250;

function App() {
  const globalStore = useObservable({
    viewport: {
      pos: {
        x: GAME_SIZE.width/2,
        y: GAME_SIZE.height/2,
        dir: 0,
        speed: 0
      },
      input: {
        //include: ['KeyW', 'KeyA', 'KeyS', 'KeyD'],
      },
      force: new Victor(0,0),
      convertKeysToForce: (now = Date.now()) => {
        let vector = Object.entries(globalStore.viewport.input.peek()).reduce((acc, [key, startTime]) => {
          if (!startTime) return acc;
          let length = now - startTime;

          // set keytime to now
          globalStore.viewport.input[key].set(now);

          // Create vector and add to accumulator
          const vector = new Victor(length, 0);
          if (key === 'KeyD') return acc.add(vector);
          if (key === 'KeyW') return acc.add(vector.rotateByDeg(270));
          if (key === 'KeyA') return acc.add(vector.rotateByDeg(180));
          if (key === 'KeyS') return acc.add(vector.rotateByDeg(90));
          
          throw(`convertKeysToForce, unknown key $(key)`)
        }, new Victor(0,0))
        if (vector.lengthSq() == 0) return;
        if (vector.lengthSq() < 10) {
          console.log('truncating vector', vector.length(), vector.lengthSq())
          vector = new Victor(0,0);
        }
        //console.log('NOT truncating victor', vector.lengthSq())
        globalStore.viewport.force.set(vector);
      },
      moveViewport: (delta) => {
        const moveVector = globalStore.viewport.force.peek();
        if (moveVector.lengthSq() < 1.1) return;
        const pos = globalStore.viewport.pos.peek();
        const distance = delta / 70;
        const position = new Victor(pos.x, pos.y)
          .add(moveVector.multiply(new Victor(distance,distance)));
        globalStore.viewport.pos.x.set(position.x);
        globalStore.viewport.pos.y.set(position.y);
      }
    },
    ...createInitialGameState()  // TODO: Refactor to gameState: createInitialGameState()
  })

  useAnimationFrame((delta) => {
    // apply friction to speed
    globalStore.viewport.pos.speed.set((speed) => Math.abs(speed) < MIN_VIEWPORT_SPEED ? 0 : speed*VIEWPORT_FRICTION);

    globalStore.viewport.convertKeysToForce(Date.now());
    if (globalStore.viewport.force.peek().lengthSq() < .01) {
      //console.log('force too small', globalStore.viewport.force.peek(), globalStore.viewport.pos.x.peek())
      return
    }
    // convert forces to translation
    globalStore.viewport.moveViewport(delta);
  })

  return (
    <div
      onKeyDown={e => VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(Date.now) : 0}
      onKeyUp={e => VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(0) : 0}
      tabIndex={0} >
      <Layer 
        viewport={globalStore.viewport} zIndex={layer.zIndex} clickable={layer.clickable} mapParams={mapParams}/>
    </div>
  )
}

export default App
