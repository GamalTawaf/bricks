export function createPaddle(canvasWidth) {
  const width = 100
  return {
    width,
    height: 14,
    x: (canvasWidth - width) / 2,
    speed: 620,
  }
}

export function createBall(canvasWidth, canvasHeight, speed) {
  return {
    x: canvasWidth / 2,
    y: canvasHeight - 60,
    radius: 8,
    dx: speed * (Math.random() < 0.5 ? -1 : 1) * 0.6,
    dy: -speed,
  }
}

export function createBrick(x, y, width, height, hits = 1) {
  return { x, y, width, height, hits, maxHits: hits, alive: true }
}

export function circleRectCollision(ball, rect) {
  const closestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width))
  const closestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height))
  const dx = ball.x - closestX
  const dy = ball.y - closestY
  return dx * dx + dy * dy < ball.radius * ball.radius
}

// Flips the ball's velocity along whichever axis it penetrated least,
// since that's the face it actually struck.
export function bounceBallOffRect(ball, rect) {
  const overlapLeft = ball.x + ball.radius - rect.x
  const overlapRight = rect.x + rect.width - (ball.x - ball.radius)
  const overlapTop = ball.y + ball.radius - rect.y
  const overlapBottom = rect.y + rect.height - (ball.y - ball.radius)
  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

  if (minOverlap === overlapTop || minOverlap === overlapBottom) {
    ball.dy *= -1
  } else {
    ball.dx *= -1
  }
}

export function rowReachedLine(bricks, lineY) {
  return bricks.some((brick) => brick.alive && brick.y + brick.height >= lineY)
}
