import { Retailer } from '../types';

export const retailers: Retailer[] = [
  {
    id: 'r1',
    name: 'AutoParts Hub',
    address: 'Connaught Place, Delhi',
    distance: 2.3,
    phone: '+91 98765 43210',
    coordinates: { lat: 28.6304, lng: 77.2177 },
    inventory: [{ partId: 'p1', quantity: 5 }, { partId: 'p2', quantity: 2 }, { partId: 'p5', quantity: 1 }]
  },
  {
    id: 'r2',
    name: 'SpeedFix Motors',
    address: 'Karol Bagh, Delhi',
    distance: 3.8,
    phone: '+91 98765 12345',
    coordinates: { lat: 28.6520, lng: 77.1915 },
    inventory: [{ partId: 'p4', quantity: 10 }, { partId: 'p7', quantity: 1 }]
  },
  {
    id: 'r3',
    name: 'Prime Auto Solutions',
    address: 'Lajpat Nagar, Delhi',
    distance: 4.5,
    phone: '+91 99999 88888',
    coordinates: { lat: 28.5672, lng: 77.2435 },
    inventory: [{ partId: 'p1', quantity: 0 }, { partId: 'p9', quantity: 2 }]
  },
  {
    id: 'r4',
    name: 'MechZone',
    address: 'Nehru Place, Delhi',
    distance: 5.2,
    phone: '+91 88888 77777',
    coordinates: { lat: 28.5494, lng: 77.2526 },
    inventory: [{ partId: 'p2', quantity: 5 }, { partId: 'p6', quantity: 3 }]
  },
  {
    id: 'r5',
    name: 'CarCare Center',
    address: 'Dwarka, Delhi',
    distance: 7.8,
    phone: '+91 77777 66666',
    coordinates: { lat: 28.5921, lng: 77.0460 },
    inventory: [{ partId: 'p11', quantity: 4 }]
  },
  {
    id: 'r6',
    name: 'Elite Auto Parts',
    address: 'Rohini, Delhi',
    distance: 9.1,
    phone: '+91 66666 55555',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    inventory: []
  }
];