import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Tabs,
  Tab,
  Button,
  IconButton,
  Divider,
  LinearProgress,
  Stack,
  Badge
} from '@mui/material';
import {
  MeetingRoom as MeetingRoomIcon,
  LocalHotel as LocalHotelIcon,
  Build as BuildIcon,
  CleaningServices as CleaningIcon,
  EventAvailable as EventAvailableIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { rooms, bookings } from '../../../data/mockData';
import { Room, RoomStatus as RoomStatusEnum } from '../../../types';
import { format, addDays, isPast, isToday, isFuture, differenceInDays } from 'date-fns';

/**
 * Room Status Tracking component for monitoring room statuses and maintenance
 */
const RoomStatus: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<number>(0);
  
  // Count rooms by status
  const statusCounts = {
    [RoomStatusEnum.AVAILABLE]: rooms.filter(room => room.status === RoomStatusEnum.AVAILABLE).length,
    [RoomStatusEnum.OCCUPIED]: rooms.filter(room => room.status === RoomStatusEnum.OCCUPIED).length,
    [RoomStatusEnum.MAINTENANCE]: rooms.filter(room => room.status === RoomStatusEnum.MAINTENANCE).length,
    [RoomStatusEnum.CLEANING]: rooms.filter(room => room.status === RoomStatusEnum.CLEANING).length,
    [RoomStatusEnum.RESERVED]: rooms.filter(room => room.status === RoomStatusEnum.RESERVED).length
  };
  
  // Filter rooms based on selected status tab
  const filteredRooms = statusFilter === 0
    ? rooms // All rooms
    : statusFilter === 1
      ? rooms.filter(room => room.status === RoomStatusEnum.AVAILABLE)
      : statusFilter === 2
        ? rooms.filter(room => room.status === RoomStatusEnum.OCCUPIED)
        : statusFilter === 3
          ? rooms.filter(room => room.status === RoomStatusEnum.MAINTENANCE)
          : statusFilter === 4
            ? rooms.filter(room => room.status === RoomStatusEnum.CLEANING)
            : rooms.filter(room => room.status === RoomStatusEnum.RESERVED);
  
  // Get room with active maintenance issues
  const maintenanceRooms = rooms.filter(room => 
    room.status === RoomStatusEnum.MAINTENANCE || 
    room.maintenanceHistory.some(record => record.status !== 'Completed')
  );
  
  // Get rooms that need cleaning (mock data based on lastCleaned date)
  const cleaningNeeded = rooms.filter(room => 
    differenceInDays(new Date(), room.lastCleaned) > 2 && 
    room.status !== RoomStatusEnum.MAINTENANCE && 
    room.status !== RoomStatusEnum.CLEANING
  );
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setStatusFilter(newValue);
  };
  
  // Function to get check-in/check-out status for a room
  const getRoomScheduleInfo = (roomId: string): { checkIn?: Date; checkOut?: Date; guestName?: string } => {
    const booking = bookings.find(b => 
      b.roomId === roomId && 
      (isToday(b.checkIn) || isToday(b.checkOut) || 
       (isPast(b.checkIn) && isFuture(b.checkOut)))
    );
    
    if (booking) {
      return {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guestName: booking.guestName
      };
    }
    
    return {};
  };
  
  // Status icon mapping
  const getStatusIcon = (status: RoomStatusEnum): JSX.Element => {
    switch (status) {
      case RoomStatusEnum.AVAILABLE:
        return <MeetingRoomIcon sx={{ color: 'success.main' }} />;
      case RoomStatusEnum.OCCUPIED:
        return <LocalHotelIcon sx={{ color: 'info.main' }} />;
      case RoomStatusEnum.MAINTENANCE:
        return <BuildIcon sx={{ color: 'warning.main' }} />;
      case RoomStatusEnum.CLEANING:
        return <CleaningIcon sx={{ color: 'info.main' }} />;
      case RoomStatusEnum.RESERVED:
        return <EventAvailableIcon sx={{ color: 'secondary.main' }} />;
      default:
        return <MeetingRoomIcon />;
    }
  };
  
  // Get occupancy rate
  const occupancyRate = (statusCounts[RoomStatusEnum.OCCUPIED] + statusCounts[RoomStatusEnum.RESERVED]) / rooms.length;
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Room Status Tracking
        </Typography>
        <Button variant="contained" color="primary" startIcon={<CleaningIcon />}>
          Schedule Cleaning
        </Button>
      </Box>
      
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Occupancy Status
              </Typography>
              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={occupancyRate * 100} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                    }
                  }} 
                />
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {Math.round(occupancyRate * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current occupancy rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Today's Check-ins
                </Typography>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {bookings.filter(b => isToday(b.checkIn)).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled for today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Today's Check-outs
                </Typography>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <LocalHotelIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {bookings.filter(b => isToday(b.checkOut)).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Departing today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Maintenance Issues
                </Typography>
                <Badge badgeContent={maintenanceRooms.length} color="error">
                  <Avatar sx={{ bgcolor: 'warning.light' }}>
                    <BuildIcon />
                  </Avatar>
                </Badge>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {maintenanceRooms.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rooms with issues
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs and Room List */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={statusFilter} 
          onChange={handleTabChange}
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 120
            }
          }}
        >
          <Tab label={`All Rooms (${rooms.length})`} />
          <Tab label={`Available (${statusCounts[RoomStatusEnum.AVAILABLE]})`} />
          <Tab label={`Occupied (${statusCounts[RoomStatusEnum.OCCUPIED]})`} />
          <Tab label={`Maintenance (${statusCounts[RoomStatusEnum.MAINTENANCE]})`} />
          <Tab label={`Cleaning (${statusCounts[RoomStatusEnum.CLEANING]})`} />
          <Tab label={`Reserved (${statusCounts[RoomStatusEnum.RESERVED]})`} />
        </Tabs>
        
        <Divider />
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {filteredRooms.map((room) => {
            const scheduleInfo = getRoomScheduleInfo(room.id);
            return (
              <React.Fragment key={room.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      {room.status === RoomStatusEnum.MAINTENANCE && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="warning" 
                          startIcon={<BuildIcon />}
                        >
                          View Issue
                        </Button>
                      )}
                      {room.status === RoomStatusEnum.AVAILABLE && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="success" 
                          startIcon={<CheckCircleIcon />}
                        >
                          Book Now
                        </Button>
                      )}
                      {room.status === RoomStatusEnum.OCCUPIED && scheduleInfo.checkOut && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="info" 
                          startIcon={<ScheduleIcon />}
                        >
                          Check-out: {format(scheduleInfo.checkOut, 'MMM dd')}
                        </Button>
                      )}
                      {room.status === RoomStatusEnum.RESERVED && scheduleInfo.checkIn && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="secondary" 
                          startIcon={<EventAvailableIcon />}
                        >
                          Check-in: {format(scheduleInfo.checkIn, 'MMM dd')}
                        </Button>
                      )}
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: 
                          room.status === RoomStatusEnum.AVAILABLE ? 'success.light' :
                          room.status === RoomStatusEnum.OCCUPIED ? 'info.light' :
                          room.status === RoomStatusEnum.MAINTENANCE ? 'warning.light' :
                          room.status === RoomStatusEnum.CLEANING ? 'info.light' :
                          'secondary.light'
                      }}
                    >
                      {getStatusIcon(room.status)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Room {room.number}
                        </Typography>
                        <Chip 
                          label={room.type} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={`Floor ${room.floor}`} 
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          label={room.status} 
                          size="small"
                          color={
                            room.status === RoomStatusEnum.AVAILABLE ? 'success' :
                            room.status === RoomStatusEnum.OCCUPIED ? 'info' :
                            room.status === RoomStatusEnum.MAINTENANCE ? 'warning' :
                            room.status === RoomStatusEnum.CLEANING ? 'info' :
                            'secondary'
                          }
                        />
                        {differenceInDays(new Date(), room.lastCleaned) > 2 && (
                          <Chip 
                            icon={<WarningIcon fontSize="small" />}
                            label="Needs Cleaning" 
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" component="span" color="text.primary">
                          Last cleaned: {format(room.lastCleaned, 'MMM dd, yyyy')}
                        </Typography>
                        {scheduleInfo.guestName && (
                          <Typography variant="body2" component="div" sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon fontSize="small" />
                              Guest: {scheduleInfo.guestName}
                            </Box>
                          </Typography>
                        )}
                        {room.maintenanceHistory.length > 0 && room.maintenanceHistory[0].status !== 'Completed' && (
                          <Typography variant="body2" component="div" color="warning.main" sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <WarningIcon fontSize="small" />
                              {room.maintenanceHistory[0].issue} - {room.maintenanceHistory[0].status}
                            </Box>
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            );
          })}
        </List>
      </Paper>
      
      {/* Maintenance and Cleaning Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Maintenance Alerts
              </Typography>
              {maintenanceRooms.length > 0 ? (
                <List dense>
                  {maintenanceRooms.map((room) => (
                    <ListItem key={room.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.light' }}>
                          <BuildIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Room ${room.number} - ${room.type}`}
                        secondary={
                          room.maintenanceHistory[0]?.issue || 'Scheduled maintenance'
                        }
                      />
                      <Chip 
                        label={room.maintenanceHistory[0]?.status || 'Pending'} 
                        size="small"
                        color="warning"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>No maintenance issues!</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cleaning Schedule
              </Typography>
              {cleaningNeeded.length > 0 ? (
                <List dense>
                  {cleaningNeeded.map((room) => (
                    <ListItem key={room.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'info.light' }}>
                          <CleaningIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Room ${room.number} - ${room.type}`}
                        secondary={`Last cleaned ${differenceInDays(new Date(), room.lastCleaned)} days ago`}
                      />
                      <Button size="small" variant="outlined">
                        Schedule
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>All rooms are clean!</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomStatus;
