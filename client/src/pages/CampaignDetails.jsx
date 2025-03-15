import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';
import { toast } from 'react-toastify';

const CampaignDetails = () => {
  const { state } = useLocation();
  if (!state) {
    return <div className="text-black text-center">Campaign data not found.</div>;
  }

  const navigate = useNavigate();
  const { donate, getDonations, contract, address, createCampaign, signer } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false); // State to control image modal visibility
  const [imageUrl, setImageUrl] = useState(null); // State to store the selected image URL

  const fetchDonators = async () => {
    try {
      const data = await getDonations(state.pId);
      setDonators(data);
    } catch (error) {
      console.error("Failed to fetch donators:", error);
      setDonators([]);
    }
  };

  useEffect(() => {
    if (!signer) {
      console.log("Signer not found! Please connect your wallet.");
    }
  }, [signer]);

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        await fetchDonators();
      }
    };
    fetchData();
  }, [contract, address, fetchDonators]);

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    setIsLoading(true);
    try {
      await donate(state.pId, amount);
      toast.success("Donated successfully to" + state.title);
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Transaction failed. Please try again.");
    }
    setIsLoading(false);
  };

  const timeLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính theo epoch time (giây)
    const timeDiff = deadline - now;

    if (timeDiff <= 0) return "Expired";

    const days = Math.floor(timeDiff / (60 * 60 * 24));
    const hours = Math.floor((timeDiff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeDiff % (60 * 60)) / 60);
    const seconds = timeDiff % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const remainingTime = timeLeft(state.deadline);
  const totalAmount = state.target / 1e18;

  const handleImageClick = () => {
    setImageUrl(state.image); // Set the image URL to display in the modal
    setShowImageModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowImageModal(false); // Close the modal
    setImageUrl(null); // Reset the image URL
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="p-5 bg-[#f0f0f0] rounded-lg shadow-md relative">
        <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase pb-2">Campaign : {state.title}</h4>
        <img
          src={state.image}
          alt="campaign"
          className="w-full h-[410px] object-cover rounded-xl cursor-pointer"
          onClick={handleImageClick} // Handle the image click to show the modal
        />
        <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
          <div className="absolute h-full bg-[#4acd8d] " style={{ width: `${calculateBarPercentage(totalAmount, state.amountCollected)}%`, maxWidth: '100%' }}></div>
        </div>
      </div>

      <div className="flex w-full justify-between gap-[30px] mt-8">
        <CountBox title="Days Left" value={remainingTime} />
        <CountBox title={`total ${state.target / 1e18} ETH`}
          value={`${state.amountCollected} (${((state.amountCollected / totalAmount) * 100).toFixed(1)}%)`}
        />
        <CountBox title="Total Backers" value={donators.length} />
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal} // Close modal when clicking outside
        >
          <div
            className="relative bg-white p-4 rounded-lg" // Modal container with padding and border
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <img
              src={imageUrl}
              alt="campaign"
              className="max-w-[80vw] max-h-[80vh] object-contain"
            />

            {/* Close button inside the modal border */}
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold bg-black p-2 rounded-full"
              onClick={closeModal}
            >
              &times; {/* Close button */}
            </button>
          </div>
        </div>
      )}


      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-[#1dc071] break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">Story</h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-gray-700 leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">Donators</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? donators.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation} ETH</p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">Fund</h4>

          <div className="flex-1 bg-[#f0f0f0] p-5 rounded-lg shadow-md ">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-black">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-black text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#b2b2b2] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-black">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-white">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <CustomButton
                btnType="button"
                title="Donate Now"
                styles="w-full bg-[#1dc071]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
