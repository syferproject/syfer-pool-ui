import { useMemo } from 'react';
import { Chart } from 'react-charts';


const MinerCharts = props => {
  const { data } = props;

  const primaryAxis = useMemo(() => ({
    getValue: i => i.ts,
    scaleType: 'time',
  }), []);

  const secondaryAxes = useMemo(() => [{
    getValue: i => i.hs,
    elementType: 'area',
    scaleType: 'linear',
  }], []);

  return (
    <div className="chart-container">
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
}

export default MinerCharts;
