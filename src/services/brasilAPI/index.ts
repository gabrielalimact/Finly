import { BrasilAPI } from '@matheustrres/brasilapi'

const brasilAPI = new BrasilAPI()

export const getAllBanks = async () => {
  try {
    const { data: banks } = await brasilAPI.banks.list({
      itemsPerPage: 10,
      take: 20
    })
    return banks
  } catch (error) {
    console.error('Error fetching banks:', error)
    throw error
  }
}
