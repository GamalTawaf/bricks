<script>
  import Game from './Game.svelte'

  function readHighScore(mode) {
    return Number(localStorage.getItem(`bricks-highscore-${mode}`) || 0)
  }

  let screen = $state('menu') // 'menu' | 'game' | 'gameover'
  let mode = $state('classic')
  let lastScore = $state(0)
  let restartToken = $state(0)
  let highScores = $state({ classic: readHighScore('classic'), endless: readHighScore('endless') })

  function startGame(selectedMode) {
    mode = selectedMode
    restartToken += 1
    screen = 'game'
  }

  function playAgain() {
    restartToken += 1
    screen = 'game'
  }

  function backToMenu() {
    screen = 'menu'
  }

  function handleGameOver(score) {
    lastScore = score
    if (score > highScores[mode]) {
      highScores[mode] = score
      localStorage.setItem(`bricks-highscore-${mode}`, String(score))
    }
    screen = 'gameover'
  }
</script>

{#if screen === 'menu'}
  <div class="panel">
    <h1>Bricks</h1>
    <p>Break every brick. Don't let the ball — or the bricks — get past you.</p>
    <div class="mode-buttons">
      <button onclick={() => startGame('classic')}>
        Classic
        <small>High score: {highScores.classic}</small>
      </button>
      <button onclick={() => startGame('endless')}>
        Endless
        <small>High score: {highScores.endless}</small>
      </button>
    </div>
    <p class="hint">Move with your mouse, finger, or the arrow keys.</p>
    <a class="source-link" href="https://github.com/GamalTawaf/bricks" target="_blank" rel="noopener">View source on GitHub</a>
  </div>
{:else if screen === 'game'}
  {#key restartToken}
    <Game {mode} onGameOver={handleGameOver} onExit={backToMenu} />
  {/key}
{:else if screen === 'gameover'}
  <div class="panel">
    <h1>Game Over</h1>
    <p>Score: {lastScore}</p>
    <p>High score: {highScores[mode]}</p>
    <div class="mode-buttons">
      <button onclick={playAgain}>Play again</button>
      <button class="secondary" onclick={backToMenu}>Back to menu</button>
    </div>
  </div>
{/if}

<style>
  .panel {
    text-align: center;
    max-width: 420px;
  }

  h1 {
    margin: 0 0 8px;
    font-size: 40px;
  }

  p {
    margin: 0 0 20px;
    color: #b5b4c0;
  }

  .hint {
    margin-top: 20px;
    font-size: 14px;
  }

  .source-link {
    display: inline-block;
    margin-top: 12px;
    font-size: 13px;
    color: #b5b4c0;
  }

  .mode-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .mode-buttons button {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 140px;
  }

  small {
    font-size: 12px;
    opacity: 0.85;
  }
</style>
