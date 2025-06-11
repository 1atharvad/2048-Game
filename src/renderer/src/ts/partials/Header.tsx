import { Link, type CustomLink } from "../components/Link";
import '../../scss/global/global-header.scss';

export const Header = ({content}: {content: {[key: string]: any}}) => {
  const logo = content.header.logo;
  const baseUrl = window.isElectronApp ? '' : '/';

  return (
    <header className="app-header">
      <div className="mobile-header">
        <div className="header-logo">
          <Link className="header-logo-link" link={logo.link}>
            <div className="header-logo-container">
              <img className="logo-image" src={`${baseUrl}${logo.image.url}`} alt={logo.image.alt_text} />
              <span className="logo-name">{logo.name}</span>
            </div>
          </Link>
        </div>
        {content.header.cta_links && <div className="header-cta modal-wrapper">
          <button className="solid-btn modal-btn hamburger-btn" title="Menu Button"
              data-modal-id="hamburger-menu">
            <ul className="hamburger-menu">
              {Array.from({ length: 3 }).map((_, row) => (
                <li key={row} className={`line line-${row}`}></li>
              ))}
            </ul>
          </button>
          <div className="menu-modal page-modal hide-modal" role="modal" aria-modal="true"
              aria-hidden="true" data-id="hamburger-menu">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="title">{content.header.modal_title}</h3>
                <button className="reverse-solid-btn close-btn" title="Close Button">
                  <svg role="presentation" aria-hidden="true" className="close-logo">
                    <use xlinkHref={`${baseUrl}images/icons.svg#close`}></use>
                  </svg>  
                </button>
              </div>
              <div className="btn-container">
                {content.header.cta_links.map((link: CustomLink, index: number) => (
                  <Link key={index} className="header-cta-link js-button" link={link}>
                    <span className="btn-text">{link.text}</span>
                    <svg role="presentation" aria-hidden="true" className="arrow-right">
                      <use xlinkHref={`${baseUrl}images/icons.svg#chevron-up`}></use>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>}
      </div>
      <div className="desktop-header">
        <div className="header-logo">
          <Link className="header-logo-link" link={logo.link}>
            <div className="header-logo-container">
              <img className="logo-image" src={`${baseUrl}${logo.image.url}`} alt={logo.image.alt_text} />
              <span className="logo-name">{logo.name}</span>
            </div>
          </Link>
        </div>
        <div className="header-cta">
          {content.header.cta_links && content.header.cta_links.map((link: CustomLink, index: number) => (
            <Link key={index} className="header-cta-link js-button" link={link}>
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}