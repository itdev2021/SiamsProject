import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
})
export class PrintReportService {

    debit = '0';
    credit = '0';
    constructor(public http: HttpClient
    ) { }

    // Create PDF Preview

    //   ****************************** Received from Warehouse **************************** \\

    //   ****************************** Stock Transfer **************************** \\
    PrintDocSTS(fg: FormGroup) {
        const documentDefinition = {
            pageSize: 'LETTER',
            pageOrientation: "portrate",
            content: [
                // Size letter 
                //8.5inc 230cm = 460 (230 / 8.5 = 27.05)
                //11inc  275cm = 745 (280 / 11 = 25)
                // // margin: [left, top, right, bottom]

                // // margin: [horizontal, vertical]
                // { text: 'another text', margin: [5, 2] },

                // // margin: equalLeftTopRightBottom
                // { text: 'last one', margin: 5 }

                {
                    columns: [
                        {
                            width: 450,
                            text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true, margin: [0, 5, 0, 0]
                        },
                        {
                            width: '*',
                            text: "Print Date: " + formatDate(new Date, "MM/dd/yyyy", ('en-US')) + '\nPrintTime: ' + formatDate(new Date, "hh:mm:ss aa", ('en-US')), fontSize: 7, margin: [0, 5, 0, 0],

                        },
                    ]
                },

                { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },
                { text: "Payable Voucher", fontSize: 10, bold: true, margin: [0, 0, 0, 0] },

                {
                    columns: [
                        {
                            width: 150,
                            text: 'Transaction # : ' + fg.value.JournalEntryID
                        },
                        {
                            width: 290,
                            text: fg.value.HeaderReference
                        },
                        {
                            width: '*',
                            text: 'Date Entry : ' + formatDate(fg.value.DateEntry, "MM/dd/yyyy", ('en-US'))
                        },

                    ], margin: [0, 10, 0, 0], fontSize: 8
                },
                { text: 'Payable To : ' + fg.value.PayTo, fontSize: 8, margin: [0, 5, 0, 0] },
                { text: 'Remarks : ' + fg.value.Remarks, fontSize: 8, margin: [0, 5, 0, 5] },

                // line
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, -1] },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 1.5 }], margin: [0, 0, 0, 2] },
                // this.getPVItemObject(fg),

                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, 0] },

                {
                    table: {
                        widths: [50, 240, 100, 60, 60],
                        body: [
                            ['', '', '', '', ''],
                            ['', '',
                                { text: 'Grand Total', bold: true },
                                { text: Number(parseFloat(fg.value.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                                { text: Number(parseFloat(fg.value.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                            ],

                        ]
                    },
                    layout: 'noBorders',
                    fontSize: 9, bold: true, margin: [0, 0],
                },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, 0] },



            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black'
                }
            },
            footer: function (currentPage, pageCount) {
                return {

                    columns: [
                        {
                            width: '22%',
                            text: "Page " + currentPage.toString() + ' of ' + pageCount, fontSize: 7
                        },
                        {
                            width: '58%',
                            text: ''
                        },
                        {
                            width: '20%',
                            columns: [
                                {
                                    text: 'Printed by:', fontSize: 8, bold: true
                                },
                                {
                                    text: 'Administrator', fontSize: 8, bold: true
                                }
                            ]
                        }
                    ], margin: [10, 0, 0, 0],

                };
            }
        };
        pdfMake.createPdf(documentDefinition).open();
    }

    // getPreviewPVItemObject(fg: FormGroup) {
    //     return {
    //         layout: 'headerLineOnly',
    //         table: {
    //             headerRows: 1,
    //             widths: [50, 210, 100, 60, 60],
    //             body: [
    //                 [
    //                     { text: 'Code', style: 'tableHeader', margin: [0, 0, 0, 5] },
    //                     { text: 'Account Title', style: 'tableHeader', margin: [0, 0, 0, 5] },
    //                     { text: 'Cost Unit', style: 'tableHeader', margin: [0, 0, 0, 5] },
    //                     { text: 'Debit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
    //                     { text: 'Credit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],

    //                 fg.get('items').value.map(res => {
    //                     return [
    //                         res.Code,
    //                         res.AccountTitle,
    //                         res.CostUnit,
    //                         { text: Number(parseFloat(res.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' },
    //                         { text: Number(parseFloat(res.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' }
    //                     ];
    //                 }),
    //             ],
    //         },
    //         fontSize: 9, margin: [0, 0],
    //         canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }]
    //     };
    // }

    // Ledger
    PrintSTSLedger(fg: FormGroup) {
        const documentDefinition = {
            pageSize: 'LETTER',
            pageOrientation: "portrate",
            content: [
                // Size letter 
                //8.5inc 230cm = 460 (230 / 8.5 = 27.05)
                //11inc  275cm = 745 (280 / 11 = 25)
                // // margin: [left, top, right, bottom]
                // { columns:['sample']},

                // // margin: [horizontal, vertical]
                // { text: 'another text', margin: [5, 2] },

                // // margin: equalLeftTopRightBottom
                // { text: 'last one', margin: 5 }

                { text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true, margin: [0, 5, 0, 0] },
                { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },


                { text: "Payable Voucher Entries", fontSize: 12, bold: true, margin: [0, 15, 0, 0] },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 1.5 }] },

                {
                    columns: [
                        { text: 'Transaction # : ' + fg.value.JournalEntryID, fontSize: 10, margin: [0, 10, 0, 0] },
                        { text: 'Date Entry : ' + formatDate(fg.value.DateEntry, "MM/dd/yyyy", ('en-US')), fontSize: 10, margin: [0, 10, 0, 0] },
                    ], margin: [0, 5, 0, 0]
                },
                { text: 'Payable To : ' + fg.value.PayTo, fontSize: 10, margin: [0, 5, 0, 0] },
                {
                    columns: [
                        { text: 'P.O # : ' + fg.value.HeaderReferenceID, fontSize: 10, margin: [0, 0, 0, 0] },
                        { text: 'Reference # : ' + fg.value.HeaderReference, fontSize: 10, margin: [0, 0, 0, 0] }

                    ], margin: [0, 5, 0, 5]
                },

                // line
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }] },

                this.getPVItemObject(fg),
                {

                    table: {
                        widths: [50, 240, 100, 60, 60],
                        body: [
                            ['', '', '', '', ''],
                            ['', '', '',
                                { text: Number(parseFloat(fg.value.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                                { text: Number(parseFloat(fg.value.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                            ],

                        ]
                    },
                    layout: 'noBorders',
                    fontSize: 9, bold: true, margin: [0, 0],
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black'
                }
            },
            footer: [
                {
                    columns: [
                        {
                            width: '10%',
                            text: '', fontSize: 10, bold: true
                        },
                        {
                            width: '60%',
                            text: ''
                        },
                        {
                            width: '20%',
                            columns: [
                                {
                                    text: 'Printed by:', fontSize: 8, bold: true
                                },
                                {
                                    text: 'Administrator', fontSize: 8, bold: true
                                }
                            ]
                        }
                    ], margin: [0, 0, 0, 0],
                }
            ],
            stylesFooter: {
                fontSize: 10,
                bold: true
            }
        };
        pdfMake.createPdf(documentDefinition).open();
    }

    getSTSItemObject(fg: FormGroup) {
        return {
            layout: 'headerLineOnly',
            table: {
                headerRows: 1,
                widths: [50, 210, 100, 60, 60],
                body: [
                    [
                        { text: 'Code', style: 'tableHeader', margin: [0, 0, 0, 5] },
                        { text: 'Account Title', style: 'tableHeader', margin: [0, 0, 0, 5] },
                        { text: 'Cost Unit', style: 'tableHeader', margin: [0, 0, 0, 5] },
                        { text: 'Debit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
                        { text: 'Credit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],

                    fg.get('items').value.map(res => {
                        return [
                            res.Code,
                            res.AccountTitle,
                            res.CostUnit,
                            { text: Number(parseFloat(res.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' },
                            { text: Number(parseFloat(res.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' }
                        ];
                    }),
                ]
            },
            fontSize: 9, margin: [0, 0],
        };
    }
    //   ****************************** Withdrawal Slipt **************************** \\

    //   ****************************** Receiving Receipt **************************** \\



    //   ****************************** Payable Voucher ***************************** \\
    // Print Document
    PrintDocPV(fg: FormGroup) {
        const documentDefinition = {
            pageSize: 'LETTER',
            pageOrientation: "portrate",
            content: [
                // Size letter 
                //8.5inc 230cm = 460 (230 / 8.5 = 27.05)
                //11inc  275cm = 745 (280 / 11 = 25)
                // // margin: [left, top, right, bottom]

                // // margin: [horizontal, vertical]
                // { text: 'another text', margin: [5, 2] },

                // // margin: equalLeftTopRightBottom
                // { text: 'last one', margin: 5 }

                {
                    columns: [
                        {
                            width: 450,
                            text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true, margin: [0, 5, 0, 0]
                        },
                        {
                            width: '*',
                            text: "Print Date: " + formatDate(new Date, "MM/dd/yyyy", ('en-US')) + '\nPrintTime: ' + formatDate(new Date, "hh:mm:ss aa", ('en-US')), fontSize: 7, margin: [0, 5, 0, 0],

                        },
                    ]
                },

                { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },
                { text: "Payable Voucher", fontSize: 10, bold: true, margin: [0, 0, 0, 0] },

                {
                    columns: [
                        {
                            width: 150,
                            text: 'Transaction # : ' + fg.value.JournalEntryID
                        },
                        {
                            width: 290,
                            text: fg.value.HeaderReference
                        },
                        {
                            width: '*',
                            text: 'Date Entry : ' + formatDate(fg.value.DateEntry, "MM/dd/yyyy", ('en-US'))
                        },

                    ], margin: [0, 10, 0, 0], fontSize: 8
                },
                { text: 'Payable To : ' + fg.value.PayTo, fontSize: 8, margin: [0, 5, 0, 0] },
                { text: 'Remarks : ' + fg.value.Remarks, fontSize: 8, margin: [0, 5, 0, 5] },

                // line
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, -1] },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 1.5 }], margin: [0, 0, 0, 2] },
                this.getPVItemObject(fg),

                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, 0] },

                {
                    table: {
                        widths: [50, 240, 100, 60, 60],
                        body: [
                            ['', '', '', '', ''],
                            ['', '',
                                { text: 'Grand Total', bold: true },
                                { text: Number(parseFloat(fg.value.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                                { text: Number(parseFloat(fg.value.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                            ],

                        ]
                    },
                    layout: 'noBorders',
                    fontSize: 9, bold: true, margin: [0, 0],
                },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, 0] },



            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black'
                }
            },
            footer: function (currentPage, pageCount) {
                return {

                    columns: [
                        {
                            width: '22%',
                            text: "Page " + currentPage.toString() + ' of ' + pageCount, fontSize: 7
                        },
                        {
                            width: '58%',
                            text: ''
                        },
                        {
                            width: '20%',
                            columns: [
                                {
                                    text: 'Printed by:', fontSize: 8, bold: true
                                },
                                {
                                    text: 'Administrator', fontSize: 8, bold: true
                                }
                            ]
                        }
                    ], margin: [10, 0, 0, 0],

                };
            }
        };
        pdfMake.createPdf(documentDefinition).open();
    }

    // getPreviewPVItemObject(fg: FormGroup) {
    //     return {
    //         layout: 'headerLineOnly',
    //         table: {
    //             headerRows: 1,
    //             widths: [50, 210, 100, 60, 60],
    //             body: [
    //                 [
    //                     { text: 'Code', style: 'tableHeader', margin: [0, 0, 0, 5] },
    //                     { text: 'Account Title', style: 'tableHeader', margin: [0, 0, 0, 5] },
    //                     { text: 'Cost Unit', style: 'tableHeader', margin: [0, 0, 0, 5] },
    //                     { text: 'Debit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
    //                     { text: 'Credit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],

    //                 fg.get('items').value.map(res => {
    //                     return [
    //                         res.Code,
    //                         res.AccountTitle,
    //                         res.CostUnit,
    //                         { text: Number(parseFloat(res.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' },
    //                         { text: Number(parseFloat(res.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' }
    //                     ];
    //                 }),
    //             ],
    //         },
    //         fontSize: 9, margin: [0, 0],
    //         canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }]
    //     };
    // }

    // Ledger
    PrintPVLedger(fg: FormGroup) {
        const documentDefinition = {
            pageSize: 'LETTER',
            pageOrientation: "portrate",
            content: [
                // Size letter 
                //8.5inc 230cm = 460 (230 / 8.5 = 27.05)
                //11inc  275cm = 745 (280 / 11 = 25)
                // // margin: [left, top, right, bottom]
                // { columns:['sample']},

                // // margin: [horizontal, vertical]
                // { text: 'another text', margin: [5, 2] },

                // // margin: equalLeftTopRightBottom
                // { text: 'last one', margin: 5 }

                { text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true, margin: [0, 5, 0, 0] },
                { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },


                { text: "Payable Voucher Entries", fontSize: 12, bold: true, margin: [0, 15, 0, 0] },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 1.5 }] },

                {
                    columns: [
                        { text: 'Transaction # : ' + fg.value.JournalEntryID, fontSize: 10, margin: [0, 10, 0, 0] },
                        { text: 'Date Entry : ' + formatDate(fg.value.DateEntry, "MM/dd/yyyy", ('en-US')), fontSize: 10, margin: [0, 10, 0, 0] },
                    ], margin: [0, 5, 0, 0]
                },
                { text: 'Payable To : ' + fg.value.PayTo, fontSize: 10, margin: [0, 5, 0, 0] },
                {
                    columns: [
                        { text: 'P.O # : ' + fg.value.HeaderReferenceID, fontSize: 10, margin: [0, 0, 0, 0] },
                        { text: 'Reference # : ' + fg.value.HeaderReference, fontSize: 10, margin: [0, 0, 0, 0] }

                    ], margin: [0, 5, 0, 5]
                },

                // line
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }] },

                this.getPVItemObject(fg),
                {

                    table: {
                        widths: [50, 240, 100, 60, 60],
                        body: [
                            ['', '', '', '', ''],
                            ['', '', '',
                                { text: Number(parseFloat(fg.value.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                                { text: Number(parseFloat(fg.value.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                            ],

                        ]
                    },
                    layout: 'noBorders',
                    fontSize: 9, bold: true, margin: [0, 0],
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black'
                }
            },
            footer: [
                {
                    columns: [
                        {
                            width: '10%',
                            text: '', fontSize: 10, bold: true
                        },
                        {
                            width: '60%',
                            text: ''
                        },
                        {
                            width: '20%',
                            columns: [
                                {
                                    text: 'Printed by:', fontSize: 8, bold: true
                                },
                                {
                                    text: 'Administrator', fontSize: 8, bold: true
                                }
                            ]
                        }
                    ], margin: [0, 0, 0, 0],
                }
            ],
            stylesFooter: {
                fontSize: 10,
                bold: true
            }
        };
        pdfMake.createPdf(documentDefinition).open();
    }

    getPVItemObject(fg: FormGroup) {
        return {
            layout: 'headerLineOnly',
            table: {
                headerRows: 1,
                widths: [50, 210, 100, 60, 60],
                body: [
                    [
                        { text: 'Code', style: 'tableHeader', margin: [0, 0, 0, 5] },
                        { text: 'Account Title', style: 'tableHeader', margin: [0, 0, 0, 5] },
                        { text: 'Cost Unit', style: 'tableHeader', margin: [0, 0, 0, 5] },
                        { text: 'Debit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
                        { text: 'Credit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],

                    ...fg.value.items.map(res => {
                        return [
                            res.Code,
                            res.AccountTitle,
                            res.CostUnit,
                            { text: Number(parseFloat(res.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' },
                            { text: Number(parseFloat(res.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' }
                        ];
                    }),
                ]
            },
            fontSize: 9, margin: [0, 0],
        };
    }

    //   ****************************** Other Payable Voucher **************************** \\
}
