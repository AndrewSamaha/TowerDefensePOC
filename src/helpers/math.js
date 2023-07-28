export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export const hardClamp = (num, max) => clamp(num, -max, max);
export const softClamp = (num, max) => {
    if (num > 0 && num > max) return num-max;
    else if (num < 0 && num < -max) return num+max;
    return num;
}

export const wrap = (x, y, mapParams) => {
    let newX = x, newY = y;
    if (x > mapParams.width) newX = 0;
    else if (x < 0) newX = mapParams.width;

    if (y > mapParams.height) newY = 0;
    else if (y < 0) newY = mapParams.height;
    return { newX, newY };
}
