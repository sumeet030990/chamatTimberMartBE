import UserCompanyRepository from '../Repositories/UserCompanyRepository';

const storeUserCompanyMappingData = (data: any, savedUser: any, prismaTx: any = {}) => {
  const userCompanyData = data.map((userCompany: any) => {
    return { user_id: savedUser.id, company_id: userCompany.value };
  });

  return UserCompanyRepository.storeUserCompanyMappingData(userCompanyData, savedUser, prismaTx);
};

export default { storeUserCompanyMappingData };
