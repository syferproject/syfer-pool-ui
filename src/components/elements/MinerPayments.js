import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useContext, useMemo, useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { CCXExplorerLink, FormattedAmount, TimeAgo } from '../../helpers/Strings';
import { AppContext } from '../ContextProvider';


const columnHelper = createColumnHelper();
const queryClient = new QueryClient()


const MinerPaymentsData = props => {
  const { address } = props;
  const { actions, state } = useContext(AppContext);
  const { miners } = state;

  const defaultData = useMemo(() => [], [])
  const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  const fetchDataOptions = { address, pageIndex, pageSize };

  const dataQuery = useQuery(
    ['minerPayments', address, fetchDataOptions],
    () => actions.getMinerPayments(address, pageIndex, pageSize),
    {
      enabled: Boolean(miners[address]?.stats?.txnCount),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const columns = [
    columnHelper.accessor('ts', {
      header: () => 'Time',
      cell: info => <TimeAgo time={info.getValue()} />,
    }),
    columnHelper.accessor('pt', {
      header: () => 'Type',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('amount', {
      header: () => 'Amount',
      cell: info => <FormattedAmount amount={info.getValue()} minimumFractionDigits={0} divide />,
    }),
    columnHelper.accessor('txnHash', {
      header: () => 'Transaction Hash',
      cell: info => <CCXExplorerLink hash={info.getValue()} shortHash />,
    }),
    columnHelper.accessor('mixin', {
      header: () => 'Mixin',
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
      <h4>Payments</h4>

      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <BsChevronLeft />
      </button>
      <button
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

const MinerPayments = props => {
  return (
    <QueryClientProvider client={queryClient}>
      <MinerPaymentsData {...props} />
    </QueryClientProvider>
  )
}

export default MinerPayments;
