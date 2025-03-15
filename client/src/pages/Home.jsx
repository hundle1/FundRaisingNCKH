import React, { useState, useEffect } from 'react';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  // Sort campaigns by title (alphabetically)
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
    return 0;
  });

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={sortedCampaigns} // Pass sorted campaigns to the DisplayCampaigns component
    />
  );
};

export default Home;
