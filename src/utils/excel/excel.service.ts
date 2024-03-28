import { Injectable } from '@nestjs/common';

import * as ExcelJS from "exceljs";

@Injectable()
export class ExcelService {
    async exportXLSX(data: Record<string, any>[], columns: Record<string, string>[]) {
        const workBook = new ExcelJS.Workbook();
        const workSheet = workBook.addWorksheet("Data");

        //add columns
        const columnHeaders = columns.map(column => ({
            header: column.header,
            key: column.key
        }));

        workSheet.columns = columnHeaders;

        //add data rows
        data.forEach((rowData) => {
            const row = [];

            columnHeaders.forEach((column) => {
                row.push(rowData[column.key]);
            })

            workSheet.addRow(row);
        });

        const buffer = await workBook.xlsx.writeBuffer();
        
        return buffer;
    }
}
