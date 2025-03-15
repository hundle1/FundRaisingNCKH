import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[300px] bg-[#f0f0f0] rounded-lg shadow-md">
      <h4 className="font-epilogue font-bold text-[18px] text-black p-3 rounded-t-[10px] w-full text-center truncate">{value}</h4>
      <p className="font-epilogue font-normal text-[16px] text-[#808191] px-3 py-2 w-full rouned-b-[10px] text-center">{title}</p>
    </div>
  )
}

export default CountBox