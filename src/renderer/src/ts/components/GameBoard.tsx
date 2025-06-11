export const GameBoard = ({boardSize}: {boardSize: number}) => {
  return (
    <div className="board-grid">
      {Array.from({ length: boardSize }).map((_, row) => (
        <ul key={row} className="grid-row">
          {Array.from({ length: boardSize }).map((_, col) => (
            <li key={col} className="grid-cell tile-0"></li>
          ))}
        </ul>
      ))}
    </div>
  )
}