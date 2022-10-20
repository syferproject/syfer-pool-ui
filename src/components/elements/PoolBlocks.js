import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useContext, useMemo, useState } from 'react';
import { BsCheck, BsChevronLeft, BsChevronRight, BsUnlockFill, BsX } from 'react-icons/bs';
import { CCXExplorerLink, FormattedAmount, TimeAgo } from '../../helpers/Strings';
import { localePercentage } from '../../helpers/utils';

import { AppContext } from '../ContextProvider';

const columnHelper = createColumnHelper();
const queryClient = new QueryClient()


const PoolBlocksData = () => {
  const { actions, state } = useContext(AppContext);
  const { appSettings, networkStats, poolConfig } = state;

  const defaultData = useMemo(() => [], [])
  const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  const fetchDataOptions = { pageIndex, pageSize };

  const dataQuery = useQuery(
    ['data', fetchDataOptions],
    () => actions.getPoolBlocks(pageIndex, pageSize),
    { keepPreviousData: true }
  );

  const columns = [
    columnHelper.accessor('valid', {
      header: () => 'Valid',
      cell: info => info.getValue() ? <BsCheck className="text-green" /> : <BsX className="text-red" />,
    }),
    columnHelper.accessor('ts', {
      header: () => 'Time Found',
      cell: info => <TimeAgo time={info.getValue() / 1000} />,
    }),
    columnHelper.accessor('value', {
      header: () => 'Reward',
      cell: info => <FormattedAmount
        amount={info.getValue() / Math.pow(10, appSettings.coinDecimals)}
        minimumFractionDigits={0}
        showCurrency={false}
      />,
    }),
    columnHelper.accessor('height', {
      header: () => 'Height',
      cell: info => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('hash', {
      header: () => 'Hash',
      cell: info => <CCXExplorerLink hash={info.getValue()} type="block" shortHash />,
    }),
    columnHelper.accessor('diff', {
      header: () => 'Effort',
      cell: info => {
        const luck = info.row.original.shares / info.getValue();
        const className = luck >= 1 ? 'text-red' : 'text-green';
        return <span className={info.row.original.valid ? className : undefined}>{localePercentage(0).format(luck)}</span>
      },
    }),
    columnHelper.accessor('unlocked', {
      header: () => 'Maturity',
      cell: info => {
        const maturity = poolConfig.maturity_depth - (networkStats.height - info.row.original.height);
        return maturity < 0
          ? <BsUnlockFill />
          : maturity === 0
            ? <div className="loading-bar-container"><div className="loading-bar" /></div>
            : maturity
      },
    }),
    columnHelper.accessor('pool_type', {
      header: () => 'Pool',
      cell: info => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? 0,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div>
      <h3>Pool Blocks</h3>

      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <BsChevronLeft />
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <BsChevronRight />
      </button>

      <span>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>

      <select
        value={table.getState().pagination.pageSize}
        onChange={e => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 25, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>

      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PoolBlocks () {
  return (
    <QueryClientProvider client={queryClient}>
      <PoolBlocksData />
    </QueryClientProvider>
  )
}

export default PoolBlocks;
