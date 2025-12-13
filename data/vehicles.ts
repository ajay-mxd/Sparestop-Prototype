import { Vehicle } from '../types';

export const vehicles: Vehicle[] = [
  // Maruti Suzuki
  { id: 'v1', make: 'Maruti Suzuki', model: 'Swift', yearRange: '2018-2024', variants: ['Petrol VXi', 'Diesel VDi'] },
  { id: 'v2', make: 'Maruti Suzuki', model: 'Baleno', yearRange: '2019-2024', variants: ['Petrol Alpha', 'Diesel Delta'] },
  { id: 'v3', make: 'Maruti Suzuki', model: 'Alto', yearRange: '2017-2023', variants: ['LXi', 'VXi'] },
  
  // Hyundai
  { id: 'v4', make: 'Hyundai', model: 'i20', yearRange: '2018-2024', variants: ['Sportz', 'Asta'] },
  { id: 'v5', make: 'Hyundai', model: 'Creta', yearRange: '2020-2024', variants: ['EX', 'SX'] },
  
  // Honda
  { id: 'v6', make: 'Honda', model: 'City', yearRange: '2017-2024', variants: ['V', 'VX'] },
  { id: 'v7', make: 'Honda', model: 'Amaze', yearRange: '2018-2024', variants: ['VX', 'S'] },
  
  // Tata
  { id: 'v8', make: 'Tata', model: 'Nexon', yearRange: '2020-2024', variants: ['XM', 'XZ+'] },
  { id: 'v9', make: 'Tata', model: 'Altroz', yearRange: '2020-2024', variants: ['XE', 'XT'] },
  
  // Mahindra
  { id: 'v10', make: 'Mahindra', model: 'XUV300', yearRange: '2019-2024', variants: ['W6', 'W8'] },
];