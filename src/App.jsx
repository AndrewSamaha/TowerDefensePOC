import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Layer } from './components/Layer/Layer'
import { rndSpeed, rndDir, rndPos } from './helpers/physics'
import { GAME_SIZE } from './constants/game'
import { makeBug, makeTower } from './generators/units'
import './App.css'

const layer = {
  zIndex: 0,
  clickable: false
}

const mapParams = GAME_SIZE;


function App() {
  return (
    <>
      <Layer zIndex={layer.zIndex} clickable={layer.clickable} mapParams={mapParams}/>
    </>
  )
}

export default App
