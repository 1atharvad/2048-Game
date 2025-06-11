import { useEffect, useRef } from "react";
import { DashboardButtons } from "./DashboardButtons"
import { PageModal } from "../page-modal";

export const MenuModal = ({
  content,
  footer
}: {
  content: {[key: string]: any},
  footer: {[key: string]: any}
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current instanceof HTMLElement) {
      new PageModal(modalRef.current, () => {
        window.scroll(0, 0);
      }, () => {});
    }
  }, []);

  return (
    <div ref={modalRef} className="menu-container modal-wrapper">
      <button className="solid-btn modal-btn hamburger-btn" title="Menu Button"
          data-modal-id="game-hamburger-menu">
        <ul className="hamburger-menu">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className={`line line-${index}`}></li>
          ))}
        </ul>
      </button>
      <div className="menu-modal page-modal hide-modal" role="modal" aria-modal="true"
          aria-hidden="true" data-id="game-hamburger-menu">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="title">2048</h3>
            <button className="reverse-solid-btn close-btn" title="Close Button">
              <svg role="presentation" aria-hidden="true" className="close-logo">
                <use xlinkHref='images/icons.svg#close'></use>
              </svg>
            </button>
          </div>
          <div className="btn-container">
            <DashboardButtons content={content} skipModal={true} includeArrow={true} />
          </div>
          {footer && <div className="modal-footer">
            <p className="footer-text">{footer.text}</p>
          </div>}
        </div>
      </div>
    </div>
  )
}