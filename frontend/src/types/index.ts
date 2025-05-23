/**
 * Type definitions for the hotel dashboard application
 */

export interface Room {
  readonly id: string;
  readonly number: string;
  readonly type: RoomType;
  readonly floor: number;
  readonly capacity: number;
  readonly amenities: string[];
  readonly basePrice: number;
  readonly status: RoomStatus;
  readonly maintenanceHistory: MaintenanceRecord[];
  readonly lastCleaned: Date;
}

export enum RoomType {
  STANDARD = 'Standard',
  DELUXE = 'Deluxe',
  SUITE = 'Suite',
  EXECUTIVE = 'Executive',
  PRESIDENTIAL = 'Presidential'
}

export enum RoomStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  MAINTENANCE = 'Maintenance',
  CLEANING = 'Cleaning',
  RESERVED = 'Reserved'
}

export interface MaintenanceRecord {
  readonly id: string;
  readonly date: Date;
  readonly issue: string;
  readonly resolvedBy?: string;
  readonly cost: number;
  readonly status: 'Pending' | 'In Progress' | 'Completed';
}

export interface Booking {
  readonly id: string;
  readonly roomId: string;
  readonly guestName: string;
  readonly checkIn: Date;
  readonly checkOut: Date;
  readonly totalPrice: number;
  readonly paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  readonly specialRequests?: string;
}

export interface DailyRevenue {
  readonly date: Date;
  readonly roomRevenue: number;
  readonly additionalServices: number;
  readonly totalRevenue: number;
  readonly occupancyRate: number;
}

export interface PriceHistory {
  readonly date: Date;
  readonly roomType: RoomType;
  readonly price: number;
  readonly specialEvent?: string;
}

export interface ForecastData {
  readonly date: Date;
  readonly predictedOccupancy: number;
  readonly predictedRevenue: number;
  readonly recommendedPrice: number;
  readonly predictedMaintenanceNeeds: string[];
  readonly recommendedStaffing: number;
  readonly confidenceScore: number;
}
