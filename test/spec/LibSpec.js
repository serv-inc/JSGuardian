"use strict";
describe("Mock Extension", function() {

  it("should have a get that calls a callback", function(done) {
    chrome.storage.managed.get(null, (result) => {
      expect(result.limit).toBe(160);
      done();
    });
  });

});

describe("JSGuardian", function() {

  describe("Settings Object", function() {

    it("should yield the managed objects variable", function(done) {
      let a = new Settings();
      ifLoaded(a, () => {
        expect(a.limit).toBe(160);
        expect(a.isManaged("limit")).toBe(true);
        done();
      });
    });


    it("should save an unmanaged variable to local storage", function(done) {
      let a = new Settings();
      ifLoaded(a, () => {
        // trick to set a new variable: assign to _settings
        a._settings.something = 1234;
        a.save();
        expect(a._loaded).toBe(true);
        let b = new Settings();
        ifSaved(a, () => {
          expect(b.something).toBe(1234);
          expect(b.isManaged("something")).toBe(false);
          done();
        });
      });
    });


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
    });

  });

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

function ifLoaded(settings, callback) {
  if ( settings._loaded ) {
    callback();
  } else {
    setTimeout(ifLoaded, 100, settings, callback);
  }
}
function ifSaved(settings, callback) {
  if ( settings._saved ) {
    callback();
  } else {
    console.log("pong");
    setTimeout(ifLoaded, 100, settings, callback);
  }
}


    // describe("Library", function() {

    //   // gets called with data, creates html options
    //   // 2--3 variants
    //   it("should create a HTML form for one integer setting", function() {
    //     expect(SchemaReader
    //            .fromJson(`{"type": "object", "properties": { "limit": {
    // "description": "maximum score for which to allow page",
    // "type": "integer" }}}`).toHtml())
    //       .toEqual(`<form id="options">
    //   <p>
    //     <label>limit:</label>
    //     <input style="flex: 1" type="text" id="limit"/><br />
    //   </p>
    //   <button class="centered" type="submit">Save</button>
    // </form>`);
    //   });
    // });
