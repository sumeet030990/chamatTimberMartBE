import UserCompanyRepository from '../Repositories/UserCompanyRepository';

const storeUserCompanyMappingData = async (data: any, savedUser: any, prismaTx: any = {}) => {
  const userCompanyData = data.map((userCompany: any) => {
    return { user_id: savedUser.id, company_id: userCompany.value };
  });

  const result = await UserCompanyRepository.storeUserCompanyMappingData(userCompanyData, savedUser, prismaTx);

  return result;
};

export default { storeUserCompanyMappingData };
