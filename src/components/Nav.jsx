import React from 'react'
import { Link } from 'react-router-dom'
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

function Nav() {
  return (
   <>
<div class="fixed z-10 backdrop-blur-sm">
  <section class="relative mx-auto">
      
    <nav class="flex justify-between text-white w-screen px-24">
      <div class="px-5 xl:px-12 py-6 flex w-full items-center">
        <a class="text-3xl font-bold font-heading">
          Ignitus Networks
        </a>
       
        <ul class="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
          <Link className='no-underline text-gray-200' as={Link} to="/">
          <li>Home</li>   </Link>
          <Link className='no-underline text-gray-200' as={Link} to="/all-nft">
          <li>All NFTs</li>   </Link>
          <Link className='no-underline text-gray-200' as={Link} to="/create">
          <li>Mint NFT</li>   </Link>
        </ul>
        
        <div class="hidden xl:flex items-center space-x-5 items-center">
          <WalletMultiButton />
         
        {/* <button type="button" class="inline-flex items-center justify-center border-[0.5px] p-2 w-22  h-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false">
        {/* {account.slice(0, 5) + '...' + account.slice(38, 42)}
      </button>  */}
        </div>
      </div>
    

    </nav>
    
  </section>
</div>


   </>
  )
}

export default Nav