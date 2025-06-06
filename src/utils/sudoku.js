export function generateSudoku() {
    const base = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ]
  
    const shuffle = arr => arr.sort(() => Math.random() - 0.5)
  
    const rows = shuffle([0, 1, 2, 3])
    const cols = shuffle([0, 1, 2, 3])
  
    const full = Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => base[rows[r]][cols[c]])
    )
  
    const puzzle = full.map(row => row.slice())
    let holes = Math.floor(Math.random() * 3) + 6
  
    while (holes > 0) {
      const r = Math.floor(Math.random() * 4)
      const c = Math.floor(Math.random() * 4)
      if (puzzle[r][c] !== '') {
        puzzle[r][c] = ''
        holes--
      }
    }
  
    return { puzzle, solution: full }
  }
  