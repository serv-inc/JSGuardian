"use strict";
describe("Mock Chrome", function() {

  it("should have a get that calls a callback", function(done) {
    chrome.storage.managed.get(null, (result) => {
      expect(result.limit).toBe(160);
      done();
    });
  });

  it("should call back callbacks on change", function() {
    var call = {
      me: function(a, b) { }
    };
  
    spyOn(call, "me");
    chrome.storage.onChanged.addListener(call.me);
    chrome._triggerChange();
    expect(call.me).toHaveBeenCalled();
  });
});

describe("Settings Object", function() {

  it("should yield the managed objects variable", function(done) {
    let a = new Settings();
    whenLoaded(a, () => {
      expect(a.limit).toBe(160);
      expect(a.isManaged("limit")).toBe(true);
      done();
    });
  });


  it("should save an unmanaged variable to local storage", function(done) {
    let a = new Settings();
    whenLoaded(a, () => {
      // trick to set a new variable: assign to _settings
      a._settings.something = 1234;
      a.save();
      expect(a._loaded).toBe(true);
      let b = new Settings();
      whenSaved(a, () => {
        expect(b.something).toBe(1234);
        expect(b.isManaged("something")).toBe(false);
        done();
      });
    });
  });


  /* 1. storage.onChanged triggers
     2. new value is in settings object */
  it("should update on storage changes", function() {
    let $et = new Settings();
    whenLoaded($et, () => {
      chrome._triggerChange();
      expect($et.limit).toBe(0);
    });
  });


  /* 0. [@0] register object
     1. storage.onChanged triggers
     2. callbacks are called with change[d|s]? object */
  it("should call registered callbacks on storage changes", function() {
    let $et = new Settings();
    var call = { me: function(a, b) { } };
    spyOn(call, "me");
    whenLoaded($et, () => {
      $et.addOnChangedListener("limit", call.me);
      chrome._triggerChange();
      expect(call.me).toHaveBeenCalled();
    });
  });


  it("should avoid other callbacks on storage changes", function() {
    let $et = new Settings();
    var call = { me: function(a, b) { } };
    spyOn(call, "me");
    whenLoaded($et, () => {
      $et.addOnChangedListener("whitelist", call.me);
      chrome._triggerChange();
      expect(call.me).not.toHaveBeenCalled();
    });
  });
  

  // todo: breaks following tests
  it("should get from preset.json", function() {
    let tmp = chrome._store;
    chrome._store = chrome._store_man;
    jasmine.Ajax.withMock(function() {
      let a = new Settings();
      expect(jasmine.Ajax.requests.mostRecent().url).toBe("preset.json");
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 200,
        "responseText": '{"whitelist" : "mozilla.org|dansguardian.org"}'
      });
      expect(a.whitelist).toBe("mozilla.org|dansguardian.org");
      expect(a._loaded).toBe(true);
    });
    chrome._store = tmp;
  });
});

describe("JSGuardian", function() {

  describe("BlockCache", function() {

    beforeEach(function() {
      this.blockCache = new BlockCache();
    });

    it("should recognize added urls", function() {
      this.blockCache.add("http://some.url");
      expect(this.blockCache.allow("http://some.url")).toBe(false);
    });

    it("should allow clear non-added urls", function() {
      expect(this.blockCache.allow("http://other.url")).toBe(true);
    });
  });

});

function whenLoaded(settings, callback) {
  if ( settings._loaded ) {
    callback();
  } else {
    setTimeout(whenLoaded, 100, settings, callback);
  }
}
function whenSaved(settings, callback) {
  if ( settings._saved ) {
    callback();
  } else {
    console.log("pong");
    setTimeout(whenSaved, 100, settings, callback);
  }
}


