import { 
  Room, 
  RoomType, 
  RoomStatus, 
  Booking, 
  DailyRevenue, 
  PriceHistory,
  ForecastData
} from '../types';
import { addDays, subDays, format } from 'date-fns';

const today = new Date();

// Mock rooms data
export const rooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: RoomType.STANDARD,
    floor: 1,
    capacity: 2,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning'],
    basePrice: 120,
    status: RoomStatus.AVAILABLE,
    maintenanceHistory: [
      {
        id: 'm101-1',
        date: subDays(today, 30),
        issue: 'Leaking faucet',
        resolvedBy: 'John Maintenance',
        cost: 75,
        status: 'Completed'
      }
    ],
    lastCleaned: subDays(today, 1)
  },
  {
    id: '2',
    number: '102',
    type: RoomType.STANDARD,
    floor: 1,
    capacity: 2,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning'],
    basePrice: 120,
    status: RoomStatus.OCCUPIED,
    maintenanceHistory: [],
    lastCleaned: subDays(today, 3)
  },
  {
    id: '3',
    number: '201',
    type: RoomType.DELUXE,
    floor: 2,
    capacity: 3,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'],
    basePrice: 180,
    status: RoomStatus.AVAILABLE,
    maintenanceHistory: [],
    lastCleaned: today
  },
  {
    id: '4',
    number: '202',
    type: RoomType.DELUXE,
    floor: 2,
    capacity: 3,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'],
    basePrice: 180,
    status: RoomStatus.RESERVED,
    maintenanceHistory: [],
    lastCleaned: subDays(today, 2)
  },
  {
    id: '5',
    number: '301',
    type: RoomType.SUITE,
    floor: 3,
    capacity: 4,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Kitchen', 'Jacuzzi'],
    basePrice: 250,
    status: RoomStatus.AVAILABLE,
    maintenanceHistory: [],
    lastCleaned: today
  },
  {
    id: '6',
    number: '302',
    type: RoomType.SUITE,
    floor: 3,
    capacity: 4,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Kitchen', 'Jacuzzi'],
    basePrice: 250,
    status: RoomStatus.MAINTENANCE,
    maintenanceHistory: [
      {
        id: 'm302-1',
        date: subDays(today, 2),
        issue: 'Jacuzzi not working',
        cost: 150,
        status: 'In Progress'
      }
    ],
    lastCleaned: subDays(today, 5)
  },
  {
    id: '7',
    number: '401',
    type: RoomType.EXECUTIVE,
    floor: 4,
    capacity: 2,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Office Desk', 'Premium View'],
    basePrice: 300,
    status: RoomStatus.OCCUPIED,
    maintenanceHistory: [],
    lastCleaned: subDays(today, 2)
  },
  {
    id: '8',
    number: '501',
    type: RoomType.PRESIDENTIAL,
    floor: 5,
    capacity: 6,
    amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Full Bar', 'Kitchen', 'Jacuzzi', 'Sauna', 'Private Terrace'],
    basePrice: 550,
    status: RoomStatus.AVAILABLE,
    maintenanceHistory: [],
    lastCleaned: today
  }
];

// Mock bookings data
export const bookings: Booking[] = [
  {
    id: 'b1',
    roomId: '2',
    guestName: 'James Smith',
    checkIn: subDays(today, 2),
    checkOut: addDays(today, 3),
    totalPrice: 600,
    paymentStatus: 'Paid'
  },
  {
    id: 'b2',
    roomId: '4',
    guestName: 'Emma Johnson',
    checkIn: addDays(today, 1),
    checkOut: addDays(today, 5),
    totalPrice: 720,
    paymentStatus: 'Paid',
    specialRequests: 'Late check-out requested'
  },
  {
    id: 'b3',
    roomId: '7',
    guestName: 'Michael Brown',
    checkIn: subDays(today, 1),
    checkOut: addDays(today, 2),
    totalPrice: 900,
    paymentStatus: 'Paid'
  },
  {
    id: 'b4',
    roomId: '5',
    guestName: 'Sophia Williams',
    checkIn: addDays(today, 5),
    checkOut: addDays(today, 10),
    totalPrice: 1250,
    paymentStatus: 'Pending',
    specialRequests: 'Birthday celebration'
  }
];

