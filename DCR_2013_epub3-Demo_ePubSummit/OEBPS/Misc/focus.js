'use strict';

// POLYFILL

var getClosest = function ( elem, selector ) {
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( elem.matches( selector ) ) return elem;
    }
    return null;
};


// CONFIG

var table = document.querySelector('tbody'),
	focusedRow;

// HANDLER

function focusHandler(e) {
  e.preventDefault();

  var el = e.target,
	  row = getClosest(el, "tr");

  if (el.nodeName == "td" || el.nodeName == "p") {

    if (focusedRow) {
      focusedRow.classList.remove('focus');
    }

    if (focusedRow != row) {
      row.classList.add('focus');
      focusedRow = row;
    } else if (focusedRow == row) {
      focusedRow = null;
    }
  }

}


// LISTENERS

table.addEventListener('click', focusHandler, false);
table.addEventListener('touchend', focusHandler, false);

/* NOTES
   - implement into tablesaw 
   - build button to enable/disable focus mode
*/