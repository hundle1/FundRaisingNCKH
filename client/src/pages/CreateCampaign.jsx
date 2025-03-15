import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    ipfsHashId: '', // Thêm trường ipfsHashId
    target: '', 
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if(exists) {
        setIsLoading(true)
        await createCampaign({ 
          ...form, 
          target: ethers.utils.parseUnits(form.target, 18)
        });
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL');
        setForm({ ...form, image: '' });
      }
    })
  }

  return (
    <div className="bg-[#f0f0f0] flex justify-center items-center flex-col rounded-xl sm:p-10 p-4 shadow-lg border border-gray-300">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#a4a5a5] rounded-lg shadow-md border">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Create a New Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField 
            labelName="Campaign Description *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />

        <FormField 
            labelName="IPFS Hash ID *"
            placeholder="Enter IPFS Hash ID"
            inputType="text"
            value={form.ipfsHashId}
            handleChange={(e) => handleFormFieldChange('ipfsHashId', e)}
          />

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Desired Funding *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField 
            labelName="Campaign End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField 
            labelName="Image URL *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Create Campaign"
              styles="bg-[#34D399]"
            />
          </div>

          <div className="w-full flex justify-start items-center p-4 bg-[#7F9CF5] h-[120px] rounded-lg shadow-md border border-[#5D3FD3]">
            <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
            <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will receive 100% of your desired funding goal</h4>
          </div>
      </form>
    </div>
  )
}

export default CreateCampaign
