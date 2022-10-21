import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useContext, useMemo, useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { CCXExplorerLink, FormattedAmount, TimeAgo } from '../../helpers/Strings';
import { AppContext } from '../ContextProvider';


const columnHelper = createColumnHelper();
const queryClient = new QueryClient()


const PaymentsData = () => {
  const { actions, state } = useContext(AppContext);
  const { poolStats } = state;

  const defaultData = useMemo(() => [], [])
  const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  const fetchDataOptions = { pageIndex, pageSize };

  const dataQuery = useQuery(
    ['payments', fetchDataOptions],
    () => actions.getPayments(pageIndex, pageSize),
    {
      enabled: Boolean(poolStats.global?.pool_statistics?.totalPayments),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const columns = [
    columnHelper.accessor('ts', {
      header: () => 'Time Sent',
      cell: info => <TimeAgo time={info.getValue() / 1000} />,
    }),
    columnHelper.accessor('hash', {
      header: () => 'Transaction Hash',
      cell: info => <CCXExplorerLink hash={info.getValue()} shortHash />,
    }),
    columnHelper.accessor('value', {
      header: () => 'Amount',
      cell: info => <FormattedAmount
        amount={info.getValue()}
        divide
        minimumFractionDigits={2}
      />,
    }),
    columnHelper.accessor('fee', {
      header: () => 'Fee',
      cell: info => <FormattedAmount
        amount={info.getValue()}
        divide
        minimumFractionDigits={4}
      />,
    }),
    columnHelper.accessor('mixins', {
      header: () => 'Mixin',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('payees', {
      header: () => 'Payees',
      cell: info => info.getValue(),
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
      <h3>Payments</h3>

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

const Payments = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaymentsData />
    </QueryClientProvider>
  )
}

export default Payments;