// Mock daily revenue data
export const dailyRevenue: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(today, 29 - i);
  const isWeekend = [0, 6].includes(date.getDay());
  const baseRevenue = 2500 + Math.random() * 1500;
  const additionalServices = 500 + Math.random() * 800;
  const occupancyRate = 0.6 + (isWeekend ? 0.2 : 0) + Math.random() * 0.2;
  
  return {
    date,
    roomRevenue: Math.round(baseRevenue * (isWeekend ? 1.4 : 1)),
    additionalServices: Math.round(additionalServices),
    totalRevenue: Math.round((baseRevenue * (isWeekend ? 1.4 : 1)) + additionalServices),
    occupancyRate: Number(occupancyRate.toFixed(2))
  };
});

// Mock price history data
export const priceHistory: PriceHistory[] = [];

// Generate price history for each room type over 90 days
Object.values(RoomType).forEach(roomType => {
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
  
  for (let i = 90; i >= 0; i--) {
    const date = subDays(today, i);
    const isWeekend = [0, 6].includes(date.getDay());
    const isHoliday = [
      '12-25', // Christmas
      '01-01', // New Year
      '07-04', // Independence Day
    ].includes(format(date, 'MM-dd'));
    
    let specialEvent: string | undefined;
    let priceMultiplier = 1;
    
    if (isHoliday) {
      specialEvent = 'Holiday';
      priceMultiplier = 1.5;
    } else if (isWeekend) {
      priceMultiplier = 1.25;
    } else if (i % 15 === 0) { // Periodic promotions
      specialEvent = 'Promotion';
      priceMultiplier = 0.9;
    }
    
    const seasonalVariation = Math.sin((date.getMonth() + 1) / 12 * Math.PI) * 0.15;
    const randomVariation = (Math.random() - 0.5) * 0.05;
    
    const finalMultiplier = priceMultiplier * (1 + seasonalVariation + randomVariation);
    const price = Math.round(basePrice * finalMultiplier);
    
    priceHistory.push({
      date,
      roomType,
      price,
      specialEvent
    });
  }
});

// Mock forecast data
export const forecastData: ForecastData[] = Array.from({ length: 30 }, (_, i) => {
  const date = addDays(today, i);
  const isWeekend = [0, 6].includes(date.getDay());
  const isHoliday = [
    '12-25', // Christmas
    '01-01', // New Year
    '07-04', // Independence Day
  ].includes(format(date, 'MM-dd'));
  
  let predictedOccupancy = 0.65 + (isWeekend ? 0.15 : 0);
  if (isHoliday) predictedOccupancy += 0.15;
  
  // Add some randomness
  predictedOccupancy += (Math.random() - 0.5) * 0.1;
  predictedOccupancy = Math.min(Math.max(predictedOccupancy, 0.4), 0.95);
  
  const predictedRevenue = 3000 + (predictedOccupancy * 4000) + (Math.random() * 500);
  const recommendedPrice = {
    [RoomType.STANDARD]: Math.round(120 * (0.9 + predictedOccupancy * 0.5)),
    [RoomType.DELUXE]: Math.round(180 * (0.9 + predictedOccupancy * 0.5)),
    [RoomType.SUITE]: Math.round(250 * (0.9 + predictedOccupancy * 0.5)),
    [RoomType.EXECUTIVE]: Math.round(300 * (0.9 + predictedOccupancy * 0.5)),
    [RoomType.PRESIDENTIAL]: Math.round(550 * (0.9 + predictedOccupancy * 0.5))
  }[RoomType.STANDARD];
  
  // Generate maintenance needs
  const maintenanceNeeds: string[] = [];
  if (i % 7 === 0) maintenanceNeeds.push('Regular HVAC maintenance');
  if (i % 14 === 0) maintenanceNeeds.push('Deep cleaning of common areas');
  if (i % 30 === 0) maintenanceNeeds.push('Plumbing system check');
  if (Math.random() > 0.95) maintenanceNeeds.push('Urgent elevator inspection');
  
  return {
    date,
    predictedOccupancy: Number(predictedOccupancy.toFixed(2)),
    predictedRevenue: Math.round(predictedRevenue),
    recommendedPrice,
    predictedMaintenanceNeeds: maintenanceNeeds,
    recommendedStaffing: Math.ceil(4 + (predictedOccupancy * 6)),
    confidenceScore: Number((0.7 + Math.random() * 0.25).toFixed(2))
  };
});
