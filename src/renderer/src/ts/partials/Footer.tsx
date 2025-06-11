import '../../scss/global/global-footer.scss';

export const Footer = ({content}: {content: {[key: string]: any}}) => {
  return (
    <footer className="app-footer">
      <div className="footer">
        <p className="footer-text">{content.footer.text}</p>
      </div>
    </footer>
  );
}