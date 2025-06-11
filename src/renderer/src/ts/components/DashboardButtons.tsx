import { HowToPlayModal } from "./HowToPlayModal"

export const DashboardButtons = ({
  content,
  skipModal=false,
  includeArrow=false
}: {
  content: {[key: string]: any},
  skipModal?: boolean,
  includeArrow?: boolean
}) => {
  return (
    <>
      <button className={`${includeArrow ? 'js-button reverse-' : ''}solid-btn replay-btn`}
          data-immediate-close="false">
        <svg role="presentation" aria-hidden="true" className="refresh-logo">
          <use xlinkHref='images/icons.svg#refresh-right'></use>
        </svg>
        <span className="btn-text">{content.replay_btn.value}</span>
        {includeArrow && <svg role="presentation" aria-hidden="true" className="arrow-right">
          <use xlinkHref='images/icons.svg#chevron-up'></use>
        </svg>}
      </button>
      <HowToPlayModal content={content.how_to_play_btn} skipModal={skipModal} includeArrow={includeArrow} />
      <div className="footer-offset"></div>
    </>
  )
}