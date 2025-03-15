import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";
import { Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 3;

const UserProfile = () => {
    const { address, getUserCampaigns } = useStateContext();
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
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

    const totalAmountReceived = userCampaigns.reduce((total, campaign) => total + parseFloat(campaign.amountCollected || 0), 0);

    const totalPages = Math.ceil(userCampaigns.length / ITEMS_PER_PAGE);
    const visibleCampaigns = userCampaigns.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }

        return (
            <div className="flex justify-center items-center gap-2 mt-6 p-3 bg-white shadow-md rounded-lg">
                <button
                    className={`p-2 rounded-lg ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={20} />
                </button>

                {pages.map((page, index) =>
                    page === "..." ? (
                        <span key={index} className="px-3 text-gray-500">...</span>
                    ) : (
                        <button
                            key={index}
                            className={`px-3 py-1 rounded-lg ${
                                page === currentPage ? "bg-[#1dc071] text-white" : "hover:bg-gray-200"
                            }`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    className={`p-2 rounded-lg ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Profile</h1>

            <div className="flex gap-8">
                <div className="flex-shrink-0">
                    {address && <img src={avatar} alt="Avatar" className="w-40 h-40 rounded-lg border border-gray-300 shadow-md" />}
                </div>

                <div className="flex flex-col justify-center flex-1">
                    <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm mb-4">
                        <span className="text-gray-800 font-medium truncate">{address || "Not connected"}</span>
                        {address && <Copy className="cursor-pointer text-gray-500 hover:text-black ml-2" size={18} onClick={handleCopy} />}
                    </div>

                    <div className="flex justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Campaigns</p>
                            <p className="text-2xl font-bold text-[#1dc071]">{userCampaigns.length}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Total Received</p>
                            <p className="text-2xl font-bold text-[#f59e0b]">{totalAmountReceived.toFixed(10)} ETH</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Campaigns</h2>

                {userCampaigns.length > 0 ? (
                    <>
                        <ul className="space-y-4">
                            {visibleCampaigns.map((campaign, index) => (
                                <li
                                    key={index}
                                    className="flex flex-row justify-between p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition"
                                    onClick={() => handleNavigate(campaign)}
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                                        <p className="text-gray-600"><strong>Target:</strong> {campaign.target / 1e18} ETH</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-700"><strong>Amount Collected:</strong> {campaign.amountCollected} ETH</p>
                                        <p className="text-gray-500 text-sm"><strong>Deadline:</strong> {new Date(campaign.deadline * 1000).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {renderPagination()}
                    </>
                ) : (
                    <p className="text-gray-500">You haven't created any campaigns yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
