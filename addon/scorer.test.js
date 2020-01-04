const {Worker} = require("worker_threads")

test('scan matches', done => {
  const scorer = new Worker("./addon/scorer.js", {"workerData": "hello"})
  scorer.on("message", val => {
    expect(val).toBe(1)
    scorer.terminate().then(_ =>
      done()
    )
  })
  scorer.postMessage(JSON.stringify(["init", "hello"]))
  scorer.postMessage(JSON.stringify(["scan", "hello"]))
})

test('scan does not match', done => {
  const scorer = new Worker("./addon/scorer.js", {"workerData": "hello"})
  scorer.on("message", val => {
    expect(val).toBe(0)
    scorer.terminate().then(_ =>
      done()
    )
  })
  scorer.postMessage(JSON.stringify(["init", "hello"]))
  scorer.postMessage(JSON.stringify(["scan", "asdf"]))
})
