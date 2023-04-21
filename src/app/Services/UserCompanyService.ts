import UserCompanyRepository from '../Repositories/UserCompanyRepository';

const storeUserCompanyMappingData = (data: any, savedUser: any) => {
  const userCompanyData = data.map((userCompany: any) => {
    return { user_id: savedUser.id, company_id: userCompany.value };
  });

  return UserCompanyRepository.storeUserCompanyMappingData(userCompanyData, savedUser);
};

export default { storeUserCompanyMappingData };
