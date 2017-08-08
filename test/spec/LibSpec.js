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

    it("should save an unmanaged variable", function(done) {
      let a = new Settings();
      ifLoaded(a, () => {
        // trick to set a new variable: assign to _settings
        a._settings.something = 1234;
        a.save(a);
        console.log(JSON.stringify(a));
        let b = new Settings();
        ifSaved(a, () => {
          console.log(JSON.stringify(b));
          expect(b.something).toBe(1234);
          expect(b.isManaged("something")).toBe(false);
          done();
        });
      });
    });
  });
});
    /*
       1. create settings object using my chrome
       2. check that value is contained
       3. and that managed
       b. or not managed for other item
    */

function ifLoaded(settings, callback) {
  if ( settings._loaded ) {
    callback();
  } else {
    console.log("ping");
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
