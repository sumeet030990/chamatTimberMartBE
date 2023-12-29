import UserBankDetailsRepository from '../Repositories/UserBankDetailsRepository';

const addUserBankDetails = (userData: any, bankDetailsData: any, prismaTx: any) => {
  const formattedData = bankDetailsData.map((data: any) => {
    return {
      user_id: userData.id,
      bank_name: data.bankName,
      account_name: data.accountName,
      account_number: data.accountNo,
      account_type: data.accountType,
      ifsc_code: data.ifscCode,
      is_primary: data.isPrimary,
    };
  });

  return UserBankDetailsRepository.addUserBankDetails(userData, formattedData, prismaTx);
};

export default { addUserBankDetails };
