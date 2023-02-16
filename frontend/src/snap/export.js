const snapId = `local:http://localhost:3000/`;

export async function connect () {
 
    await window.ethereum.request({
      method: 'wallet_enable',
      params: [{
        wallet_snap: { [snapId]: {} },
      }]
    })
    send()
  }

  // here we call the snap's "hello" method
export async function send () {
    try {
      const response = await window.ethereum.request({
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


  