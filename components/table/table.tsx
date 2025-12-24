"use client";

import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  Row,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "./table-pagination";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Typography } from "../typography/Typography";

export interface TableData {
  id: number;
  [key: string]: string | number;
}

interface TableComponentProps<T> {
  data?: T[];
  loading?: boolean;
  columns: ColumnDef<T>[];
  onRowClick?: (row: Row<T>) => void;
  className?: string;
  containerClassName?: string;
  templateType?: "blank" | "existing";
  ContentActionSheet?: () => React.ReactNode;
  rowCount?: number;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  showPagination?: boolean;
  paginationType?: "infinite-scroll" | "pagination";
  rowClassName?: RowClassName<T>;
}

export type RowClassName<T> =
  | string
  | ((row: Row<T>, index: number) => string | false | null | undefined);

export function Table<T>({
  data = [],
  columns,
  onRowClick,
  className = "",
  loading = false,
  rowCount,
  pagination,
  onPaginationChange,
  showPagination,
  ContentActionSheet,
  containerClassName = "",
  rowClassName = "",
}: TableComponentProps<T>) {
  const isControlled =
    pagination !== undefined && onPaginationChange !== undefined;

  const shouldPaginate = isControlled || showPagination;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    ...(shouldPaginate && {
      getPaginationRowModel: isControlled ? undefined : getPaginationRowModel(),
      manualPagination: isControlled,
      pageCount: isControlled
        ? Math.ceil((rowCount || 0) / (pagination?.pageSize || 10))
        : undefined,
      onPaginationChange: isControlled
        ? (updater) => {
            const newPagination =
              typeof updater === "function"
                ? updater({
                    pageIndex: pagination?.pageIndex,
                    pageSize: pagination?.pageSize,
                  })
                : updater;
            onPaginationChange(newPagination);
          }
        : undefined,
      initialState: !isControlled
        ? {
            pagination: {
              pageSize: 10,
            },
          }
        : undefined,
      state: isControlled
        ? {
            pagination,
          }
        : {},
    }),
  });

  const headersLength = table.getHeaderGroups()[0]?.headers?.length;

  return (
    <div
      className={cn(
        "rounded-md bg-white relative flex flex-col w-full p-4",
        containerClassName
      )}
    >
      {/* ✅ Fixed: Removed p-2, added proper table container */}
      <div className="overflow-x-auto flex-1">
        <TableComponent className={cn("h-full w-full", className)}>
          <TableHeader className="bg-primary-100 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-primary-100 text-primary-500"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 text-left font-medium"
                  >
                    <Typography
                      variant="sm-medium"
                      className="text-primary-600"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Typography>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map(
                (
                  _,
                  i // ✅ Fixed skeleton count
                ) => (
                  <TableRow key={`skeleton-${i}`} className="border-b">
                    {Array.from({ length: headersLength }).map((_, index) => (
                      <TableCell
                        key={`skeleton-td-${index}`}
                        className="px-4 py-4" // ✅ Consistent padding
                      >
                        <Skeleton className="h-7 w-5/6 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : data.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                    e.stopPropagation();
                    onRowClick?.(row);
                  }}
                  className={cn(
                    "cursor-pointer",
                    typeof rowClassName === "function"
                      ? rowClassName(row, index)
                      : rowClassName
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-4" // ✅ Consistent padding, increased py for better spacing
                      style={{ width: cell.column.getSize() }} // ✅ Apply column sizing
                    >
                      <Typography
                        variant="sm-semibold"
                        className="text-primary-500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headersLength} className="py-8 text-center">
                  <Typography
                    variant="xs-regular"
                    className="text-greys-850"
                  >
                    You didn&apos;t have any content yet. Choose book to start
                    creating your content.
                  </Typography>
                  <div className="mt-4 flex justify-center">
                    {ContentActionSheet && ContentActionSheet()}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>

      {/* ✅ Better spacing for pagination and action buttons */}
      {showPagination && (
        <div className="flex justify-center px-4 py-0 sticky bottom-0 bg-white ">
          <DataTablePagination table={table} />
        </div>
      )}

      {!loading && data.length > 0 && ContentActionSheet && (
        <div className="flex justify-end px-4 py-3">{ContentActionSheet()}</div>
      )}
    </div>
  );
}
