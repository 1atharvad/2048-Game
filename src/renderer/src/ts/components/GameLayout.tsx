import { useEffect, useRef } from "react";
import { GameBoard } from "./GameBoard";
import { Game2048 } from "../game-2048";
import { DashboardNav } from "./DashboardNav";

export const GameLayout = ({content}: {content: {[key: string]: any}}) => {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layoutRef.current) {
      new Game2048(layoutRef.current);
    }
  }, [])

  return (
    <section ref={layoutRef} className="game-layout">
      <div className="board-nav">
        <h1 className="game-title">{content.game_nav.title}</h1>
        <DashboardNav content={content.game_nav} footer={content.footer} />
      </div>
      <div className="game-board">
        <GameBoard boardSize={content.board_size}/>
        <div className="gameover-container">
          <h2 className="gameover-title">{content.gameover_details.title}</h2>
          <button className="play-again-btn">{content.gameover_details.play_again_button}</button>
        </div>
      </div>
      <div className="game-dashboard">
        <DashboardNav content={content.game_nav} footer={content.footer} />
        <div className="game-controller">
          {content.game_nav.arrow_btns.map((arrow_btn: {[key: string]: any}, index: number) => (
            <button className={`solid-btn arrow-btn ${arrow_btn.class_name}`}
                key={`arrow-btn-${index}`}
                data-arrow-direction={arrow_btn.direction}>
              <svg role="presentation" aria-hidden="true" className="arrow-logo">
                <use xlinkHref={'images/icons.svg#chevron-up'}/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}