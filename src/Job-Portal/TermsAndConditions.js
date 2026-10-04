import React from 'react';
import termsDocument from './termsAndConditions.json';
import Footer from './Footer/Footer';
import useScreenSize from './SizeHook';
import Down from './img/icons8-down-button-24.png';
import Up from './img/icons8-arrow-button-24.png';

function TermsAndCondition() {
  const screenSize = useScreenSize();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  return (
    <>
      <main style={{ margin: '0 10px' }}>
        <button
          type="button"
          aria-label="Scroll to bottom"
          onClick={scrollToBottom}
          style={{ display: 'block', margin: '8px auto', border: 0, background: 'none', cursor: 'pointer' }}
        >
          <img src={Down} alt="" />
        </button>
        <div style={{ width: '93%', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {termsDocument.content}
        </div>
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={scrollToTop}
          style={{ display: 'block', margin: '8px auto', border: 0, background: 'none', cursor: 'pointer' }}
        >
          <img src={Up} alt="" />
        </button>
      </main>

      {screenSize.width <= 750 && <Footer />}
    </>
  );
}

export default TermsAndCondition;
