/**
 *  创建这个文件的初心
 *
 *
 *    想利用平台的用户数量来进行对指定网站或这个网页的百度权重值进行增加
 *
 *    提高网站的SEO的排行
 *
 *    因为我相信叮咚的未来，
 *    也相信所有购买叮咚平台的用户，
 *    也相信每个用户的平台
 *
 *    当我们把所有用户资源进行整合利用的时候，那简直就是不敢想象的
 *
 *    我现在都在幻想着 每天都百万级的用户使用叮咚平台的程序
 *
 *    假设使用叮咚平台程序的用户每天的PV值达到1万以上
 *
 *    我们就可以进行收费
 *
 *    例如 1万PV == 10元 || 一天PV == 100元
 *
 *    TIPS:
 *
 *      该功能不会影响到程序的运行速度
 *
 *      因为iframe访问的是外部链接，请求的也会外部接口
 *
 *
 *
 *    {
 *        说实话 这项目我是真心舍不得
 *
 *        对我来说，这个算得上是一个成功的项目。
 *
 *        我能参与这个项目，我感觉很自豪
 *
 *        2019-06-29
 *        -- hssg 注
 *    }
 *
 *
 *    测试结果
 时间            csdnhssg的访问量
 2019-06-29 11：07            840
 *
 *
 * */

const openWeightValue = false;   //是否开启百度权重值的增加
let hasIframe = false;      // 页面里面是否已有了iframe窗口

const WeightFrame = document.createElement('iframe');
WeightFrame.id = "DdWeightFrame"
WeightFrame.style.position = "fixed";
WeightFrame.style.top = "-99999px";
WeightFrame.style.left = "-999999px";

/**
 *
 *
 *  如果将来你们用上了这个功能，请麻烦你们告知我一声，让我 Happy 一下
 *
 *  向天QQ:809002582
 *
 *  这些连接是hssg的一些博客的链接(当平台没有设置链接的时候，将会去这些默认值)
 *
 *  如果可以的话，我希望你们能帮我保留^_^
 *
 * */
const defaultUrl = []

/**
 *
 *  该方法放在路由里面
 *
 * */
export function ddWeightValue(url) {

  /** 先进行判断是否开启 */
  if (!openWeightValue) return false;

  if (!hasIframe) document.body.append(WeightFrame);

  /** 如果开启了，但是没有url 就进行取默认的url 随机的 */
  if (!url) url = defaultUrl[Math.floor(Math.random() * defaultUrl.length)]

  WeightFrame.src = url;


}


