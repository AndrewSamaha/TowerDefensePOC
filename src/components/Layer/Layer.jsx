import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Char } from './Char/Char';
import { observer } from "@legendapp/state/react"
import { charsObservable, addChar } from '../../state/chars';
import { makeBug } from '../../generators/units';
import { Explosion } from './Explosion/Explosion';

const layerPadding = 10;

export const Layer = observer(({ zIndex=0, clickable, mapParams }) => {
  //console.log('layer render', Date.now())
  const interactive = charsObservable.interactive.idArray.use();
  const independent = charsObservable.independent.idArray.use();

  const interactiveIdArray = charsObservable.interactive.idArray.get();
  // const interactiveDict = charsObservable.interactive.dict.get();
  const independentIdArray = charsObservable.independent.idArray.get();
  // const independentDict = charsObservable.independent.dict.get();

  if (clickable) 1;

  const charMapParams = {
    width: mapParams.width - layerPadding * 2,
    height: mapParams.height - layerPadding * 2
  }
  useEffect(() => {
    if (Object.entries(charsObservable.interactive.dict.get()).filter(([id, char]) => char.representation === 'A').length < 4) {
      const A = makeBug();
      addChar('interactive', A);
    }
  }, [interactiveIdArray.length])
  
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
        {/* <Explosion pos={{
            x: 100,
            y: 100,
            dir: 0,
            speed: 100
          }}
          mapParams={mapParams}
          /> */}
          {
            independentIdArray.map((id) => {
              
              return (
                <Explosion
                  key={`independent${id}`}
                  id={id}
                  mapParams={mapParams}
                />
              )
            })
          }
          
          {
              interactiveIdArray.map((charId) => {
                return (
                <Char
                  key={`${charId}`}
                  id={charId}
                  mapParams={charMapParams}
                  storeName={'interactive'}
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