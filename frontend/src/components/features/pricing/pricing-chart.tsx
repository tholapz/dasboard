import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Chip,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts';
import { 
  priceHistory, 
  rooms 
} from '../../../data/mockData';
import { PriceHistory, RoomType } from '../../../types';
import { format, subDays, addDays } from 'date-fns';

/**
 * Room Pricing Chart component for visualizing and managing room pricing
 */
const PricingChart: React.FC = () => {
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>(RoomType.STANDARD);
  const [timeRange, setTimeRange] = useState<number>(30); // days
  
  // Calculate date range
  const today = new Date();
  const startDate = subDays(today, timeRange);
  
  // Filter price history by selected room type and time range
  const filteredPriceData = priceHistory.filter(
    item => 
      item.roomType === selectedRoomType && 
      item.date >= startDate && 
      item.date <= today
  );
  
  // Prepare data for charts
  const chartData = filteredPriceData.map(item => ({
    date: format(item.date, 'MM/dd'),
    price: item.price,
    specialEvent: item.specialEvent
  }));
  
  // Calculate stats
  const prices = filteredPriceData.map(item => item.price);
  const avgPrice = prices.length > 0 
    ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) 
    : 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  
  // Occupancy rates based on room type (mock data)
  const occupancyRates = {
    [RoomType.STANDARD]: 0.78,
    [RoomType.DELUXE]: 0.85,
    [RoomType.SUITE]: 0.65,
    [RoomType.EXECUTIVE]: 0.72,
    [RoomType.PRESIDENTIAL]: 0.45
  };
  
  // Comparison data for bar chart (mock data)
  const competitorComparison = [
    { name: 'Your Hotel', price: avgPrice },
    { name: 'Competitor A', price: Math.round(avgPrice * 0.92) },
    { name: 'Competitor B', price: Math.round(avgPrice * 1.15) },
    { name: 'Competitor C', price: Math.round(avgPrice * 0.85) }
  ];
  
  // Handle room type change
  const handleRoomTypeChange = (event: SelectChangeEvent<string>): void => {
    setSelectedRoomType(event.target.value as RoomType);
  };
  
  // Handle time range change
  const handleTimeRangeChange = (event: SelectChangeEvent<number>): void => {
    setTimeRange(event.target.value as number);
  };
  
  // Get upcoming special events for pricing suggestions
  const upcomingEvents = [
    { date: addDays(today, 14), event: 'Local Festival', suggestedIncrease: '15%' },
    { date: addDays(today, 30), event: 'Summer Holiday', suggestedIncrease: '25%' },
    { date: addDays(today, 60), event: 'Conference', suggestedIncrease: '20%' }
  ];
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Room Pricing Chart
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Update Pricing
        </Button>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Average Price
              </Typography>
              <Typography variant="h4" component="div">
                ${avgPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last {timeRange} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Price Range
              </Typography>
              <Typography variant="h4" component="div">
                ${minPrice} - ${maxPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Min - Max
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Occupancy Rate
              </Typography>
              <Typography variant="h4" component="div">
                {Math.round(occupancyRates[selectedRoomType] * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For {selectedRoomType} rooms
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Revenue Potential
              </Typography>
              <Typography variant="h4" component="div">
                ${Math.round(avgPrice * occupancyRates[selectedRoomType] * rooms.filter(r => r.type === selectedRoomType).length * 30)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly estimate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Price History</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="room-type-label">Room Type</InputLabel>
              <Select
                labelId="room-type-label"
                id="room-type"
                value={selectedRoomType}
                label="Room Type"
                onChange={handleRoomTypeChange}
              >
                {Object.values(RoomType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                id="time-range"
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={60}>Last 60 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              domain={[
                (dataMin: number) => Math.floor(dataMin * 0.8),
                (dataMax: number) => Math.ceil(dataMax * 1.2)
              ]}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value}`, 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#1976d2" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Special events are marked with higher prices
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {['Holiday', 'Weekend', 'Promotion'].map((event) => (
              <Chip 
                key={event} 
                label={event} 
                size="small" 
                variant="outlined" 
                color={event === 'Promotion' ? 'success' : event === 'Holiday' ? 'error' : 'primary'} 
              />
            ))}
          </Stack>
        </Box>
      </Paper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Competitor Price Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Average prices for {selectedRoomType} rooms
            </Typography>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={competitorComparison}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => [`$${value}`, 'Price']} />
                <Bar 
                  dataKey="price" 
                  fill="#1976d2" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events & Pricing Suggestions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Plan ahead with dynamic pricing
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Suggested Increase</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingEvents.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(event.date, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{event.event}</TableCell>
                      <TableCell>
                        <Chip 
                          label={event.suggestedIncrease} 
                          color="success" 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined">
                          Apply
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PricingChart;
