/**
 *  代理
 */
import { cityAgentRouter } from './city-agent'/*城市代理*/
const cityAgentContainer = () => import('@/pages/city-agent')

export const AgentIndexRouter = {
  path: 'agentIndex',
  component: cityAgentContainer,
  children: [
    cityAgentRouter,
  ]
};
