import React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import { useQuery } from 'react-query';
import axios from 'axios';
import { SERVER_URL } from 'config.keys';
import { BookingType } from 'types';
import BookingsList from './BookingsList';
import { TabContext } from '@mui/lab';

const getBookings = async (type: string) => {
  const { data } = await axios.get<BookingType[]>(
    `${SERVER_URL}/api/bookings?type=${type}`,
    {
      withCredentials: true,
    },
  );

  return data;
};

const Bookings = () => {
  const [value, setValue] = React.useState('1');
  const type = value === '1' ? 'upcoming' : value === '2' ? 'pending' : 'past';
  const { data, isLoading } = useQuery(['getBookings', type], () =>
    getBookings(type),
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Typography
        variant="h3"
        fontFamily="inter"
        fontWeight={600}
        paddingBottom={2}>
        Bookings
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Upcoming" value="1" />
            <Tab label="Pending" value="2" />
            <Tab label="Past" value="3" />
          </TabList>
        </TabContext>
      </Box>
      <BookingsList bookings={data} />
    </Box>
  );
};

export default Bookings;
