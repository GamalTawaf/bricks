import { createBrick } from './entities.js'

const BRICK_COLS = 8
const BRICK_PADDING = 6
const BRICK_TOP_OFFSET = 60
const BRICK_HEIGHT = 20
const BASE_ROWS = 4
const MAX_EXTRA_ROWS = 4
const BASE_BALL_SPEED = 260
const SPEED_STEP_PER_WAVE = 22

export function createClassicWave(canvasWidth, wave) {
  const rows = BASE_ROWS + Math.min(wave - 1, MAX_EXTRA_ROWS)
  const brickWidth = (canvasWidth - BRICK_PADDING * (BRICK_COLS + 1)) / BRICK_COLS
  const toughRows = Math.floor(wave / 2)
  const bricks = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      const hits = row < toughRows ? 2 : 1
      const x = BRICK_PADDING + col * (brickWidth + BRICK_PADDING)
      const y = BRICK_TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_PADDING)
      bricks.push(createBrick(x, y, brickWidth, BRICK_HEIGHT, hits))
    }
  }

  return bricks
}

export function classicBallSpeed(wave) {
  return BASE_BALL_SPEED + (wave - 1) * SPEED_STEP_PER_WAVE
}
