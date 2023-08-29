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
import { globalStore } from './state/globalStore';
import { animate } from './components/Layer/Char/Char';

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
  
  useAnimationFrame((delta) => {
    //if (Math.random() > .94) console.log(`useAnimationFrame ${globalStore.interactive.idArray.peek().length} ${Date.now()}`);
    // Animate Viewport
    (() => {
      // apply friction to speed
      globalStore.viewport.pos.speed.set((speed) => Math.abs(speed) < MIN_VIEWPORT_SPEED ? 0 : speed*VIEWPORT_FRICTION);

      globalStore.viewport.convertKeysToForce(Date.now());
      if (globalStore.viewport.force.peek().lengthSq() < .01) {
        //console.log('force too small', globalStore.viewport.force.peek(), globalStore.viewport.pos.x.peek())
        return
      }
      // convert forces to translation
      globalStore.viewport.moveViewport(delta);
    })();

    // Animate Chars (units)
    globalStore.interactive.idArray.peek().map((id) => {
      //console.log(' calling char.animate')
      animate(delta, globalStore.viewport, globalStore, 'interactive', mapParams, id)
      // (deltaTime, viewport, store, storeName, mapParams, id) => {
    });
    globalStore.independent.idArray.peek().map((id) => {
      //console.log(' calling char.animate')
      animate(delta, globalStore.viewport, globalStore, 'independent', mapParams, id)
      // (deltaTime, viewport, store, storeName, mapParams, id) => {
    });
  })

  return (
    <div
      onKeyDown={e => VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(Date.now) : 0}
      onKeyUp={e => VIEWPORT_KEYS.includes(e.code) && !e.repeat ? globalStore.viewport.input[e.code].set(0) : 0}
      tabIndex={0} >
      <Layer zIndex={layer.zIndex} clickable={layer.clickable} mapParams={mapParams}/>
    </div>
  )
}

export default App
