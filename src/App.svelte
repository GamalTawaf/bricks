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

<a class="github-corner-link" href="https://github.com/GamalTawaf/bricks" target="_blank" rel="noopener" aria-label="View source on GitHub">
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
</a>

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

  .github-corner-link {
    position: fixed;
    right: 14px;
    bottom: 14px;
    color: #b5b4c0;
    opacity: 0.55;
    transition: opacity 0.15s ease;
  }

  .github-corner-link:hover {
    opacity: 1;
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
