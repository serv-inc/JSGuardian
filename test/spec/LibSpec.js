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
      doneIfDone(a, done, () => {
        expect(a.limit).toBe(160);
        expect(a.isManaged("limit")).toBe(true);
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

function doneIfDone(settings, done, checkCallback) {
  if ( settings._loaded ) {
    checkCallback();
    done();
  } else {
    console.log("ping");
    setTimeout(doneIfDone, 100, settings, done, checkCallback);
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
