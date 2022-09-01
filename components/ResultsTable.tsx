import React from "react";
import { EarthquakeData } from "../types/USGSDataType";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { useTable, useSortBy, usePagination, Column } from "react-table";
import PaginationButton from "./PaginationButton";

const ResultsTable: React.FC<{
  entries: EarthquakeData[];
  toggleSelect: Function;
  selectedRows: { [key: string]: boolean };
}> = ({ entries, toggleSelect, selectedRows }) => {
  const columns: Array<Column> = React.useMemo(() => {
    return [
      {
        Header: "Magnitude",
        id: "magnitude",
        accessor: "properties.mag",
        sortType: "basic",
        sortDescFirst: true,
      },
      {
        Header: "Location",
        accessor: "properties.place",
        disableSortBy: true,
      },
      {
        Header: "Date",
        accessor: "properties.time",
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
      columns,
      data,
      initialState: { sortBy: [{ id: "magnitude", desc: true }] },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <p className="text-center">
        Highlight events on the map by clicking rows in the table.
        <br />
        You can sort events by magnitude or date.
      </p>
      <table
        {...getTableProps()}
        className="text-center w-full border-separate border-spacing-0"
      >
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumn } = column.getHeaderProps(
                    column.getSortByToggleProps({ title: undefined })
                  );
                  return (
                    <th
                      key={key}
                      {...restColumn}
                      className={`${
                        column.canSort ? "hover:text-orange-400" : ""
                      } px-5 py-3 bg-slate-800 text-white transition-[color] duration-200 ease-in border-r border-slate-200 last:border-r-0`}
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
            // row.original has type {}
            // @ts-ignore
            const id = row.original.id;
            return (
              <tr
                key={key}
                {...restRowProps}
                onClick={() => {
                  toggleSelect(id);
                }}
                className={`p-0 cursor-pointer relative transition-[background-color] duration-200 ease-in ${
                  selectedRows[id] ? "bg-green-200" : "bg-white"
                }`}
              >
                {row.cells.map((cell) => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <td
                      key={key}
                      {...restCellProps}
                      className="px-4 py-2 border-r border-b first:border-l border-slate-400"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-row justify-center items-center gap-3">
        <PaginationButton
          condition={canPreviousPage}
          handleClick={() => gotoPage(0)}
        >
          <ChevronDoubleLeftIcon className="h-4" />
        </PaginationButton>
        <PaginationButton
          condition={canPreviousPage}
          handleClick={() => previousPage()}
        >
          <ChevronLeftIcon className="h-4" />
        </PaginationButton>

        <p>
          Page <strong>{pageIndex + 1}</strong> of{" "}
          <strong>{pageOptions.length}</strong>
        </p>
        <PaginationButton
          condition={canNextPage}
          handleClick={() => nextPage()}
        >
          <ChevronRightIcon className="h-4" />
        </PaginationButton>
        <PaginationButton
          condition={canNextPage}
          handleClick={() => gotoPage(pageCount - 1)}
        >
          <ChevronDoubleRightIcon className="h-4" />
        </PaginationButton>
      </div>
      <select
        className="cursor-pointer bg-slate-800 text-white hover:text-orange-400 transition-[color] duration-200 ease-in p-2 rounded-md appearance-none"
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => {
          return (
            <option key={pageSize} value={pageSize} className="text-white">
              Show {pageSize}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default ResultsTable;
