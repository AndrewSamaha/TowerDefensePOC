import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Char } from './Char/Char';
import { observer, Memo } from "@legendapp/state/react"
import { addChar } from '../../state/chars';
import { makeBug, makeTower } from '../../generators/units';
import { Explosion } from './Explosion/Explosion';
import { Frag } from './Explosion/Frag/Frag';
import { screenXtoWorldX, screenYtoWorldY } from '../../helpers/viewport';
import { globalStore } from '../../state/globalStore';
import { CHARTYPES } from '../../generators/units';

const layerPadding = 10;

const PEEK = false;
const getter = PEEK ? 'peek' : 'get';

// export const Layer = observer(({ viewport, zIndex=0, clickable, mapParams }) => {
export const Layer = observer(({ zIndex=0, mapParams }) => {
  globalStore.viewport.use();
  const viewport = globalStore.viewport;
  // const interactiveIdArray = charsObservable.interactive.idArray.get();
  // const independentIdArray = charsObservable.independent.idArray.get();
  const interactiveIdArray = globalStore.interactive.idArray[getter]();
  const independentIdArray = globalStore.independent.idArray[getter]();
  const independentCharArray = Object.values(globalStore.independent.dict[getter]());
  
  const charMapParams = {
    width: mapParams.width - layerPadding * 2,
    height: mapParams.height - layerPadding * 2
  }
  useEffect(() => {
    if (Object.entries(globalStore.interactive.dict.peek()).filter(([id, char]) => char.representation === 'A').length < 4) {
      const A = makeBug();
      addChar('interactive', A, globalStore);
    }
  }, [interactiveIdArray.length])
  // console.log('Layer render', Date.now())
  
  return (
    <div
      onMouseDown={(e) => {
        //console.log(e.nativeEvent)
        addChar('interactive', {
            ...makeTower(),
            pos: {
              x: screenXtoWorldX(e.nativeEvent.layerX, viewport.pos.x.peek()),
              y: screenYtoWorldY(e.nativeEvent.layerY, viewport.pos.y.peek()),
              dir: Math.PI/2,
              speed: 0
            }
          },
          globalStore);
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
          {/* {
            independentIdArray.map((id) => {
              return (
                <Explosion
                  key={`independent${id}`}
                  id={id}
                  mapParams={mapParams}
                />
              )
            })
          } */}
          {
            
            independentCharArray.map((char, idx) => {
              if (char.type === CHARTYPES.FRAG) {
                //console.log(`adding a Frag to the dom ${idx}, ${char.id}`);
                return (<Frag
                    key={`${char.id}`}
                    id={char.id}
                    mapParams={charMapParams}
                    storeName={'independent'}
                    viewport={viewport}
                  />)
              } else {
                return (  
                  <Char
                    key={`${char.id}`}
                    id={char.id}
                    mapParams={charMapParams}
                    storeName={'independent'}
                    viewport={viewport}
                  />
                
                )
              }
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
                      viewport={viewport}
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