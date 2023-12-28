/**
 * Format Data for Bill
 * @param savedUser
 * @param billData
 * @returns
 */
const formatBillDetailData = (billResult: any, billData: any) => {
  const { items } = billData;
  const result: any = [];

  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    const billDetailsData = {
      bill_id: billResult.id,
      item_id: element.item[0].value,
      item_object: element.item[0] || {},
      size: parseFloat(element.size),
      piece: parseFloat(element.piece),
      rate: parseFloat(element.rate),
      remark: element.remark,
      sub_items: element.subItems,
    };

    result.push(billDetailsData);
  }

  return result;
};

export default {
  formatBillDetailData,
};
