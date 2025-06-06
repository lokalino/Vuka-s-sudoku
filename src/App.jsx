import { useState, useEffect } from 'react'
import './App.css'
import { generateSudoku } from './utils/sudoku'

export default function App() {
  const [data, setData] = useState(generateSudoku())
  const [board, setBoard] = useState(data.puzzle)
  const [solution, setSolution] = useState(data.solution)
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])
  const [victory, setVictory] = useState(false)
  const [musicOn, setMusicOn] = useState(() => {
    const saved = localStorage.getItem('musicOn')
    return saved === null ? true : saved === 'true'
  })

  const handleCellClick = (row, col) => {
    setSelected({ row, col })
  }

  const handleNumberClick = (num) => {
    if (!selected) return
    const { row, col } = selected
    if (data.puzzle[row][col] !== '') return

    const newBoard = board.map(r => [...r])
    const previous = newBoard[row][col]
    newBoard[row][col] = num
    setBoard(newBoard)
    setHistory([...history, { row, col, value: previous }])
    setSelected(null)
  }

  const resetBoard = () => {
    const next = generateSudoku()
    setData(next)
    setBoard(next.puzzle)
    setSolution(next.solution)
    setSelected(null)
    setVictory(false)
    setHistory([])
  }

  const undoMove = () => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    const newBoard = board.map(r => [...r])
    newBoard[last.row][last.col] = last.value
    setBoard(newBoard)
    setHistory(history.slice(0, -1))
    setSelected(null)
  }

  const getBlockClass = (row, col) => {
    if (row < 2 && col < 2) return 'block1'
    if (row < 2 && col >= 2) return 'block2'
    if (row >= 2 && col < 2) return 'block3'
    return 'block4'
  }

  const isValidMove = (row, col, value) => {
    for (let i = 0; i < 4; i++) {
      if (board[row][i] == value && i !== col) return false
      if (board[i][col] == value && i !== row) return false
    }
    const startRow = Math.floor(row / 2) * 2
    const startCol = Math.floor(col / 2) * 2
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const r = startRow + i
        const c = startCol + j
        if ((r !== row || c !== col) && board[r][c] == value) return false
      }
    }
    return true
  }

  const checkVictory = () => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = board[r][c]
        if (!val || !isValidMove(r, c, val)) return false
      }
    }
    return true
  }

  useEffect(() => {
    if (checkVictory()) {
      setVictory(true)
    }
  }, [board])

  useEffect(() => {
    localStorage.setItem('musicOn', musicOn)
  }, [musicOn])

  return (
    <div className="app">
      <h1>Vuka's Sudoku 🎀</h1>

      <div className="board">
        {board.map((row, r) =>
          row.map((val, c) => {
            const isError = val && !isValidMove(r, c, val)
            return (
              <div
                key={`${r}-${c}`}
                className={`cell ${getBlockClass(r, c)} ${selected?.row === r && selected?.col === c ? 'selected' : ''} ${isError ? 'error' : ''}`}
                onClick={() => handleCellClick(r, c)}
              >
                {val}
              </div>
            )
          })
        )}
      </div>

      <div className="numbers">
        {[1, 2, 3, 4].map(num => (
          <button key={num} onClick={() => handleNumberClick(num)}>{num}</button>
        ))}
      </div>

      <div className="controls">
        <button onClick={resetBoard}>Nova igra</button>
        <button onClick={undoMove}>Vrati potez</button>
        <button onClick={() => setMusicOn(!musicOn)}>
          {musicOn ? '🔇 Isključi muziku' : '🔊 Uključi muziku'}
        </button>
      </div>

      {victory && (
        <div className="fireworks">
          🎆 BRAVO! 🎆
          <button onClick={resetBoard}>Nova tabla</button>
        </div>
      )}

      {musicOn && (
        <audio autoPlay loop>
          <source src="/muzika.mp3" type="audio/mpeg" />
        </audio>
      )}
    </div>
  )
}

