import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { provider, connection } from '../anchorProvider';
import { Transaction, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { sendAndConfirmTransaction } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { createTransferCheckedInstruction } from '@solana/spl-token';
import PYUSD from '../assets/PYUSD.png'
import PYUSDIcon from '../assets/PYUSD-icon.png'
import { SystemProgram } from '@solana/web3.js';
import SOLIcon from "../assets/SOL-icon.png";

function Cards({ item, setNftitem, setVideoSrc, owner, player, setPlayer }) {
  const { publicKey, signTransaction } = useWallet();

  async function handlePayment() {
    if (!publicKey || !signTransaction) {
      console.log('Wallet not connected');
      return;
    }

    const recipientPublicKey = new PublicKey(owner);
    // const tokenMintPublicKey = new PublicKey('CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM');
    const lamports = parseInt(item.price*1000000000);

    // const tokenProgramId = TOKEN_2022_PROGRAM_ID;

    // try {
    //   const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    //     connection,
    //     publicKey,
    //     tokenMintPublicKey,
    //     publicKey,
    //     true,
    //     "finalized",
    //     { commitment: "finalized" },
    //     tokenProgramId,
    //   );
    //   console.log("sender token account: ", senderTokenAccount);

    //   const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    //     connection,
    //     publicKey,
    //     tokenMintPublicKey,
    //     recipientPublicKey,
    //     true,
    //     "finalized",
    //     { commitment: "finalized" },
    //     tokenProgramId,
    //   );
    //   console.log("recipient token account: ", recipientTokenAccount);

    //   const decimals = 6;
    //   const transferInstruction = createTransferCheckedInstruction(
    //     senderTokenAccount.address,
    //     tokenMintPublicKey,
    //     recipientTokenAccount.address,
    //     publicKey,
    //     lamports,
    //     decimals,
    //     [],
    //     tokenProgramId
    //   );

    //   console.log('Transaction instruction: ', transferInstruction);

    //   const transaction = new Transaction().add(transferInstruction);
    try{
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPublicKey,
        lamports: lamports,
      })
    );
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      console.log('transaction: ', transaction);

      const signedTransaction = await signTransaction(transaction);
      console.log('signed transaction: ', signedTransaction);

      try {
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("Transaction successful, signature:", signature);
        console.log(item.image);
        const ipfsPrefix = 'https://ipfs.io/ipfs/';
        const hash = item.image.substring(ipfsPrefix.length);
        const url = "https://cyan-magnetic-rat-616.mypinata.cloud/ipfs/" + hash;
        console.log("url: ", url);
        setVideoSrc(url);
        setPlayer(true)
        setNftitem(item)
        console.log(player);
      } catch (error) {
        console.error('Transaction failed:', error);
        if (error.logs) {
          console.log('Transaction logs:', error.logs);
        }
        alert("Transaction failed");
      }

    } catch (error) {
      console.error('Transaction failed:', error);
      alert("Transaction failed");
    }
  }


  return (
    <div className='card-container'>
      <div className='card-div'>
        <div className='card-inner p-2'>
          {item?.thumbnail ? (
            // {if }
            <img src={item.thumbnail} alt={item.name} className='object-cover w-[230px] h-[230px] rounded overflow-hidden' />
          ):(
            <img src={SOLIcon} alt={item.name} className='object-cover w-[230px] h-[230px] rounded overflow-hidden' />
          )}
          <div className='card-content'>
            <h1 className='text-white text-3xl mt-3'><strong>{item.name}</strong></h1>
            <h4 className='text-white mx-2 mt-2'>{item.description}</h4>
          </div>
          <div className='card-footer'>
            <h5 className='text-white mt-2'>Price: <span className='text-green-400'><strong>{item.price} </strong></span><img src={SOLIcon} alt="SOL Icon" className='w-6 h-6 inline-block align-bottom' /></h5>
            {!player && <button type="button" className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2 mt-4" onClick={() => { handlePayment() }}>Watch</button>}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Cards