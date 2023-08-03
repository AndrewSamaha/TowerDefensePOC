import React, { useEffect } from 'react';
import useInterval from 'react-useinterval';
import PropTypes from 'prop-types';
import { Char } from './Char/Char';
import { observer } from "@legendapp/state/react"
import { charsObservable, addChar } from '../../state/chars';
import { makeBug, makeTower } from '../../generators/units';
import { Explosion } from './Explosion/Explosion';

const layerPadding = 10;

export const Layer = observer(({ zIndex=0, clickable, mapParams }) => {
  const interactiveIdArray = charsObservable.interactive.idArray.get();
  const independentIdArray = charsObservable.independent.idArray.get();

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

  useInterval(() => {
    console.log(`array sizes ${charsObservable.independent.idArray.get().length}`)
  }, 1181)
  
  return (
    <div
      onMouseDown={(e) => {
        console.log(e.nativeEvent)
        addChar('interactive', {
          ...makeTower(),
          pos: {
            x: e.nativeEvent.layerX,
            y: e.nativeEvent.layerY,
            dir: Math.PI/2,
            speed: 0
          }
          });
      }}
      style={{
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