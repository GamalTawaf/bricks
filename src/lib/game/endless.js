import { createBrick } from './entities.js'

const BRICK_COLS = 8
const BRICK_PADDING = 6
const BRICK_HEIGHT = 20
const TOUGH_BRICK_CHANCE = 0.2

const BASE_DRIFT_SPEED = 5 // px/sec
const MAX_DRIFT_SPEED = 36
const MIN_SPAWN_INTERVAL = 5 // randomized per row so gaps vary
const MAX_SPAWN_INTERVAL = 12
const RAMP_DURATION = 150 // seconds to reach max drift speed

// 1 = brick present, 0 = gap. Picked at random per spawned row for variety.
const ROW_PATTERNS = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 0, 1, 1, 0],
  [0, 1, 1, 0, 1, 1, 0, 1],
  [1, 1, 0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
]

export function createEndlessRow(canvasWidth) {
  const brickWidth = (canvasWidth - BRICK_PADDING * (BRICK_COLS + 1)) / BRICK_COLS
  const pattern = ROW_PATTERNS[Math.floor(Math.random() * ROW_PATTERNS.length)]
  const bricks = []

  for (let col = 0; col < BRICK_COLS; col++) {
    if (!pattern[col]) continue
    const hits = Math.random() < TOUGH_BRICK_CHANCE ? 2 : 1
    const x = BRICK_PADDING + col * (brickWidth + BRICK_PADDING)
    bricks.push(createBrick(x, -BRICK_HEIGHT, brickWidth, BRICK_HEIGHT, hits))
  }

  return bricks
}

export function randomSpawnInterval() {
  return MIN_SPAWN_INTERVAL + Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL)
}

export function endlessDifficulty(elapsedSeconds) {
  const ramp = Math.min(elapsedSeconds / RAMP_DURATION, 1)
  return {
    driftSpeed: BASE_DRIFT_SPEED + ramp * (MAX_DRIFT_SPEED - BASE_DRIFT_SPEED),
  }
}
