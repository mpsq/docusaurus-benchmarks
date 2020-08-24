const URLs = [
  {
    name: "No JS",
    url: "https://5f2d50ba7316ec0008f830a9--docusaurus-2.netlify.app/build/",
  },
  {
    name: "Defer",
    url: "https://5f2d4cfb5ac4740007ff0684--docusaurus-2.netlify.app/build/",
  },
  {
    name: "Preload",
    url: "https://5f2d193a5609540008fb969c--docusaurus-2.netlify.app/build/",
  },
]
const COUNT = 50

const runBench = async (url) => {
  const lighthouse = require("lighthouse")
  const chromeLauncher = require("chrome-launcher")

  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] })

  const runnerResult = await lighthouse(url, {
    logLevel: "error",
    output: "html",
    onlyCategories: ["performance"],
    port: chrome.port,
  })

  await chrome.kill()

  return runnerResult.lhr.categories.performance.score * 100
}

const start = async () => {
  for (const { name, url } of URLs) {
    let results = []

    console.log(`Start benchmark for "${name}"`)

    for (let i = 0; i < COUNT; i++) {
      const res = await runBench(url)
      console.log(res)
      results.push(res)
    }

    results = results.filter(Boolean)

    console.log(
      `${name} result:`,
      results.reduce((acc, upt) => acc + upt, 0) / results.length,
    )
  }
}

start()
