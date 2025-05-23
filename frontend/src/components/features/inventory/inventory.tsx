import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Divider,
  useTheme
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { rooms } from '../../../data/mockData';
import { Room, RoomStatus, RoomType } from '../../../types';

/**
 * Hotel Inventory component displaying room inventory data
 */
const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const theme = useTheme();

  // Summary statistics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(room => room.status === RoomStatus.AVAILABLE).length;
  const occupiedRooms = rooms.filter(room => room.status === RoomStatus.OCCUPIED).length;
  const maintenanceRooms = rooms.filter(room => room.status === RoomStatus.MAINTENANCE).length;
  
  // Filter rooms based on search term and selected tab
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      searchTerm === '' || 
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor.toString().includes(searchTerm);
      
    if (tabValue === 0) return matchesSearch; // All rooms
    if (tabValue === 1) return matchesSearch && room.status === RoomStatus.AVAILABLE;
    if (tabValue === 2) return matchesSearch && room.status === RoomStatus.OCCUPIED;
    if (tabValue === 3) return matchesSearch && room.status === RoomStatus.MAINTENANCE;
    if (tabValue === 4) return matchesSearch && room.status === RoomStatus.CLEANING;
    if (tabValue === 5) return matchesSearch && room.status === RoomStatus.RESERVED;
    
    return matchesSearch;
  });

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: 'number', headerName: 'Room #', width: 100 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'floor', headerName: 'Floor', width: 100, type: 'number' },
    { field: 'capacity', headerName: 'Capacity', width: 120, type: 'number' },
    { 
      field: 'basePrice', 
      headerName: 'Base Price', 
      width: 150,
      type: 'number',
      valueFormatter: (params) => `$${params.value}`
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params: GridRenderCellParams<Room, string>) => {
        const status = params.value as RoomStatus;
        let color: 'success' | 'error' | 'warning' | 'info' | 'default' = 'default';
        
        switch (status) {
          case RoomStatus.AVAILABLE:
            color = 'success';
            break;
          case RoomStatus.OCCUPIED:
            color = 'info';
            break;
          case RoomStatus.MAINTENANCE:
            color = 'warning';
            break;
          case RoomStatus.CLEANING:
            color = 'info';
            break;
          case RoomStatus.RESERVED:
            color = 'default';
            break;
        }
        
        return <Chip label={status} color={color} size="small" />;
      }
    },
    { 
      field: 'amenities', 
      headerName: 'Amenities', 
      width: 300,
      renderCell: (params: GridRenderCellParams<Room, string[]>) => {
        const amenities = params.value || [];
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {amenities.slice(0, 3).map((amenity, index) => (
              <Chip key={index} label={amenity} size="small" variant="outlined" />
            ))}
            {amenities.length > 3 && (
              <Chip label={`+${amenities.length - 3}`} size="small" variant="outlined" />
            )}
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: () => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" color="primary">
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hotel Inventory
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          Add Room
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Rooms
              </Typography>
              <Typography variant="h4" component="div">
                {totalRooms}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All room types
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'success.light' }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Available Rooms
              </Typography>
              <Typography variant="h4" component="div">
                {availableRooms}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ready for booking
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'info.light' }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Occupied Rooms
              </Typography>
              <Typography variant="h4" component="div">
                {occupiedRooms}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently in use
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, bgcolor: 'warning.light' }} className="card-hover">
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Maintenance Rooms
              </Typography>
              <Typography variant="h4" component="div">
                {maintenanceRooms}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Under maintenance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search rooms..."
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            startIcon={<FilterListIcon />}
            variant="outlined"
          >
            Filters
          </Button>
        </Box>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 100
            }
          }}
        >
          <Tab label="All" />
          <Tab label="Available" />
          <Tab label="Occupied" />
          <Tab label="Maintenance" />
          <Tab label="Cleaning" />
          <Tab label="Reserved" />
        </Tabs>
        
        <Divider />
        
        <DataGrid
          rows={filteredRooms}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: 'transparent'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.background.default,
              borderRadius: 1
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: theme.palette.background.default
            }
          }}
        />
      </Paper>
      
      <Typography variant="subtitle2" color="text.secondary">
        Showing {filteredRooms.length} of {totalRooms} rooms
      </Typography>
    </Box>
  );
};

export default Inventory;
