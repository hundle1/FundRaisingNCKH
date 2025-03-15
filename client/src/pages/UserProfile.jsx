import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";

const UserProfile = () => {
    const { address, getUserCampaigns } = useStateContext();
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [avatar, setAvatar] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserCampaigns = async () => {
            try {
                const campaigns = await getUserCampaigns();
                setUserCampaigns(campaigns);
            } catch (error) {
                console.error("Error fetching user campaigns:", error);
            }
        };
        if (address) {
            fetchUserCampaigns();
            setAvatar(`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`);
        }
    }, [address, getUserCampaigns]);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        toast.success("Wallet address copied to clipboard");
    };
    

    const handleNavigate = (campaign) => {
        navigate(`/campaign-details/${campaign.title}`, { state: campaign });
    };

    return (
        <div className="flex flex-col items-center p-6 bg-[#f0f0f0] rounded-lg shadow-md w-3/4 mx-auto mt-10">
            <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
            
            {/* Avatar */}
            {address && <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full mb-4 border border-gray-300" />}
            
            {/* Wallet Address with Copy */}
            <div className="mb-4 flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
                <span className="text-gray-800 font-medium cursor-default">{address ? address : "Not connected"}</span>
                {address && <Copy className="cursor-pointer text-gray-500 hover:text-black" size={18} onClick={handleCopy} />}
            </div>
            
            {/* Campaign Count */}

            
            {/* User Campaigns */}
            <div className="w-full">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold mb-3">Your Campaigns:</h2>             
                    <div className="flex mb-4 text-lg font-medium">Number of campaigns:<p className="text-[#1dc071]">&nbsp; {userCampaigns.length}</p></div>
                </div>
                {userCampaigns.length > 0 ? (
                    <ul className="space-y-3">
                        {userCampaigns.map((campaign, index) => (
                            <li key={index} className="flex flex-row justify-between p-4 bg-white rounded-md shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => handleNavigate(campaign)}>
                                <div>
                                    <h3 className="text-lg font-medium">{campaign.title}</h3>
                                    <p><strong>Target:</strong> {campaign.target / 1e18} ETH</p>
                                </div>
                                <div className="justify-items-end">
                                    <p><strong>Amount Collected:</strong> {campaign.amountCollected} ETH</p>
                                    <p><strong>Deadline:</strong> {new Date(campaign.deadline * 1000).toLocaleString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You haven't created any campaigns yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
