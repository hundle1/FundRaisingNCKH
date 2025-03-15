import { createCampaign, dashboard, logout, payment, profile ,withdraw } from '../assets';
// import { about } from '../assets';
export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'Your campaign',
    imgUrl: payment,
    link: '/Profile',
  },
  {
    name: 'Create campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  {
    name: 'Profile',
    imgUrl: profile,
    link: '/UserProfile',
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    disabled: true,
  },
];
