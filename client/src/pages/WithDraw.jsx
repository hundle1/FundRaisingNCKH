import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { ethers } from "ethers";

const UserDonations = () => {
    const { address, getUserCampaigns } = useStateContext();
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [totalReceived, setTotalReceived] = useState(0);
    const [donationHistory, setDonationHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!address) return;
            
            try {
                const campaigns = await getUserCampaigns();
                setUserCampaigns(campaigns);
                
                let total = 0;
                let history = [];
                
                campaigns.forEach(campaign => {
                    total += parseFloat(ethers.utils.formatEther(campaign.amountCollected));
                    
                    campaign.donators.forEach((donator, index) => {
                        history.push({
                            from: donator,
                            amount: ethers.utils.formatEther(campaign.donations[index]),
                            campaignTitle: campaign.title
                        });
                    });
                });
                
                setTotalReceived(total);
                setDonationHistory(history);
            } catch (error) {
                console.error("Error fetching donation data:", error);
            }
        };
        
        fetchData();
    }, [address, getUserCampaigns]);

    return (
        <div className="flex flex-col items-center p-6 bg-[#f0f0f0] rounded-lg shadow-md w-3/4 mx-auto mt-10">
            <h1 className="text-2xl font-semibold mb-4">Donation Summary</h1>
            
            {/* Tổng tiền đã nhận */}
            <div className="mb-6 text-lg font-medium bg-white p-4 rounded-md shadow-sm w-full text-center">
                <p><strong>Total Received:</strong> {totalReceived} ETH</p>
            </div>

            {/* Lịch sử donate */}
            <div className="w-full">
                <h2 className="text-xl font-semibold mb-3">Donation History:</h2>
                {donationHistory.length > 0 ? (
                    <ul className="space-y-3">
                        {donationHistory.map((donation, index) => (
                            <li key={index} className="p-4 bg-white rounded-md shadow-sm">
                                <p><strong>From:</strong> {donation.from}</p>
                                <p><strong>Amount:</strong> {donation.amount} ETH</p>
                                <p><strong>Campaign:</strong> {donation.campaignTitle}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No donations received yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserDonations;
