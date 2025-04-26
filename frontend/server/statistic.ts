import { useConstant } from "~/composables/useConstant"
import { useFetchApi } from "~/composables/useFetchApi"

export const statics = async () => {
  const { visitType } = useConstant()
  let totalPrice = 0

  const { data: clientData, error: clientError } = await useFetchApi.get('/clients')
  const { data: checkData, error: checkError } = await useFetchApi.get('/checks')

  if (clientError.value || checkError.value || !clientData.value || !checkData.value) {
    console.error('Ma\'lumotlarni olishda xatolik yuz berdi')
    return []
  }

  const clients = clientData.value
  const checks = checkData.value

  const statistic = clients.map((client: any) => {
    const check = checks.find((c: any) => Number(c.clientId) === Number(client.id))

    const clientTotalPrice = check ? Number(check.totalPrice) : 0
    totalPrice += clientTotalPrice

    return {
      id: client.id,
      fullName: `${client.last_name} ${client.first_name} ${client.middle_name || ''}`.trim(),
      phone: client.phone,
      gender: client.gender,
      visitTypes: client.visitTypes.map((type: string) => visitType(type)),
      totalPrice: clientTotalPrice,
      isPaid: check ? check.isPaid : false,
      create_at: client.create_at
    }
  })

  console.log('total price:', totalPrice)
  console.log('Statistic:', statistic)

  return {
    total:totalPrice,
    statistic:statistic}
}
