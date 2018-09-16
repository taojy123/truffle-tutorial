// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import artifact from '../../build/contracts/MyFlag.json'

// MyFlag is our usable abstraction, which we'll use through the code below.
const MyFlag = contract(artifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the MyFlag abstraction for Use.
    MyFlag.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      self.getTopics()
    })
  },

  getTopics: function () {
    const self = this

    let meta
    MyFlag.deployed().then(function (instance) {
      meta = instance
      return meta.getCount.call()
    }).then(function (count) {
      const countDiv = document.getElementById('count')
      const ol = document.getElementById('topics')
      let i = 0
      countDiv.innerHTML = count
      ol.innerHTML = ''
      for (i=0; i<count; i++) {
        meta.topics.call(i).then(function (topic) {
          const title = topic[0]
          const content = topic[1]
          const owner = topic[2]
          const ts = topic[3]
          ol.innerHTML += `<li>${title} | ${content} | ${owner} | ${ts}</li>`
        })
      }

    }).catch(function (e) {
      console.log(e)
      alert('failed!')
    })
  },

  postTopic: function () {
    const self = this

    const title = document.getElementById('title').value
    const content = document.getElementById('content').value

    let meta
    MyFlag.deployed().then(function (instance) {
      meta = instance
      return meta.postTopic(title, content, { from: account, gas: 1000000 })
    }).then(function () {
      self.getTopics()
    }).catch(function (e) {
      console.log(e)
      alert('failed!')
    })
  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MyFlag,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
