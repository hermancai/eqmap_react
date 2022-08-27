import React from "react";
import MarkerDetails from "../types/CustomMarkerType";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { useTable, useSortBy, usePagination, Column } from "react-table";

// TODO: stop full table rerender when selecting row
// TODO: try centering table columns

const ResultsTable: React.FC<{
  entries: MarkerDetails[];
  toggleSelect: Function;
}> = ({ entries, toggleSelect }) => {
  const columns: Array<Column> = React.useMemo(() => {
    return [
      {
        Header: "Magnitude",
        id: "magnitude",
        accessor: "details.properties.mag",
        sortType: "basic",
        sortDescFirst: true,
      },
      {
        Header: "Location",
        accessor: "details.properties.place",
        disableSortBy: true,
      },
      {
        Header: "Date",
        accessor: "details.properties.time",
        sortType: "basic",
        Cell: ({ value }) => <p>{new Date(value).toLocaleString()}</p>,
      },
    ];
  }, []);

  const data = React.useMemo(() => entries, [entries]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: columns,
      data: data,
      initialState: { sortBy: [{ id: "magnitude", desc: true }] },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <p className="text-center">
        Highlight events on the map by clicking on rows in the table.
        <br />
        You can sort events by magnitude or date.
      </p>
      <table
        {...getTableProps()}
        className="text-center border-collapse border-none w-full"
      >
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getHeaderProps(
                    column.getSortByToggleProps()
                  );
                  return (
                    <th
                      key={key}
                      {...restColumn}
                      className="px-5 py-3 bg-slate-800 text-white"
                    >
                      <div className="flex flex-row flex-nowrap items-end gap-2 justify-center">
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ChevronDownIcon className="h-5" />
                            ) : (
                              <ChevronUpIcon className="h-5" />
                            )
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr
                key={key}
                {...restRowProps}
                // row.original has type {}. Not sure how to fix
                // @ts-ignore
                onClick={() => toggleSelect(row.original.id)}
                className={`relative transition-[background-color] duration-200 ease-in ${
                  // @ts-ignore
                  row.original.selected ? "bg-green-200" : "bg-white"
                }`}
              >
                {row.cells.map((cell) => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...restCellProps} className="px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
                <span className="w-full h-full top-0 left-0 absolute border-l border-r border-b hover:border-2 hover:border-t-2 hover:border-slate-800"></span>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-row justify-center items-center gap-3">
        <button
          className={`${
            canPreviousPage ? "bg-slate-800" : "bg-slate-500"
          } text-white p-2 rounded-md`}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <ChevronDoubleLeftIcon className="h-4" />
        </button>
        <button
          className={`${
            canPreviousPage ? "bg-slate-800" : "bg-slate-500"
          } text-white p-2 rounded-md`}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <ChevronLeftIcon className="h-4" />
        </button>
        <p>
          Page <strong>{pageIndex + 1}</strong> of{" "}
          <strong>{pageOptions.length}</strong>
        </p>
        <button
          className={`${
            canNextPage ? "bg-slate-800" : "bg-slate-500"
          } text-white p-2 rounded-md`}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <ChevronRightIcon className="h-4" />
        </button>
        <button
          className={`${
            canNextPage ? "bg-slate-800" : "bg-slate-500"
          } text-white p-2 rounded-md`}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <ChevronDoubleRightIcon className="h-4" />
        </button>
      </div>
      <select
        className="cursor-pointer bg-slate-800 text-white p-2 rounded-md appearance-none"
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => {
          return (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default ResultsTable;
