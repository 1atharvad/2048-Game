import { DashboardButtons } from "./DashboardButtons"
import { MenuModal } from "./MenuModal"

export const DashboardNav = ({
  content,
  footer
}: {
  content: {[key: string]: any},
  footer: {[key: string]: any}
}) => {
  return (
    <>
      <div className="dashboard-btns">
        <DashboardButtons content={content.nav_dashboard} />
        <MenuModal content={content.nav_dashboard} footer={footer} />
      </div>
      <ul className="score-board">
        {content.score_board.map((scoreBoardDetails: {[key: string]: any}, index: number) => (
          <li key={index} className={`score-details ${scoreBoardDetails.class_name ? scoreBoardDetails.class_name : ''}`}> 
            <h2 className="score-title">{scoreBoardDetails.title}</h2>
            <p className="score-value">{scoreBoardDetails.value}</p>
          </li>
        ))}
      </ul>
    </>
  )
}