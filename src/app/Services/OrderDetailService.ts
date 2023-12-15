/**
 * Format Data for Order
 * @param savedUser
 * @param orderData
 * @returns
 */
const formatOrderDetailData = (orderData: any) => {
  const { items } = orderData;
  const result: any = [];

  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    const orderDetailsData = {
      item_id: element.item[0].value,
      item_object: element.item[0],
      size: parseFloat(element.size),
      piece: parseFloat(element.piece),
      rate: parseFloat(element.rate),
      remark: parseFloat(element.remark),
      sub_items: parseFloat(element.subItems),
    };

    result.push(orderDetailsData);
  }

  return result;
};

export default {
  formatOrderDetailData,
};
