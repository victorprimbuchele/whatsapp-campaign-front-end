import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVerticalIcon } from "lucide-react";

export type Action = {
  label: string;
  onClick: () => void;
};

export type Header<T = Record<string, unknown>> = {
  id: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
};

export const GenericTable = <T extends Record<string, unknown>>({
  headers,
  data,
  actions,
}: {
  headers: Header<T>[];
  data: T[];
  actions?: Action[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header.id}>{header.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id as React.Key}>
            {headers.map((header) => (
              <TableCell key={header.id}>
                {header.render
                  ? header.render(row[header.id], row)
                  : (row[header.id] as React.ReactNode)}
              </TableCell>
            ))}
            {/* se tiver actions, adicionar aqui */}
            {actions && (
              <TableCell>
                {/* as ações vão ficar dentro de um menu de contexto */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {actions.map((action) => (
                      <DropdownMenuItem key={action.label}>
                        <Button variant="ghost" size="icon" onClick={action.onClick}>
                          {action.label}
                        </Button>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
