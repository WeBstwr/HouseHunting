export const mockAccountIds = {
  tenant: 'mock-tenant-1',
  landlordA: 'mock-landlord-1',
  landlordB: 'mock-landlord-2',
  agent: 'mock-agent-1',
}

export const mockAccounts = [
  { id: mockAccountIds.tenant, name: 'Amina Wanjiku', email: 'tenant1@househunting.test', password: 'HouseHunting123', role: 'tenant' },
  { id: mockAccountIds.landlordA, name: 'Brian Otieno', email: 'landlord1@househunting.test', password: 'HouseHunting123', role: 'landlord' },
  { id: mockAccountIds.landlordB, name: 'Caroline Njeri', email: 'landlord2@househunting.test', password: 'HouseHunting123', role: 'landlord' },
  { id: mockAccountIds.agent, name: 'David Mwangi', email: 'agent1@househunting.test', password: 'HouseHunting123', role: 'agent' },
]
