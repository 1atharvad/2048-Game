import { useEffect, Fragment, useRef } from "react";
import { PageModal } from "../page-modal";
import parse from 'html-react-parser';

export const HowToPlayModal = ({
  content,
  skipModal=false,
  includeArrow=false
}: {
  content: {[key: string]: any},
  skipModal?: boolean,
  includeArrow?: boolean
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
    <div ref={modalRef} className="instruction-container modal-wrapper">
      <button className={`${includeArrow ? 'js-button reverse-' : ''}solid-btn modal-btn instruction-btn`}
          data-modal-id={content.modal_id} data-immediate-close="true">
        <svg role="presentation" aria-hidden="true" className="info-logo">
          <use xlinkHref='images/icons.svg#info'></use>
        </svg>
        <span className="btn-text">{content.value}</span>
        {includeArrow && <svg role="presentation" aria-hidden="true" className="arrow-right">
          <use xlinkHref='images/icons.svg#chevron-up'></use>
        </svg>}
      </button>
      {!skipModal && <div className="instruction-popup page-modal hide-modal" role="modal" aria-modal="true"
          aria-hidden="true" data-id={content.modal_id}>
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="title">{content.modal_content.title}</h3>
            <button className="solid-btn close-btn" title={content.close_btn.title}>
              <svg role="presentation" aria-hidden="true" className="close-logo">
                <use xlinkHref='images/icons.svg#close'></use>
              </svg>  
            </button>
          </div>
          <div className="description">
            {content.modal_content.description.map((modal_desc: {[key: string]: any}, index: number) => (
              <Fragment key={index}>
                <h3 className="desc-subpoint">{modal_desc.title}</h3>
                {!modal_desc.rule_detailed_info ? (
                  <ul className="desc-subpoints-list">
                    {modal_desc.description.map((subpoint: string, index: number) => (
                      <li key={index} className="subpoint-details">{subpoint}</li>
                    ))}
                  </ul>
                ) : (
                  <ol className="rule-details">
                    {modal_desc.description.map((rule: {[key: string]: any}, index: number) => (
                      <Fragment key={index}>
                        <li className="rule-heading">{rule.rule_title}</li>
                        <ul className="rule-subpoints-list">
                          {rule.rule_details.map((subpoint: string, index: number) => (
                            <li key={index} className="rule-subpoint">{parse(subpoint)}</li>
                          ))}
                        </ul>
                      </Fragment>
                    ))}
                  </ol>
                )}
              </Fragment>
            ))}
            <p className="modal-footer">{content.modal_content.footer.text}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}