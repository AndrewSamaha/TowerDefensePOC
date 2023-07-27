import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Char } from './Char/Char';
import { observer } from "@legendapp/state/react"
import { charsObservable, addChar } from '../../state/chars';
// import { useCharStore } from '../../state/chars';
import { makeBug } from '../../generators/units';
import { useAnimationFrame } from '@haensl/react-hooks';
import { update } from 'lodash';
const layerPadding = 10;

export const Layer = observer(({ zIndex=0, clickable, mapParams }) => {

  //const { chars, addChar } = useCharStore((state) => state);
  const [, updateLayerState] = useState();
  const charIdArray = charsObservable.idArray.get();
  if (clickable) 1;

  const charMapParams = {
    width: mapParams.width - layerPadding * 2,
    height: mapParams.height - layerPadding * 2
  }
  useEffect(() => {
    if (Object.entries(charsObservable.dict.get()).filter(([id, char]) => char.representation === 'A').length < 4) {
      const A = makeBug();
      addChar(A);
    }
  }, [charIdArray.length])
  
  return (
    <div style={{
      position: 'absolute',
      zIndex: zIndex,
      backgroundColor: 'black', 
      border: '2px',
      borderColor: 'black',
      boxSizing: 'border-box',
      width: `${mapParams.width}px`,
      height: `${mapParams.height}px`,
      padding: `${layerPadding}px`,
      margin: '0'
      }}>
    {
        charIdArray.map((charId) => {
          //console.log(`creating char ${charId}`)
          return (
          <Char
            key={`${charId}`}
            id={charId}
            mapParams={charMapParams}
            updateLayerState={updateLayerState}
            
          />
        )})
    }
    </div>
  )
});

Layer.propTypes = {
  zIndex: PropTypes.number.isRequired,
  clickable: PropTypes.bool.isRequired,
  mapParams: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
}