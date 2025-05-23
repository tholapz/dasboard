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
  Chip,
  Stack,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  IconButton
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
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
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  AttachMoney as AttachMoneyIcon,
  ShowChart as ShowChartIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { forecastData, rooms } from '../../../data/mockData';
import { format, addDays } from 'date-fns';
import { RoomType } from '../../../types';

/**
 * AI-driven Forecasting component for predictive analytics
 */
const Forecasting: React.FC = () => {
  const [forecastPeriod, setForecastPeriod] = useState<string>('14');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(70);
  
  // Filter forecast data based on forecast period
  const days = parseInt(forecastPeriod, 10);
  const filteredForecastData = forecastData.slice(0, days);
  
  // Filter forecast data by confidence threshold
  const highConfidencePredictions = filteredForecastData.filter(
    item => item.confidenceScore * 100 >= confidenceThreshold
  );
  
  // Calculate average metrics
  const avgOccupancy = filteredForecastData.reduce((sum, item) => sum + item.predictedOccupancy, 0) / filteredForecastData.length;
  const avgRevenue = filteredForecastData.reduce((sum, item) => sum + item.predictedRevenue, 0) / filteredForecastData.length;
  const avgStaffing = filteredForecastData.reduce((sum, item) => sum + item.recommendedStaffing, 0) / filteredForecastData.length;
  
  // All unique maintenance needs
  const allMaintenanceNeeds = new Set<string>();
  filteredForecastData.forEach(item => {
    item.predictedMaintenanceNeeds.forEach(need => allMaintenanceNeeds.add(need));
  });
  
  // Count occurrences of each maintenance need
  const maintenanceNeeds: { name: string; count: number }[] = [];
  allMaintenanceNeeds.forEach(need => {
    const count = filteredForecastData.reduce((sum, item) => 
      sum + (item.predictedMaintenanceNeeds.includes(need) ? 1 : 0), 0
    );
    maintenanceNeeds.push({ name: need, count });
  });
  
  // Sort maintenance needs by frequency
  maintenanceNeeds.sort((a, b) => b.count - a.count);
  
  // Prepare chart data for occupancy forecast
  const occupancyChartData = filteredForecastData.map(item => ({
    date: format(item.date, 'MM/dd'),
    occupancy: item.predictedOccupancy,
    revenue: item.predictedRevenue,
    staffing: item.recommendedStaffing,
    confidence: item.confidenceScore
  }));
  
  // Calculate optimal pricing suggestions by room type
  const pricingSuggestions = Object.values(RoomType).map(roomType => {
    // Base room price
    let basePrice: number;
    switch(roomType) {
      case RoomType.STANDARD:
        basePrice = 120;
        break;
      case RoomType.DELUXE:
        basePrice = 180;
        break;
      case RoomType.SUITE:
        basePrice = 250;
        break;
      case RoomType.EXECUTIVE:
        basePrice = 300;
        break;
      case RoomType.PRESIDENTIAL:
        basePrice = 550;
        break;
      default:
        basePrice = 150;
    }
    
    // Calculate optimal price based on predicted occupancy
    const avgPredictedOccupancy = avgOccupancy;
    let multiplier = 1.0;
    
    if (avgPredictedOccupancy > 0.8) {
      // High demand - increase price
      multiplier = 1.2;
    } else if (avgPredictedOccupancy < 0.5) {
      // Low demand - decrease price to attract bookings
      multiplier = 0.9;
    }
    
    return {
      roomType,
      currentPrice: basePrice,
      suggestedPrice: Math.round(basePrice * multiplier),
      change: Math.round((multiplier - 1) * 100)
    };
  });
  
  // Handle forecast period change
  const handleForecastPeriodChange = (event: SelectChangeEvent): void => {
    setForecastPeriod(event.target.value);
  };
  
  // Handle confidence threshold change
  const handleConfidenceChange = (_event: Event, newValue: number | number[]): void => {
    setConfidenceThreshold(newValue as number);
  };
  
  // COLORS for charts
  const COLORS = ['#1976d2', '#f50057', '#4caf50', '#ff9800', '#9c27b0'];
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI-Driven Forecasting
        </Typography>
        <Stack direction="row" spacing={1}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="forecast-period-label">Forecast Period</InputLabel>
            <Select
              labelId="forecast-period-label"
              id="forecast-period"
              value={forecastPeriod}
              label="Forecast Period"
              onChange={handleForecastPeriodChange}
            >
              <MenuItem value="7">Next 7 days</MenuItem>
              <MenuItem value="14">Next 14 days</MenuItem>
              <MenuItem value="30">Next 30 days</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
          >
            Refresh Forecast
          </Button>
        </Stack>
      </Box>
      
      <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
        <Typography variant="body2">
          Our AI forecasting models analyze historical booking patterns, seasonal trends, local events, and market conditions to predict future demand and revenue. Predictions with confidence scores below your threshold ({confidenceThreshold}%) are highlighted as less reliable.
        </Typography>
      </Alert>
      
      {/* Forecast Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  Avg. Occupancy Forecast
                </Typography>
                <ShowChartIcon color="primary" />
              </Box>
              <Typography variant="h4" component="div">
                {(avgOccupancy * 100).toFixed(1)}%
              </Typography>
              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={avgOccupancy * 100} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                  }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Next {days} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  Avg. Revenue Forecast
                </Typography>
                <AttachMoneyIcon color="primary" />
              </Box>
              <Typography variant="h4" component="div">
                ${Math.round(avgRevenue).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Per day
              </Typography>
              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500, mt: 0.5 }}>
                +{Math.round((avgRevenue / 3000 - 1) * 100)}% vs. last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  Recommended Staffing
                </Typography>
                <PersonIcon color="primary" />
              </Box>
              <Typography variant="h4" component="div">
                {Math.round(avgStaffing)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Staff members needed
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Based on predicted occupancy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  Maintenance Alerts
                </Typography>
                <BuildIcon color="primary" />
              </Box>
              <Typography variant="h4" component="div">
                {maintenanceNeeds.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Predicted maintenance needs
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {maintenanceNeeds.length > 0 ? 
                  `Most urgent: ${maintenanceNeeds[0]?.name}` : 
                  'No urgent maintenance predicted'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Confidence Threshold Slider */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Confidence Threshold
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Adjust the minimum confidence level for predictions to be considered reliable
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={confidenceThreshold}
              onChange={handleConfidenceChange}
              aria-labelledby="confidence-threshold-slider"
              valueLabelDisplay="auto"
              step={5}
              marks
              min={50}
              max={95}
            />
          </Grid>
          <Grid item>
            <Typography variant="body1" fontWeight="bold">
              {confidenceThreshold}%
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <InfoIcon fontSize="small" color="info" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {highConfidencePredictions.length} out of {filteredForecastData.length} predictions meet this threshold
          </Typography>
        </Box>
      </Paper>
      
      <Grid container spacing={4}>
        {/* Occupancy & Revenue Forecast Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Occupancy & Revenue Forecast
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Predicted daily occupancy and revenue for the next {days} days
            </Typography>
            
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={occupancyChartData}
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
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  domain={[0, 1]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number, name) => {
                    if (name === 'occupancy') {
                      return [`${(value * 100).toFixed(1)}%`, 'Occupancy'];
                    } else if (name === 'confidence') {
                      return [`${(value * 100).toFixed(0)}%`, 'Confidence'];
                    } else if (name === 'revenue') {
                      return [`$${value.toLocaleString()}`, 'Revenue'];
                    } else {
                      return [value, name];
                    }
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="#1976d2" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                  name="occupancy"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f50057" 
                  name="revenue"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#4caf50" 
                  strokeDasharray="5 5"
                  name="confidence"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Pricing Recommendations */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Dynamic Pricing Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              AI-suggested price adjustments based on demand forecast
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room Type</TableCell>
                    <TableCell align="right">Current</TableCell>
                    <TableCell align="right">Suggested</TableCell>
                    <TableCell align="right">Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pricingSuggestions.map((suggestion, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {suggestion.roomType}
                      </TableCell>
                      <TableCell align="right">${suggestion.currentPrice}</TableCell>
                      <TableCell align="right">${suggestion.suggestedPrice}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${suggestion.change > 0 ? '+' : ''}${suggestion.change}%`} 
                          color={suggestion.change > 0 ? 'success' : suggestion.change < 0 ? 'error' : 'default'} 
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Pricing Strategy Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Based on {(avgOccupancy * 100).toFixed(0)}% forecasted occupancy rate
            </Typography>
            
            <Alert 
              severity={avgOccupancy > 0.8 ? 'success' : avgOccupancy < 0.5 ? 'warning' : 'info'} 
              sx={{ mb: 2 }}
            >
              {avgOccupancy > 0.8 
                ? 'High demand expected. Opportunity to increase rates.' 
                : avgOccupancy < 0.5 
                  ? 'Low demand forecasted. Consider promotions or rate discounts.' 
                  : 'Moderate demand expected. Maintain standard pricing.'}
            </Alert>
            
            <Button 
              fullWidth 
              variant="contained" 
              color="primary"
              startIcon={<AttachMoneyIcon />}
            >
              Apply Recommendations
            </Button>
          </Paper>
        </Grid>
        
        {/* Staffing & Maintenance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Staffing & Maintenance Forecast
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Recommended Daily Staffing
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Staff required based on predicted occupancy
                </Typography>
                
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={occupancyChartData.slice(0, 7)}
                    margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="staffing" fill="#1976d2" name="Recommended Staff" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Predicted Maintenance Needs
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upcoming maintenance requirements
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Maintenance Type</TableCell>
                        <TableCell align="right">Frequency</TableCell>
                        <TableCell align="right">Priority</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {maintenanceNeeds.map((need, index) => (
                        <TableRow key={index}>
                          <TableCell>{need.name}</TableCell>
                          <TableCell align="right">{need.count} times</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={index < 2 ? 'High' : index < 4 ? 'Medium' : 'Low'} 
                              color={index < 2 ? 'error' : index < 4 ? 'warning' : 'success'} 
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Forecasting;
