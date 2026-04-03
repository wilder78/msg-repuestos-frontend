import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  // MODIFICACIÓN: Si hay 1 página o menos (8 registros o menos), no mostrar nada
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t flex justify-between items-center bg-gray-50/30">
      <p className="text-sm text-slate-500">
        Página <span className="font-medium text-slate-900">{currentPage}</span>{" "}
        de {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
