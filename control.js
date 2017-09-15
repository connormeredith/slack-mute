function init () {
  getTabs(tabs => {
    if (tabs.length) injectScript(tabs[0])
  })
}

function injectScript (tab) {
  chrome.tabs.executeScript(tab.id, { file: 'slackMute.js' })
}

function getTabs (callback) {
  chrome.tabs.query({ url: ['https://*.slack.com/*'] }, callback)
}

function message (tab, action) {
  chrome.tabs.sendMessage(tab.id, action)
}

(() => {
  init()

  let on = false
  chrome.browserAction.onClicked.addListener(() => {
    on = !on

    init()

    if (on) {
      chrome.browserAction.setIcon({path: 'slackOn.png'})
      chrome.browserAction.setTitle({ title: 'Mute Slack' })
    } else {
      chrome.browserAction.setIcon({path: 'slackOff.png'})
      chrome.browserAction.setTitle({ title: 'Unmute Slack' })
    }

    const action = (on) ? 'START' : 'STOP'
    getTabs(tabs => {
      tabs.forEach(tab => message(tab, action))
    })
  })
})()
