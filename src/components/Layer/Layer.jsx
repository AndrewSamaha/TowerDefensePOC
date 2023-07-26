import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Char } from './Char/Char';
import { useCharStore } from '../../state/chars';
import { makeBug } from '../../generators/units';
import { useAnimationFrame } from '@haensl/react-hooks';
import { update } from 'lodash';
const layerPadding = 10;

export const Layer = ({ zIndex=0, clickable, mapParams }) => {

  const { chars, addChar } = useCharStore((state) => state);
  const [, updateLayerState] = useState();
  if (clickable) 1;

  const charMapParams = {
    width: mapParams.width - layerPadding * 2,
    height: mapParams.height - layerPadding * 2
  }
  useEffect(() => {
    if (Object.entries(chars).filter(([id, char]) => char.representation === 'A').length < 2) {
      addChar(makeBug());
    }
  }, [Object.keys(chars).length, addChar])
  console.log('layer render')
  console.log('chars=', {chars})
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
        Object.entries(chars).map(([key, char]) => {
          console.log(`creating char ${key}`)
          return (
          <Char
            key={`${char.id}`}
            charData={char}
            mapParams={charMapParams}
            updateLayerState={updateLayerState}
            
          />
        )})
    }
    </div>
  )
};

Layer.propTypes = {
  zIndex: PropTypes.number.isRequired,
  clickable: PropTypes.bool.isRequired,
  mapParams: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
}