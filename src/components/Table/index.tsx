"use client";

import {Suspense, type FC} from "react";
import TableComponentView from "./View";

export interface TableComponentProps {
  entityName: string;
  prevent?: boolean;
  extraParams?: Object;
  title: string;
}

const TableComponent: FC<TableComponentProps> = (props) => {
  return (
    <Suspense fallback={<div>memuat table...</div>}>
      <TableComponentView {...props} />
    </Suspense>
  );
};
export default TableComponent;
