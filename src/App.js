import React, { useState, useEffect } from 'react';
import Web3 from 'web3'
import Marketplace from './abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'
import WeatherApp from './WeatherApp';
import './App.css'



function Example() {
  const [account, setAccount] = useState(0);
  const [marketplace, setMarketplace] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [pro, setPro] = useState(0);
  const [initial, setInitial] = useState(0);


  
  

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async function loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    // console.log("Set Init", accounts);
console.log(initial);
    if (initial == 0){
    setInitial(accounts[0]);
    }

    setAccount(accounts[0]);
    //this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    console.log(networkData);
    if(networkData) {
      console.log("HH");
      const place = new web3.eth.Contract(Marketplace.abi, networkData.address)
      console.log("HH1");

      setMarketplace(place);
      //this.setState({ marketplace })
      const count = await place.methods.productCount().call()
      console.log(count);
      setProductCount(count);
      console.log("Hello");
      console.log(account);
      //this.setState({ productCount })
      // Load products
      let p = []
      let c;
      c = parseInt(count._hex, 16);
      console.log(c);
      setProductCount(c); 
      for (var i = 1; i <= count; i++) {
        const product = await place.methods.products(i).call()
        p.push(product);

      }
      setProducts(p);
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }
 async function createProduct(name, price) {
   console.log("Initial", initial);
    console.log("Hhsjdhfskj");
    console.log(initial);
    console.log(account);
    marketplace.methods.createProduct(name, price, initial).send({ from: account, value: price })
    .on('transactionHash', (hash) => {
      setPro(1);
    })

    var delayInMilliseconds = 8000; //1 second

setTimeout( async function() {
  //your code to be executed after 1 second
  loadBlockchainData();

}, delayInMilliseconds);

    // let tx = await marketplace.methods.createProduct(name, price).send({ from: account })
    // tx.wait().then({
    //   loadBlockchainData
    // })
  }

  function   purchaseProduct(id, price) {
    console.log(id);
     marketplace.methods.purchaseProduct(id).send({ from: account, value: price, to: initial })
    .once('receipt', (receipt) => {
//      this.setState({ loading: false })
    })


    var delayInMilliseconds = 8000; //1 second

setTimeout( async function() {
  //your code to be executed after 1 second
  loadBlockchainData();

}, delayInMilliseconds);
  }
  window.ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    console.log(accounts);
    setAccount(accounts[0])
  })

  async function setInit() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log("Set Init", accounts);
    setInitial(accounts[0]);
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
    setInit();
    // Update the document title using the browser API
  }, []);

  // useEffect(() => {
  //   loadBlockchainData();
  //   // Update the document title using the browser API
  // }, [pro]);

  
  

  return (
    <div>
    <Navbar account={account} />
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex">
          
            <div> 
            <Main
              products={products}
              createProduct={createProduct}
              purchaseProduct={purchaseProduct} />
              <WeatherApp/>
              </div>
          
        </main>
      </div>
    </div>
  </div>
  );
}
export default Example;
