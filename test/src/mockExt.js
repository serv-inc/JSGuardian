"use strict";
chrome = {
  runtime: {
    onMessage : {
      addListener : function() {}
    }
  },
  storage: {
    local: {
      get: (a, callback) => callback({"limit" : 160}),
      set: (a, b) => {}
    },
    managed: {
      get: (a, callback) => callback({"_initialized": true, "limit" : 160})
    },
    onChanged: {
      addListener: () => {}
    }
  }
};
