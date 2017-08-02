describe("Library", function() {
  var chrome = { store: { managed: { get(a) {
    /* todo */ } } } };

  // gets called with data, creates html options
  // 2--3 variants
  it("should create a HTML form for one integer setting", function() {
    expect(SchemaReader
           .fromJson(`{"type": "object", "properties": { "limit": {
"description": "maximum score for which to allow page",
"type": "integer" }}}`).toHtml())
      .toEqual(`<form id="options">
  <p>
    <label>limit:</label>
    <input style="flex: 1" type="text" id="limit"/><br />
  </p>
  <button class="centered" type="submit">Save</button>
</form>`);
  });
});
