export interface Column<T> {
  header: string;
  key?: keyof T;
  render?: (row: T) => React.ReactNode;
}
