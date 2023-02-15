const snapId = `local:${window.location.href}`;

async function connect () {
    await ethereum.request({
      method: 'wallet_enable',
      params: [{
        wallet_snap: { [snapId]: {} },
      }]
    })
    send()
  }

  // here we call the snap's "hello" method
  async function send () {
    try {
      const response = await ethereum.request({
        method: 'wallet_invokeSnap',
        params: [snapId, {
          method: 'inApp'
        }]
      })
    } catch (err) {
      console.error(err)
      alert('Problem happened: ' + err.message || err)
    }
  }


  