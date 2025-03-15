import React from 'react';
import { tagType, thirdweb } from '../assets';

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick }) => {
  const timeLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000); // Convert to seconds
    const timeDiff = deadline - now;
    if (timeDiff <= 0) return "Expired";
    const days = Math.floor(timeDiff / (60 * 60 * 24));
    return `${days}d`;
  };

  const remainingTime = timeLeft(deadline); // Use the deadline prop directly

  return (
    <div
      className="sm:w-[388px] w-full rounded-[15px] bg-[#ffffff] cursor-pointer border-[1px] border-[#3a3a433d] shadow-lg hover:shadow-xl transition-shadow duration-300"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-t-[15px]"
      />

      <div className="flex flex-col p-4">
        {/* Tag */}
        <div className="flex flex-row items-center mb-[18px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#000000]">
            Education
          </p>
        </div>

        {/* Title & Description */}
        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-[#000000] text-left leading-[26px] truncate">
            {title}
          </h3>
        </div>
        {/* Raised & Days Left */}
        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#46c874] leading-[22px]">
              {amountCollected}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#94a3b8] sm:max-w-[120px] truncate">
              Raised of {target / 1e18} ETH {/* Convert from wei to ether */}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#00000078] leading-[22px]">
              {remainingTime}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#94a3b8] sm:max-w-[120px] truncate">
              Days Left
            </p>
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#334155]">
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#94a3b8] truncate">
            by <span className="text-[#000000]">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
