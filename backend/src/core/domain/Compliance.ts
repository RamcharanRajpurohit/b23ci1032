export interface ShipCompliance {
  id?: number;
  shipId: string;
  year: number;
  cbGco2eq: number; // Compliance Balance in gCO2eq
  targetIntensity: number;
  actualIntensity: number;
  energyInScope: number;
}

export interface BankEntry {
  id?: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  appliedAmount: number;
  remainingAmount: number;
}

export interface Pool {
  id?: number;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  poolId: number;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}
