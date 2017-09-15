function start () {
  let changed = false
  window.faviconObserver = new WebKitMutationObserver((mutations) => {
    if (changed) {
      changed = false
      return
    }

    mutations.forEach(mutation => {
      mutation.removedNodes.forEach(removedNode => {
        if ([...removedNode.relList || []].includes('icon')) {
          mutation.target.appendChild(removedNode)
          changed = true
        }
      })

      mutation.addedNodes.forEach(addedNode => {
        if ([...addedNode.relList || []].includes('icon')) {
          mutation.target.removeChild(addedNode)
          changed = true
        }
      })
    })
  })

  window.faviconObserver.observe(document.querySelector('head'), {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
  })
}

function stop () {
  if (window.faviconObserver) {
    window.faviconObserver.disconnect()
    delete window.faviconObserver
  }
}

if (!window.slackMute) {
  window.slackMute = true
  chrome.runtime.onMessage.addListener((msg) => {
    console.log('Slack mute :: ', msg)
    if (msg === 'START') start()
    if (msg === 'STOP') stop()
  })

  console.log('Slack mute loaded.')
}
