import { Hospital } from '@/models'
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { ContentColumns, TDocumentDefinitions } from 'pdfmake/interfaces'
import { Table } from 'pdfmake/interfaces'
import { ContentTable } from 'pdfmake/interfaces'

export * from './MedRecReport'
;(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs

export type PdfOutput = 'download' | 'open' | 'print'

export function generateReport(definition: TDocumentDefinitions, mode: PdfOutput) {
  switch (mode) {
    case 'download':
      pdfMake.createPdf(definition).download()
      break
    case 'open':
      const win = window.open('', '_blank')
      pdfMake.createPdf(definition).open({}, win)
      break
    case 'print':
      pdfMake.createPdf(definition).print()
      break
  }
}

export function header(hospital: Hospital): ContentColumns {
  return {
    columns: [
      {
        table: {
          widths: ['auto', '*'],
          body: [
            [
              {
                text: hospital.name.toUpperCase(),
                alignment: 'right',
                bold: true,
                fontSize: 14,
                margin: [5, 10],
                color: '#da2a1d'
              },
              {
                text: `${hospital.address}\n${
                  hospital.telephone ? hospital.telephone : ''
                }${hospital.mobile ? `/${hospital.mobile}` : ''}`,
                alignment: 'right',
                fontSize: 10,
                margin: [5, 2],
                color: '#da2a1d'
              }
            ]
          ]
        },
        layout: 'noBorders'
      }
    ]
  }
}
export function table(table: Table): ContentTable {
  return {
    table,
    layout: {
      hLineWidth(i: number, node: any) {
        return i === 0 || i === node.table.body.length ? 1 : 1
      },
      vLineWidth(i: number, node: any) {
        return i === 0 || i === node.table.widths.length ? 1 : 1
      },
      hLineColor(i: number, node: any) {
        return i === 0 || i === node.table.body.length ? '#DD3B2E' : '#DD3B2E'
      },
      vLineColor(i: number, node: any) {
        return i === 0 || i === node.table.widths.length ? '#DD3B2E' : '#DD3B2E'
      }
    }
  }
}
