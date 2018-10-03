'use strict';

// UTILS

function setStyles(el, propObj) {
  for (var prop in propObj) {
    el.style[prop] = propObj[prop];
  }
}

function cloneNode(targetId) {
  var cloneRef = frame.contentWindow.document.getElementById(targetId);
  chunk = document.importNode(cloneRef, true);
  chunk.setAttribute('data-currentPop', '');
}


// CONFIG

var glossary = '060.xhtml',
    html = document.documentElement,
    body = document.body,
    frame = document.createElement('iframe'),
    glossLinks = document.querySelectorAll('a[data-glossary]'),
    chunk;
// INIT

(function initGlossary() {
  frame.src = glossary;
  frame.id = 'glossary-frame';
  setStyles(frame, {'display':'none', 'border':'none', 'width':'0', 'height':'0'});
  frame.setAttribute('aria-hidden', 'true');
  body.appendChild(frame);
})();


// EVENT HANDLERS

function replaceNode(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  var el = event.target;

/* this = modal.modalElem() */
  if (el.classList.contains('internal-link')) {
    var previousNode = this.querySelector('[data-currentPop]'),
        elTarget = el.href.split('#')[1];

    cloneNode(elTarget);
    this.insertBefore(chunk, previousNode);
    this.removeChild(previousNode);
  } 
  else if (el.parentElement.classList.contains('hyperlink-webpage') || el.parentElement.classList.contains('xref')) {
    var hyperlink = el.href;
	window.location = hyperlink;
  }
};

function popModal(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
/* Long story short… YES you need those 3 in order for the event to work in various RSs */

/* this = glossLink */
  var modalPosition = this.offsetTop,
      targetRef = this.getAttribute('data-glossary'),
      maxHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

  cloneNode(targetRef);

  var modal = picoModal({
        content: chunk, 
		overlayStyles: {
          height: maxHeight+'px',
          opacity: 0.95,
          background: '#FFF'
        },
        modalStyles: {
          position: 'absolute', 
          top: modalPosition+'px',
          overflow: 'auto',
          backgroundColor: 'white',
          padding: '35px',
          borderRadius: '.313em',
          boxShadow: '.25em .563em .25em silver',
          borderTop: '.133em solid #2f4fbb',
          borderLeft: '.065em solid #2f4fbb',
          borderRight: '.065em solid #2f4fbb',
          borderBottom: '.133em solid #2f4fbb',
          '-ms-transform': 'translate3d(-50%,-50%, 0)',
          '-moz-transform': 'translate3d(-50%,-50%, 0)',
          '-webkit-transform': 'translate3d(-50%,-50%, 0)',
          '-o-transform': 'translate3d(-50%,-50%, 0)',
          transform: 'translate3d(-50%,-50%, 0)'
        },
        bodyOverflow: false
      });

  modal.afterShow(function (modal) {
    modal.modalElem().addEventListener('click', replaceNode, false);
    modal.modalElem().addEventListener('touchend', replaceNode, false);
  });

  modal.afterClose(function (modal) { modal.destroy(); });
  modal.show();
  return;
};


// LISTENERS
/* An event listener for each because some RSs really don’t like event delegation at all in reflow… */

for (var i = 0; i < glossLinks.length; i++) {
  var glossLink = glossLinks[i];
	  glossLink.addEventListener('click', popModal, false);
	  glossLink.addEventListener('touchend', popModal, false);
};


/* IMPROVEMENTS 
   - Abort script if iframe injection fails for some reason (e.g. invalid source)
   - Implement “history” (array?) allowing previous/next for each session (embedded nav)
*/