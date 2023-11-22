import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Network, Provider } from "aptos";
import './Button49.css';

export const provider = new Provider(Network.TESTNET);
// change this to be your module account address
export const moduleAddress = "0x8547abf017059883b9d8d80436ccc89f5428133086313dae75f2f35d3e3b18d3";

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [counter, setCounter] = useState<number>(0);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);

  const fetch = async () => {
    if (!account) return;
    try {
      const todoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::mycounter::CountHolder`,
      );
      let data = JSON.parse((todoListResource?.data as any).count);
      setCounter(data);
      if(reload){
        window.location.reload();
      }
    }
    catch (e: any) {
      initialize();
    }
  }

  const initialize = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::mycounter::initialize`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.log(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const incrementCounter = async () => {
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::mycounter::increment`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      // setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  //Runs one Time
  useEffect(() => {
    fetch();
  }, [account?.address]);

  const timer = () => { setInterval(() => { setReload(1); fetch() }, 5000); }

  //Runs every 5 second
  useEffect(() => {
    timer();
  }, [account?.address]);

  return (
    <>
     <div style={{
       display: "flex",
       flexDirection: "column",
       backgroundColor: "#6f8178",
       height: '99vh',
       width: '99vw', 
       justifyContent: "center",
       alignItems: "center",
       

     }}>
      <div style={{
        width: "full",
        display:"flex",
        padding: '50px'
      }}>  <WalletSelector /></div>
     
    


      <button  disabled={!account}
        onClick={incrementCounter} className="button-49" role="button">
      SMASH ME 
      <span className="button-text"> HITS: {counter} </span>
    </button>
      
    </div>
    </>
  );
}

export default App;
