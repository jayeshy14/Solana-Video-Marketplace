import { useState, useEffect } from "react";
import React from "react";
import { provider, program } from "../anchorProvider";
import { web3 } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { getProvider } from "../detectProvider";
import { toast } from "react-toastify";
import contractData from "../contracts/contractData.json";

const Mint: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<any | null>(0);
  const [video, setVideo] = useState<any | null>(null);
  const [thumbnail, setThumbnail] = useState<any | null>(null);
  const [uri, setUri] = useState<string>("");
  const [stateInitialized, setStateInitialized] = useState<boolean>(false);
  const [mintAccount, setMintAccount] = useState<any | null>("");
  const [associatedTokenAccount, setAssociatedTokenAccount] = useState<any | null>("");
  const [currentProvider, setCurrentProvider] = useState<any | null>("");
  const [stateAccount, setStateAccount] = useState<any | null>(""); //checking
  // const REACT_APP_PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
  const REACT_APP_PINATA_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiZjEzNWJmZS0wOTc5LTQ5ODctOTkwNS02YWRkNDFkNDc3NmYiLCJlbWFpbCI6ImluZm8uc2hveWRvbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNGI1MDNhOWMxNDJmZGRjNzg0M2EiLCJzY29wZWRLZXlTZWNyZXQiOiJmNmRmOWM4NzIwMTI5MzhhNzc5YzQwZTU4MWFjZjg2ZGM4YTEwYjY1OTQwZTVmYzhkMmQ4NjE5ODAzNjlkMjU1IiwiZXhwIjoxNzU3NTA5NDcwfQ.QlNb6rmDSz6uEIiVHTACsnOXV8YzHUw_vdcrRYs7xN8";

  useEffect(() => {
    const checkInitialization = async () => {
      try {
        const [stateAccountPublicKey] = web3.PublicKey.findProgramAddressSync(
          [Buffer.from("state")],
          program.programId
        );
        console.log("state account: ", stateAccountPublicKey.toString());

        // const stateAccountPublicKey = new web3.PublicKey(contractData.STATE);
        console.log(stateAccountPublicKey);
        setStateAccount(stateAccountPublicKey);

        const stateAccount = await provider.connection.getAccountInfo(
          stateAccountPublicKey
        );
        console.log(stateAccount);
        if (stateAccount) {
          setStateInitialized(true);
        }
      } catch (error) {
        console.error("Error checking initialization:", error);
      }
    };

    checkInitialization();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (!event.target.files) return;
    // setVideo(event.target.files[0]);
    const file = event.target.files?.[0]; // Get the first file if it exists
    if (!file) return;
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (allowedTypes.includes(file.type)) {
      setVideo(file);
      // Create a video element
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';

      // Load the video file into the video element
      const url = URL.createObjectURL(file);
      videoElement.src = url;

      videoElement.addEventListener('loadeddata', () => {
        // Once video data is loaded, capture the first frame
        videoElement.currentTime = 0; // Go to the start of the video

        videoElement.addEventListener('seeked', async () => {
          // Create a canvas element to draw the frame
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) return;

          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;

          // Draw the first frame of the video onto the canvas
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

          // Convert canvas to data URL
          const dataURL = canvas.toDataURL('image/jpeg');
          const blob = await (await fetch(dataURL)).blob();
          setThumbnail(blob); // Set the thumbnail state
          console.log(blob);
          console.log(thumbnail);
          console.log(typeof(blob));
          
          // Clean up
          URL.revokeObjectURL(url);
        });
      });

    } else {
      toast.info(
        <div>
          <p>Please select a valid video file. </p>
          <p>(Accepted types: 'video/mp4', 'video/webm', 'video/ogg')</p>
        </div>,
        {
          position: "top-center",
        }
      );
      event.target.value = ""; // Reset the file input
    }
  };

  const initializeState = async () => {
    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          state: stateAccount,
          signer: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      console.log("Initialize tx signature: ", tx);

      setStateInitialized(true);
    } catch (error) {
      console.error("Error initializing state:", error);
    }
  };

  const mintNft = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("mint func");
    if(name === "" || price === 0 || description === "" || video === null){
      console.log("cannot mint");

      toast.info("Cannot mint due to one or multiple empty fields", {
        position: "top-center"
      });
      // alert("Cannot mint due to one or multiple empty fields");
      return;
    }
    console.log("passed the if");

    // check if state is initialized, if not, do it
    if (!stateInitialized) {
      toast.info("State is not initialized. Initializing the state first.", {
        position: "top-center",
      });
      await initializeState();
      return;
    }

    try {
      const provider = getProvider();
      console.log(provider);
      setCurrentProvider(provider._publicKey.toString());
      console.log("calling get counter function");
      const currentCounter = await program.methods
        .getCounter()
        .accounts({
          state: stateAccount,
          signer: provider.publicKey,
        })
        .view();
      console.log("current counter: ", currentCounter);

      const counterBytes = new Uint8Array(4);
      new DataView(counterBytes.buffer).setUint32(0, currentCounter, true);

      const seeds = [
        new TextEncoder().encode("mint"),
        provider.publicKey.toBuffer(),
        counterBytes,
      ];

      const [mintAccountPublicKey] = web3.PublicKey.findProgramAddressSync(
        seeds,
        program.programId
      );

      // const counterBytes = Buffer.alloc(4);
      // counterBytes.writeUInt32LE(currentCounter, 0);
      // const seeds = [
      //   Buffer.from("mint"),
      //   provider.publicKey.toBuffer(),
      //   counterBytes,
      // ];
      // const [mintAccountPublicKey] = web3.PublicKey.findProgramAddressSync(
      //   seeds,
      //   program.programId
      // );
      setMintAccount(mintAccountPublicKey);

      const ata = await getAssociatedTokenAddress(
        mintAccountPublicKey,
        new web3.PublicKey(provider._publicKey.toString()),
        false
      );
      setAssociatedTokenAccount(ata.toBase58());

      toast.info("Uploading video to IPFS", {
        position:"top-center"
      })
      // Upload video to IPFS
      const formData = new FormData();
      formData.append("file", video);
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);
      const metadata = JSON.stringify({
        name: name,
      });
      formData.append("pinataMetadata", metadata);
      
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${REACT_APP_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      console.log(res);
      const resDataJson = await res.json();
      console.log("res json: ", resDataJson);
      // const tokenImageUri = `https://gold-quick-antelope-719.mypinata.cloud/ipfs/${resDataJson.IpfsHash}`;
      const tokenImageUri = `https://ipfs.io/ipfs/${resDataJson.IpfsHash}`;
      console.log(tokenImageUri);
      console.log("NFT video saved to IPFS!");
      toast.info(
      <div>
        <p>Video saved to IPFS!</p>
        <p>Uploading thumbnail to IPFS</p>
      </div>, {
        position:"top-center"
      })
      
      // thumbnail
      const formData2 = new FormData();
      formData2.append("file", thumbnail);
      const options2 = JSON.stringify({
        cidVersion: 0,
      });
      formData2.append("pinataOptions", options2);
      const metadata2 = JSON.stringify({
        name: name,
      });
      formData2.append("pinataMetadata", metadata2);

      const res1 = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${REACT_APP_PINATA_JWT}`,
          },
          body: formData2,
        }
      );
      console.log(res1);
      const resDataJson2 = await res1.json();
      console.log("res1 json: ", resDataJson2);
      const thumbnailUri = `https://cyan-magnetic-rat-616.mypinata.cloud/ipfs/${resDataJson2.IpfsHash}`;
      console.log(thumbnailUri);
      console.log("NFT thumbnail saved to IPFS! Creating metadata...");
      
      toast.info(<div>
        <p>Thumbnail saved to IPFS!</p>
        <p>Now pinning metadata to IPFS</p>
      </div>, {
        position:"top-center"
      })
      
      // create metadata
      const data = JSON.stringify({
        pinataContent: {
          name: name,
          owner: currentProvider,
          symbol: name.toUpperCase(),
          description: description,
          price: price,
          image: tokenImageUri,
          thumbnail: thumbnailUri,
        },
        pinataMetadata: {
          name: "Metadata.json",
        },
      });
      
      // send metadata to IPFS
      const res2 = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${REACT_APP_PINATA_JWT}`,
            "Content-Type": "application/json",
          },
          body: data,
        }
      );
      const resData2 = await res2.json();
      setUri(resData2.IpfsHash); // change here made
      console.log("NFT metadata saved to IPFS!");
      toast.info(
      <div>
        <p>NFT metadata saved to IPFS!</p>
        <p>Now minting NFT on blockchain</p>
      </div>, {
        position:"top-center"
      })
      
      const tx = await program.methods
        .initNft(resData2.IpfsHash) //change here made
        .accounts({
          state: stateAccount,
          signer: provider.publicKey,
          mint: mintAccountPublicKey.toBase58(),
          associated_token_account: ata.toBase58(),
          token_program: TOKEN_PROGRAM_ID,
          associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
          system_program: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      console.log("InItNFT tx signature: ", tx);

      console.log("mintAccountPublicKey: ", mintAccount);
      console.log("ata: ", associatedTokenAccount);
      toast.success("Minted NFT successfully", {
        position: "top-center",
      });
      // alert("minted NFT successfully");
      // alert("NFT minted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-h-screen pt-24">
      <div className="container-fluid mt-5 text-left">
        <div className="content mx-auto">
          <form className="max-w-sm mx-auto">
            <div className="max-w-lg mx-auto">
              <label
                className="block mb-2 text-sm font-medium text-white"
                htmlFor="user_avatar"
              >
                Upload Video
              </label>
              <input
                onChange={(e) => {
                  handleFileChange(e);
                }}
                name="file"
                className="block w-full mb-4 h-8 text-m  text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file"
                accept="video/*"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-white"
              >
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="title"
                name="title"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Enter Name"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-white"
              >
                Description
              </label>
              <input
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                id="description"
                name="description"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Describe the NFT (max limit: 20 characters)"
                required
                maxLength={20}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-white"
              >
                Price
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                id="price"
                name="price"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Enter Price in SOL"
              />
            </div>

            <div className="text-center">
              <button
                onClick={mintNft}
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Mint SBT
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* {thumbnail && <img src={thumbnail} alt="Video Thumbnail" />} */}
    </div>
  );
};

export default Mint;
