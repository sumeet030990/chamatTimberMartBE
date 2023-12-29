const storeUserCompanyMappingData = async (userCompanyData: any, savedUser: any, prismaTx: any = {}) => {
  const deleteResult = await prismaTx.users_company.deleteMany({
    where: {
      user_id: parseInt(savedUser.id),
    },
  });

  const userCompanyResult = await prismaTx.users_company.createMany({
    data: userCompanyData,
  });

  return { deleteResult, userCompanyResult };
};

export default { storeUserCompanyMappingData };
