import omit from 'lodash/omit';
import filter from 'lodash/filter';
import { globalStore } from '../state/globalStore';
import { straightLineMove } from '../helpers/physics';
import { softClamp } from '../helpers/math';

const dropThisFrag = (fragId) => {
    // console.log(`dropping frag ${fragId}`)
    // Object.values(globalStore.independent.dict.peek()).map((frag)=> {
    //     if (frag.id == fragId) console.log(frag)
    // })

    globalStore.independent.idArray.set(
        filter(globalStore.independent.idArray.peek(), (id) => id != fragId)
    )
    // console.log('omitted')
    // console.log(omit(
    //     globalStore.independent.dict.peek(),
    //     fragId
    // ))
    globalStore.independent.dict.set(
        omit(
            globalStore.independent.dict.peek(),
            fragId
        )
    )
    // console.log('post drop:')
    // Object.values(globalStore.independent.dict.peek()).map((frag)=> {
    //     console.log(frag.id,frag)
    // })
    //debugger;
};

const updateFrag = (newFrag) => {
    // console.log('updateFrag', newFrag.id,{newFrag})
    // console.log(`idArray ${JSON.stringify(globalStore.independent.idArray.peek())}`)
    // //console.log(`dict ${JSON.stringify(globalStore.independent.dict.peek())}`)
    // Object.values(globalStore.independent.dict.peek()).map((frag)=> {
    //     if (frag.id == newFrag.id) console.log(frag)
    // })
    globalStore.independent.idArray[newFrag.id].set(
        newFrag
    )
    globalStore.independent.dict.set({
        ...globalStore.independent.dict.peek(),
        [`${newFrag.id}`]: newFrag
    })
    // console.log('postupdate:')
    // console.log(`idArray ${JSON.stringify(globalStore.independent.idArray.peek())}`)
    // //console.log(`dict ${JSON.stringify(globalStore.independent.dict.peek())}`)
    // Object.values(globalStore.independent.dict.peek()).map((frag)=> {
    //     if (frag.id == newFrag.id) console.log(frag)
    // })
    // debugger;
};

export const animate = (deltaTime, viewport, store, storeName, mapParams, fragId) => {
    const frag = store.independent.dict[fragId].get();

    if (!frag) {
        console.log('useAnimationFrame on non-existant frag id=', fragId)
        return;
    }

    if (!frag.pos) {
        console.log(`frag but no pos: ${fragId} - ${frag}`)
        dropThisFrag(fragId);
        return;
    }

    const { maxAge, history } = frag;
    const { x, y, dir, speed, spin } = frag.pos;

    if (true && maxAge && history) {
        if (!history.birthTime) history.birthTime = Date.now();
        if (Date.now() - history.birthTime > maxAge) {
            history.remove = true;
            dropThisFrag(fragId);
            return;
        }
    }
    const newPosition = straightLineMove({
        x,
        y,
        dir,
        speed
    }, mapParams, deltaTime)

    const newFrag = {
        ...frag,
        pos: {
            ...newPosition,
            spin: softClamp(spin + .1 * deltaTime, Math.PI * 2)
        },
        history,
        boop: true
    };

    updateFrag(newFrag)
};