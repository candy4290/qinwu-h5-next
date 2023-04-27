export default function handler(req, res) {
  res.status(200).json({
    data: {
      key: '你拿到数据了',
    },
    msg: '【梓如】您预订的房型价格变动，订单金额由￥546.0变更为￥548，是否继续预订？',
    rc: 1001,
  });
}
