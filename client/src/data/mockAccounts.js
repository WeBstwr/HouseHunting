export const mockAccountIds = {
  tenant: 'mock-tenant-1',
  landlordA: 'mock-landlord-1',
  landlordB: 'mock-landlord-2',
  agent: 'mock-agent-1',
}

export const mockAccounts = [
  { id: mockAccountIds.tenant, name: 'Demo Tenant', email: 'tenant1@househunting.test', role: 'tenant' },
  { id: mockAccountIds.landlordA, name: 'Demo Landlord A', email: 'landlord1@househunting.test', role: 'landlord' },
  { id: mockAccountIds.landlordB, name: 'Demo Landlord B', email: 'landlord2@househunting.test', role: 'landlord' },
  { id: mockAccountIds.agent, name: 'Demo Property Agent', email: 'agent1@househunting.test', role: 'agent' },
]
