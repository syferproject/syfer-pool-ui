import AppContextProvider from './ContextProvider';
import Config from './elements/Config';
import MinerSettings from './elements/MinerSettings';
import MinerStats from './elements/MinerStats';
import NetworkStats from './elements/NetworkStats';
import Payments from './elements/Payments';
import PoolBlocks from './elements/PoolBlocks';
import PoolStats from './elements/PoolStats';


const App = () => (
  <AppContextProvider>
    <Config />
    <NetworkStats />
    <PoolStats />
    <PoolBlocks />
    <Payments />
    <MinerStats />
    <MinerSettings />
  </AppContextProvider>
)

export default App;
