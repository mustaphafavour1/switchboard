import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface DataGridColumn<T> {
  key: string
  label: string
  /** Header and every cell in this column always share this one alignment — never set separately. */
  align?: 'left' | 'right'
  headerClassName?: string
  cellClassName?: string
  render: (row: T) => ReactNode
}

export function DataGrid<T>({
  columns,
  rows,
  rowKey,
}: {
  columns: DataGridColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
}) {
  return (
    <table className="data-grid">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={cn(col.align === 'right' && 'cell-num', col.headerClassName)}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={rowKey(row)}>
            {columns.map((col) => (
              <td key={col.key} className={cn(col.align === 'right' && 'cell-num', col.cellClassName)}>
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
