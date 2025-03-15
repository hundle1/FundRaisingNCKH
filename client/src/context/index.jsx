import React, { createContext, useContext, useEffect, useState } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useAddress, useMetamask, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";

// Khởi tạo Context
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const address = useAddress();
  const connect = useMetamask();
  const signer = useSigner();
  useEffect(() => {
    if (!signer) {
      console.log("Wallet not connected! Please connect.");
    } else {
      console.log("Wallet connected:", signer);
    }
  }, [signer]); 

  const [sdk, setSdk] = useState(null);
  useEffect(() => {
    if (signer) {
      setSdk(ThirdwebSDK.fromSigner(signer, "sepolia"));
    }
  }, [signer]);
  const contractAddress = "0xC22Aff07689968e7aB48Ae2C5647cdaef83A134e";
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!sdk) return;
    const loadContract = async () => {
      try {
        const contractInstance = await sdk.getContract(contractAddress);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error loading contract:", error);
      }
    };
    loadContract();
  }, [sdk]);
  

  useEffect(() => {
    if (!address) {
      console.log("Wallet not connected! Please connect.");
    } else {
      console.log("Wallet connected:", address);
    }
  }, [address]);


  const publishCampaign = async (form) => {
    if (!contract) {
      console.error("Contract is not loaded yet.");
      return;
    }
  
    if (!address) {
      console.error("Wallet is not connected!");
      return;
    }
  
    try {
      const targetString = form.target.toString(); // Đảm bảo là string
      const targetInWei = ethers.utils.parseEther(targetString); // Chuyển đổi chính xác
      const deadlineInSeconds = Math.floor(new Date(form.deadline).getTime() / 1000);
  
      const data = await contract.call("createCampaign", [
        address,
        form.title,
        form.description,
        form.ipfsHashId,
        targetInWei, // Đã đảm bảo đúng format
        deadlineInSeconds,
        form.image,
      ]);
  
      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };
  


  const getCampaigns = async () => {
    if (!contract) return [];
  
    const campaigns = await contract.call("getCampaigns");
  
    return campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      ipfsHashId: campaign.ipfsHashId,
      target: ethers.utils.formatEther(campaign.target),
      deadline: campaign.deadline.toNumber(), // Giữ nguyên dạng số epoch
      amountCollected: ethers.utils.formatEther(campaign.amountCollected),
      image: campaign.image,
      pId: i,
    }));
  };
  

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  const donate = async (pId, amount) => {
    if (!contract) {
      console.error("Contract is not loaded yet.");
      return;
    }
  
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      console.error("Invalid donation amount.");
      return;
    }
  
    try {
      const transaction = await contract.call("donateToCampaign", [pId], {
        value: ethers.utils.parseEther(amount),
      });
  
      console.log("Donation successful", transaction);
      return transaction;
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };
  

  const getDonations = async (pId) => {
    if (!contract) {
      console.error("Contract is not loaded yet.");
      return [];
    }
    try {
      const [donators, donations] = await contract.call("getDonators", [pId]);
      if (!donators || !donations) return [];
      return donators.map((donator, i) => ({
        donator,
        donation: ethers.utils.formatUnits(donations[i] || "0", 18),
      }));
    } catch (error) {
      console.error("Failed to fetch donations:", error);
      return [];
    }
  };
  

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        signer, // Thêm signer vào context
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
