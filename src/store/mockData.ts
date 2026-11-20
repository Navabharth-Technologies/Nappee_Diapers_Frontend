import { Product, Customer, DeliveryPartner, Order, Coupon } from './types';

export const mockProducts: Product[] = [];
export const mockCustomers: Customer[] = [];
export const mockDeliveryPartners: DeliveryPartner[] = [
  {
    id: 'dp_demo_1',
    name: 'Demo Delivery Partner',
    phone: '8722424304',
    status: 'AVAILABLE',
    activeOrders: 1,
    completedOrders: 5,
    rating: 4.9
  },
  {
    id: 'dp_demo_2',
    name: 'Megharaj',
    phone: '9060605564',
    status: 'AVAILABLE',
    activeOrders: 1,
    completedOrders: 3,
    rating: 4.8
  }
];
export const mockOrders: Order[] = [];
export const mockCoupons: Coupon[] = [];

export const SERVICEABLE_PINCODES = [
  '570001', '570002', '570003', '570004', '570005',
  '570006', '570007', '570008', '570009', '570010',
  '570011', '570012', '570013', '570014', '570015',
  '570016', '570017', '570018', '570019', '570020',
  '570021', '570022', '570023', '570026'
];
