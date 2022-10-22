import { useContext, useMemo } from 'react';
import { Chart } from 'react-charts';
import { AppContext } from '../ContextProvider';


const PoolCharts = () => {
  const { state } = useContext(AppContext);
  const { poolHashRate } = state;

  const primaryAxis = useMemo(() => ({
    getValue: i => i.ts,
    scaleType: 'time',
  }), []);

  const secondaryAxes = useMemo(() => [{
    getValue: i => i.hs,
    elementType: 'area',
    scaleType: 'linear',
    stacked: false,
  }], []);

  return (
    <div className="chart-container">
      <Chart
        options={{
          data: poolHashRate,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
}

export default PoolCharts;
