import { Part } from '../types';

export const parts: Part[] = [
  // Engine
  { id: 'p1', sku: 'BP-2891', name: 'Oil Filter', category: 'Engine', price: 250, compatibility: ['v1', 'v2', 'v4'], stockLevel: 'high', warehouseStock: 150, complexity: 'simple', description: 'High efficiency oil filter for petrol engines.' },
  { id: 'p2', sku: 'OF-4523', name: 'Air Filter', category: 'Engine', price: 350, compatibility: ['v1', 'v2', 'v3', 'v5'], stockLevel: 'medium', warehouseStock: 80, complexity: 'simple', description: 'Clean air intake filter.' },
  { id: 'p3', sku: 'SP-9901', name: 'Spark Plugs Set', category: 'Engine', price: 800, compatibility: ['v1', 'v6', 'v7'], stockLevel: 'medium', warehouseStock: 60, complexity: 'medium', description: 'Set of 4 iridium spark plugs.' },
  { id: 'p4', sku: 'EO-5W30', name: 'Engine Oil 5W-30', category: 'Engine', price: 1200, compatibility: ['Universal'], stockLevel: 'high', warehouseStock: 200, complexity: 'simple', description: 'Synthetic blend engine oil.' },
  
  // Brake
  { id: 'p5', sku: 'BP-FR-01', name: 'Brake Pad Set Front', category: 'Brake System', price: 1500, compatibility: ['v1', 'v2', 'v4'], stockLevel: 'low', warehouseStock: 20, complexity: 'medium', description: 'Ceramic brake pads, low dust.' },
  { id: 'p6', sku: 'BD-FR-02', name: 'Brake Disc Front', category: 'Brake System', price: 2200, compatibility: ['v5', 'v8', 'v10'], stockLevel: 'medium', warehouseStock: 45, complexity: 'medium', description: 'Ventilated front brake disc.' },
  
  // Electrical
  { id: 'p7', sku: 'BAT-35Ah', name: 'Car Battery 35Ah', category: 'Electrical', price: 4500, compatibility: ['v3', 'v9'], stockLevel: 'medium', warehouseStock: 30, complexity: 'medium', description: 'Maintenance free battery.' },
  { id: 'p8', sku: 'ALT-GEN2', name: 'Alternator 90A', category: 'Electrical', price: 8500, compatibility: ['v5', 'v8'], stockLevel: 'low', warehouseStock: 10, complexity: 'complex', description: 'High output alternator.' },
  
  // Cooling
  { id: 'p9', sku: 'RAD-ALM', name: 'Radiator Assembly', category: 'Cooling System', price: 5500, compatibility: ['v1', 'v2'], stockLevel: 'medium', warehouseStock: 25, complexity: 'complex', description: 'Aluminum core radiator.' },
  { id: 'p10', sku: 'WP-GEN1', name: 'Water Pump', category: 'Cooling System', price: 1800, compatibility: ['v4', 'v5'], stockLevel: 'medium', warehouseStock: 40, complexity: 'complex', description: 'Centrifugal water pump.' },

  // Suspension
  { id: 'p11', sku: 'SHK-FR', name: 'Shock Absorber Front', category: 'Suspension', price: 2800, compatibility: ['v8', 'v10'], stockLevel: 'medium', warehouseStock: 50, complexity: 'medium', description: 'Gas filled shock absorber.' },
];

export const partCategories = [
  { id: 'engine', name: 'Engine Parts', icon: 'Wrench' },
  { id: 'brake', name: 'Brake System', icon: 'Disc' },
  { id: 'electrical', name: 'Electrical', icon: 'Zap' },
  { id: 'filters', name: 'Filters', icon: 'Filter' },
  { id: 'cooling', name: 'Cooling', icon: 'Thermometer' },
  { id: 'suspension', name: 'Suspension', icon: 'Activity' },
  { id: 'body', name: 'Body Parts', icon: 'Box' },
  { id: 'lighting', name: 'Lighting', icon: 'Lightbulb' },
];