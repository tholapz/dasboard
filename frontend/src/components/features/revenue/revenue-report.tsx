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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Stack
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  GetApp as GetAppIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { dailyRevenue } from '../../../data/mockData';
import { format, subDays, subMonths, isAfter } from 'date-fns';

/**
 * Daily Revenue Reporting component for tracking and visualizing revenue data
 */
const RevenueReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('30');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(7);
  
  // Calculate date range based on selected time range
  const today = new Date();
  let startDate: Date;
  
  switch (timeRange) {
    case '7':
      startDate = subDays(today, 7);
      break;
    case '30':
      startDate = subDays(today, 30);
      break;
    case '90':
      startDate = subDays(today, 90);
      break;
    case '12':
      startDate = subMonths(today, 12);
      break;
    default:
      startDate = subDays(today, 30);
  }
  
  // Filter revenue data based on selected time range
  const filteredRevenueData = dailyRevenue.filter(
    item => isAfter(item.date, startDate) || item.date.getTime() === startDate.getTime()
  );
  
  // Calculate summary statistics
  const totalRevenue = filteredRevenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const avgDailyRevenue = totalRevenue / filteredRevenueData.length;
  const roomRevenue = filteredRevenueData.reduce((sum, item) => sum + item.roomRevenue, 0);
  const additionalRevenue = filteredRevenueData.reduce((sum, item) => sum + item.additionalServices, 0);
  const avgOccupancy = filteredRevenueData.reduce((sum, item) => sum + item.occupancyRate, 0) / filteredRevenueData.length;
  
  // Prepare chart data
  const revenueChartData = filteredRevenueData.map(item => ({
    date: format(item.date, 'MM/dd'),
    totalRevenue: item.totalRevenue,
    roomRevenue: item.roomRevenue,
    additionalServices: item.additionalServices,
    occupancyRate: item.occupancyRate
  }));
  
  // Revenue breakdown data for pie chart
  const revenueBreakdown = [
    { name: 'Room Revenue', value: roomRevenue },
    { name: 'Additional Services', value: additionalRevenue }
  ];
  
  // Colors for pie chart
  const COLORS = ['#1976d2', '#f50057'];
  
  // Handle time range change
  const handleTimeRangeChange = (event: SelectChangeEvent): void => {
    setTimeRange(event.target.value);
  };
  
  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Calculate revenue trend (percentage change)
  const calculateRevenueTrend = (): number => {
    if (filteredRevenueData.length < 2) return 0;
    
    // Split the data in half and compare averages
    const midpoint = Math.floor(filteredRevenueData.length / 2);
    const recentHalf = filteredRevenueData.slice(midpoint);
    const previousHalf = filteredRevenueData.slice(0, midpoint);
    
    const recentAvg = recentHalf.reduce((sum, item) => sum + item.totalRevenue, 0) / recentHalf.length;
    const previousAvg = previousHalf.reduce((sum, item) => sum + item.totalRevenue, 0) / previousHalf.length;
    
    return ((recentAvg - previousAvg) / previousAvg) * 100;
  };
  
  const revenueTrend = calculateRevenueTrend();
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Revenue Report
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            startIcon={<GetAppIcon />}
          >
            Export
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EmailIcon />}
          >
            Share
          </Button>
        </Stack>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" component="div">
                ${totalRevenue.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {revenueTrend > 0 ? (
                  <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography 
                  variant="body2"
                  color={revenueTrend > 0 ? 'success.main' : 'error.main'}
                >
                  {Math.abs(revenueTrend).toFixed(1)}% {revenueTrend > 0 ? 'increase' : 'decrease'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Average Daily Revenue
              </Typography>
              <Typography variant="h4" component="div">
                ${Math.round(avgDailyRevenue).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per day
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Room Revenue
              </Typography>
              <Typography variant="h4" component="div">
                ${roomRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((roomRevenue / totalRevenue) * 100).toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Average Occupancy
              </Typography>
              <Typography variant="h4" component="div">
                {(avgOccupancy * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                During period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Revenue Trends
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="time-range-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  id="time-range"
                  value={timeRange}
                  label="Time Range"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 90 days</MenuItem>
                  <MenuItem value="12">Last 12 months</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={revenueChartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  domain={[0, 1]}
                />
                <Tooltip 
                  formatter={(value: number, name) => {
                    if (name === 'occupancyRate') {
                      return [`${(value * 100).toFixed(1)}%`, 'Occupancy Rate'];
                    }
                    return [`$${value.toLocaleString()}`, name === 'totalRevenue' ? 'Total Revenue' : 
                           name === 'roomRevenue' ? 'Room Revenue' : 'Additional Services'];
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Total Revenue"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="roomRevenue" 
                  stroke="#1976d2" 
                  name="Room Revenue"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="additionalServices" 
                  stroke="#f50057" 
                  name="Additional Services"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="occupancyRate" 
                  stroke="#4caf50" 
                  name="Occupancy Rate"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Revenue Breakdown
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Revenue Sources
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: COLORS[0], borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Room Revenue</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  ${roomRevenue.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: COLORS[1], borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Additional Services</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  ${additionalRevenue.toLocaleString()}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Top Earning Days
            </Typography>
            
            {filteredRevenueData
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .slice(0, 3)
              .map((day, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {format(day.date, 'MMM dd, yyyy')}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    ${day.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
              ))
            }
          </Paper>
        </Grid>
      </Grid>
      
      <Paper sx={{ mt: 4, p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Daily Revenue Details
          </Typography>
          <IconButton>
            <DateRangeIcon />
          </IconButton>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Room Revenue</TableCell>
                <TableCell align="right">Additional Services</TableCell>
                <TableCell align="right">Total Revenue</TableCell>
                <TableCell align="right">Occupancy Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRevenueData
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {format(row.date, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell align="right">${row.roomRevenue.toLocaleString()}</TableCell>
                    <TableCell align="right">${row.additionalServices.toLocaleString()}</TableCell>
                    <TableCell align="right">${row.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell align="right">{(row.occupancyRate * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[7, 14, 30]}
          component="div"
          count={filteredRevenueData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default RevenueReport;
