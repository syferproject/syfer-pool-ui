import Config from './elements/Config';
import AppContextProvider from './ContextProvider';
import MinerSettings from './elements/MinerSettings';
import MinerStats from './elements/MinerStats';
import NetworkStats from './elements/NetworkStats';
import PoolStats from './elements/PoolStats';


const App = () => (
  <AppContextProvider>
    <Config />
    <NetworkStats />
    <PoolStats />
    <MinerStats />
    <MinerSettings />
  </AppContextProvider>
)

export default App;
