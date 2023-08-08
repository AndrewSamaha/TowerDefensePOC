import { GAME_SIZE } from "../constants/game"
export const worldXtoScreenX = (worldX, viewportX) => (worldX - viewportX + GAME_SIZE.width/2);
export const worldYtoScreenY = (worldY, viewportY) => (worldY - viewportY + GAME_SIZE.height/2);
export const screenXtoWorldX = (screenX, viewportX) => (screenX + viewportX - GAME_SIZE.width/2);
export const screenYtoWorldY = (screenY, viewportY) => (screenY + viewportY - GAME_SIZE.height/2);
