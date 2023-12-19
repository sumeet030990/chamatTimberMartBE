/**
 * Format Data for Order
 * @param savedUser
 * @param orderData
 * @returns
 */
const formatOrderDetailData = (orderResult: any, orderData: any) => {
  const { items } = orderData;
  const result: any = [];

  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    const orderDetailsData = {
      order_id: orderResult.id,
      item_id: element.item[0].value,
      item_object: element.item[0] || {},
      size: parseFloat(element.size),
      piece: parseFloat(element.piece),
      rate: parseFloat(element.rate),
      remark: element.remark,
      sub_items: element.subItems,
    };

    result.push(orderDetailsData);
  }

  return result;
};

export default {
  formatOrderDetailData,
};
