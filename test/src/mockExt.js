"use strict";
chrome = {
  _store: {"limit" : 160, _initialized: true},
  _store_man: {"limit" : 160},
  runtime: {
    onMessage : {
      addListener : function() {}
    }
  },
  storage: {
    local: {
      get: (a, callback) => callback(chrome._store),
      set: (a) => {
        console.log('save' + JSON.stringify(a));
        for (let el in a) {
          if ( a.hasOwnProperty(el) ) {
            chrome._store[el] = a[el];
          }
        }
      }
    },
    managed: {
      get: (a, callback) => callback(chrome._store_man)
    },
    onChanged: {
      addListener: () => {}
    }
  }
};
