export const mockAccountIds = {
  tenant: 'mock-tenant-1',
  landlordA: 'mock-landlord-1',
  landlordB: 'mock-landlord-2',
  agent: 'mock-agent-1',
}

export const mockAccounts = [
  { id: mockAccountIds.tenant, name: 'Tenant One', email: 'tenant1@househunting.test', password: 'HouseHunting123', role: 'tenant' },
  { id: mockAccountIds.landlordA, name: 'Landlord One', email: 'landlord1@househunting.test', password: 'HouseHunting123', role: 'landlord' },
  { id: mockAccountIds.landlordB, name: 'Landlord Two', email: 'landlord2@househunting.test', password: 'HouseHunting123', role: 'landlord' },
  { id: mockAccountIds.agent, name: 'Agent One', email: 'agent1@househunting.test', password: 'HouseHunting123', role: 'agent' },
]
