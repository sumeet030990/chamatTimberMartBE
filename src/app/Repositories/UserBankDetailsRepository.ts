const addUserBankDetails = async (userData: any, bankDetailsData: any, prismaTx: any = {}) => {
  await prismaTx.user_bank_details.deleteMany({
    where: {
      user_id: userData.id,
    },
  });

  const result = await prismaTx.user_bank_details.createMany({
    data: bankDetailsData,
  });

  return result;
};

export default { addUserBankDetails };
