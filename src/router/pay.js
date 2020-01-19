/**
 * 资讯
 */

const cashierPgae = () => import('@/pages/cashier');


export const cashier = {
  meta: {title: '收银台'},
  name:'cashier',
  path: 'cashier',
  component: cashierPgae
};
