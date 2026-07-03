import type { Column } from "@/types/table";

interface TableHeaderProps<T> {
  columns: Column<T>[];
}

export function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th key={index}>{column.header}</th>
        ))}
      </tr>
    </thead>
  );
}
