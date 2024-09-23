# Video NFT Marketplace on Solana

This is a Video NFT Marketplace Dapp built on Solana blockchain where the fee for watching the video is paid using PYUSD

Hosted app link: [https://video-nft-marketplace-solana.netlify.app/](https://video-nft-marketplace-solana.netlify.app/)

## Clone and run the app locally
1. Clone the repository
   ```sh
   git clone https://github.com/Shoydon/video-nft-marketplace-solana
   ```
2. Install the required libraries
   ```sh
   npm i
   ```
3. Run the app
   ```sh
   npm start
   ```
   `NOTE: Make sure you have a Solana wallet extension(which supports PYUSD) installed and have some test SOL and PYUSD in that wallet`
   * [Phantom Wallet](https://phantom.app/)
   * [Solana Faucet](https://faucet.solana.com/) 
   * [PYUSD Faucet](https://faucet.paxos.com/)
  
## Smart contract writing and deploying process
* ### Development
  * The smart contract was written in [Rust](https://doc.rust-lang.org/stable/book/) and deployed using [Anchor framework](https://www.anchor-lang.com/) and deployed on the Solana Devnet.
  * We have made use of the [Phantom Wallet](https://phantom.app/). The SOL devnet test tokens were obtained from [Solana Faucet](https://faucet.solana.com/) and PYUSD test tokens were obtained from [PYUSD Faucet](https://faucet.paxos.com/). 
* ### Deployment
  *  The smart contract was deployed on the devnet from the cli. The steps to setup the deployment environment are [here](https://www.anchor-lang.com/docs/installation)
    *  Initialize a new project using the command:
        ```sh
        anchor init <your-app-name>
        cargo add anchor-lang --features init-if-needed
        cargo add anchor-spl
        ```
    *  Go to `anchor.toml` file and switch to devnet
        ```sh
        // Replace this
        cluster = "localnet"

        // With this
        cluster = "devnet"
        ```
    *  Now, go to `./programs/anchor/Cargo.toml` file
        ```sh
        // Replace this
        idl-build = ["anchor-lang/idl-build"]

        // With this
        idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
        ```
    *  In the `./programs/anchor/src/lib.rs` file, paste the code from `src/contracts/smartcontract.rs` file from this repository except the line-
       ```rust
       declare_id!("8VUfy12GD5yhKAcb7zdkAmjGyiMZVq5ce2zMNyi31Bra");
       ```
    *  Now run the commands
        ```sh
        anchor build
        anchor deploy
        ```
    *  You will get the `PROGRAM ID` after the contract is successfully deployed
    *  Also, copy the `IDL.json` file stored at `./programs/anchor/target/idl/<project_name>.json` and use it in your frontend
* ### Generating the `STATE KEY`
  *  Go to [Solana Playground](https://beta.solpg.io/) and create a new `Anchor(Rust)` project.
  *  Paste this code in the `client.ts` file
        ```typescript
        const programID = new web3.PublicKey(PROGRAM_ID_OBTAINED_FROM_PREVIOUS_STEP);

        const [stateAccountPublicKey, _bump] = web3.PublicKey.findProgramAddressSync(
          [Buffer.from("state")],
          programID
        );
        console.log("state account: ", stateAccountPublicKey.toString());
        ```
        You will get the `STATE KEY` as the output

## Extra Links and information
* [**Solana programs library**](https://spl.solana.com/): Used for importing in-built functions and token standards
* [**Solana web3.js**](https://solana-labs.github.io/solana-web3.js/): Used  to interact with accounts and programs on the Solana network through the Solana JSON RPC API.
* [**Pinata Cloud**](https://docs.pinata.cloud/quickstart): Used for storing the videos and images on IPFS
