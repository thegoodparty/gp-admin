'use client'

import { useState, ReactNode } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  Column,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  pagination?: boolean
  columnVisibilityControls?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  pagination = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      {searchKey && (
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }}
          />
          <input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '8px 12px',
              paddingLeft: '36px',
              fontSize: '14px',
              border: '1px solid #e4e4e7',
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        </div>
      )}

      <div
        style={{
          border: '1px solid #e4e4e7',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ borderBottom: '1px solid #e4e4e7' }}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: 500,
                      backgroundColor: '#fafafa',
                    }}
                  >
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: '1px solid #e4e4e7' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafafa'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ padding: '12px 16px' }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '16px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {table.getFilteredRowModel().rows.length} row(s)
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #e4e4e7',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                opacity: table.getCanPreviousPage() ? 1 : 0.5,
              }}
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #e4e4e7',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                opacity: table.getCanNextPage() ? 1 : 0.5,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Column header component with sorting
interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  children?: ReactNode
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span>{title}</span>
  }

  const sorted = column.getIsSorted()

  return (
    <button
      onClick={() => column.toggleSorting(sorted === 'asc')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp size={14} />
      ) : sorted === 'desc' ? (
        <ArrowDown size={14} />
      ) : (
        <ArrowUpDown size={14} style={{ color: '#9ca3af' }} />
      )}
    </button>
  )
}
