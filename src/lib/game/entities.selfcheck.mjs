// ponytail: minimal runnable check for the collision math, not a full test suite.
// Run with: node src/lib/game/entities.selfcheck.mjs
import assert from 'node:assert'
import { circleRectCollision, bounceBallOffRect } from './entities.js'

const brick = { x: 100, y: 100, width: 40, height: 20 }

// Ball approaching from above -> should collide and bounce vertically.
const fromTop = { x: 120, y: 95, radius: 8, dx: 50, dy: 100 }
assert.ok(circleRectCollision(fromTop, brick), 'expected collision from above')
bounceBallOffRect(fromTop, brick)
assert.strictEqual(fromTop.dy, -100, 'vertical hit should flip dy')
assert.strictEqual(fromTop.dx, 50, 'vertical hit should leave dx unchanged')

// Ball approaching from the side -> should bounce horizontally.
const fromSide = { x: 95, y: 110, radius: 8, dx: 100, dy: 50 }
assert.ok(circleRectCollision(fromSide, brick), 'expected collision from the side')
bounceBallOffRect(fromSide, brick)
assert.strictEqual(fromSide.dx, -100, 'horizontal hit should flip dx')
assert.strictEqual(fromSide.dy, 50, 'horizontal hit should leave dy unchanged')

// Ball far away -> no collision.
const farAway = { x: 0, y: 0, radius: 8, dx: 1, dy: 1 }
assert.ok(!circleRectCollision(farAway, brick), 'expected no collision when far away')

console.log('entities.selfcheck.mjs: all checks passed')
