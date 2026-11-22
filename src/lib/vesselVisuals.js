/**
 * Curated high-resolution maritime vessel photography and specifications
 * for AeroMarine Shipping & Exports container fleet plans.
 */

export const VESSEL_COLLECTION = {
  // Offer Plan
  'Offer Plan - Ocean Freight Express': {
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    type: 'High-Speed Ocean Feeder',
    route: 'Mumbai ⇄ Dubai Express',
    tonnage: '42,000 DWT',
    speed: '23.4 Knots',
    badge: 'High Yield Promo',
    containers: '3,800 TEU',
  },

  // Cargo Carrier A
  'Cargo Carrier A - Coastal Feeder': {
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
    type: 'Coastal Container Vessel',
    route: 'Nhava Sheva ⇄ Colombo',
    tonnage: '28,500 DWT',
    speed: '19.8 Knots',
    badge: 'Popular Route',
    containers: '2,200 TEU',
  },

  // Cargo Carrier B
  'Cargo Carrier B - Regional Line': {
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    type: 'Regional Freight Carrier',
    route: 'Singapore ⇄ Port Klang',
    tonnage: '38,000 DWT',
    speed: '20.5 Knots',
    badge: 'Daily Payout',
    containers: '3,100 TEU',
  },

  // Cargo Carrier C
  'Cargo Carrier C - Transpacific Route': {
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    type: 'Transpacific High-Capacity Carrier',
    route: 'Shanghai ⇄ Los Angeles',
    tonnage: '85,000 DWT',
    speed: '22.0 Knots',
    badge: 'Transoceanic',
    containers: '7,500 TEU',
  },

  // Cargo Carrier D
  'Cargo Carrier D - Heavy Freight Logistics': {
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    type: 'Heavy Industrial Container Vessel',
    route: 'Rotterdam ⇄ Hamburg ⇄ Jebel Ali',
    tonnage: '110,000 DWT',
    speed: '21.2 Knots',
    badge: 'Heavy Cargo',
    containers: '9,800 TEU',
  },

  // Cargo Carrier E
  'Cargo Carrier E - Ultra Large Vessel': {
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=800&q=80',
    type: 'Ultra Large Container Vessel (ULCV)',
    route: 'Shenzhen ⇄ Felixstowe Deep Sea',
    tonnage: '165,000 DWT',
    speed: '22.8 Knots',
    badge: 'Mega Vessel',
    containers: '16,500 TEU',
  },

  // Cargo Carrier F
  'Cargo Carrier F - Global Charter Lease': {
    imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=800&q=80',
    type: 'Global Express Charter Vessel',
    route: 'Hong Kong ⇄ Melbourne ⇄ Sydney',
    tonnage: '140,000 DWT',
    speed: '24.2 Knots',
    badge: 'Express 3-Day',
    containers: '12,000 TEU',
  },

  // Cargo Carrier G
  'Cargo Carrier G - Sovereign Flagship': {
    imageUrl: 'https://images.unsplash.com/photo-1516216628859-9bcceabb84ca?auto=format&fit=crop&w=800&q=80',
    type: 'Sovereign Flagship Cargo Carrier',
    route: 'Global Sovereign Transatlantic',
    tonnage: '210,000 DWT',
    speed: '25.0 Knots',
    badge: 'Maximum Allocation',
    containers: '21,000 TEU',
  },

  // VIP Special
  'VIP Special - Maritime Fast Express': {
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
    type: 'VIP High-Velocity Cargo Runner',
    route: 'Busan ⇄ Tokyo Priority Air-Sea',
    tonnage: '65,000 DWT',
    speed: '26.2 Knots',
    badge: 'VIP Welfare Exclusive',
    containers: '5,200 TEU',
  },

  // VIP Fleet Plan 1
  'VIP Fleet Plan 1 - Pacific Trade Sovereign': {
    imageUrl: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=800&q=80',
    type: 'Pacific Sovereign Liner',
    route: 'Tokyo ⇄ Honolulu ⇄ Oakland',
    tonnage: '92,000 DWT',
    speed: '22.5 Knots',
    badge: '26-Day Stability',
    containers: '8,400 TEU',
  },

  // VIP Fleet Plan 2
  'VIP Fleet Plan 2 - Atlantic Super Carrier': {
    imageUrl: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80',
    type: 'Atlantic Super Carrier Express',
    route: 'New York ⇄ Southampton Direct',
    tonnage: '150,000 DWT',
    speed: '24.5 Knots',
    badge: '3-Day Sprint Return',
    containers: '14,000 TEU',
  },

  // VIP Fleet Plan 3
  'VIP Fleet Plan 3 - Global Sovereign Carrier': {
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    type: 'Global Sovereign Mega Flagship',
    route: 'Panama Canal Sovereign Route',
    tonnage: '220,000 DWT',
    speed: '25.8 Knots',
    badge: 'Premium VIP Tier',
    containers: '24,000 TEU',
  },
};

/**
 * Helper to get vessel visuals for any plan name with guaranteed fallback
 */
export const getVesselData = (planName = '', category = 'regular') => {
  if (VESSEL_COLLECTION[planName]) {
    return VESSEL_COLLECTION[planName];
  }

  // Fallback defaults based on category
  if (category === 'welfare') {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
      type: 'VIP Express Vessel',
      route: 'Priority Transoceanic',
      tonnage: '120,000 DWT',
      speed: '24.5 Knots',
      badge: 'VIP Express',
      containers: '10,000 TEU',
    };
  }

  return {
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    type: 'Ocean Cargo Container Vessel',
    route: 'International Freight Route',
    tonnage: '75,000 DWT',
    speed: '21.5 Knots',
    badge: 'Insured Cargo',
    containers: '6,500 TEU',
  };
};
