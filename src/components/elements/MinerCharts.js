import { useMemo, useState } from 'react';
import { Chart } from 'react-charts';


const MinerCharts = props => {
  const { data } = props;

  const [selectedWorkers, setSelectedWorkers] = useState(['global']);

  const selectWorkers = worker => {
    const chartWorkers = selectedWorkers.includes(worker)
      ? selectedWorkers.filter(i => i !== worker)
      : [ ...selectedWorkers, worker ];
    setSelectedWorkers(chartWorkers);
  }

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
    <div>
      <div className="chart-container">
        <Chart
          options={{
            data: data.filter(i => selectedWorkers.includes(i.label)),
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
      <div>
        {data.length > 1 &&
          <ul>
            {data.filter(i => i.label !== 'global').map(worker =>
              <li
                key={worker.label}
                onClick={() => selectWorkers(worker.label)}
              >
                {worker.label}
              </li>
            )}
          </ul>
        }
      </div>
    </div>
  );
}

export default MinerCharts;
