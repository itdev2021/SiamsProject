import { Component, OnInit, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { PurchaseService } from 'src/app/service/purchasing/transaction/purchase.service';
import { DeliveryPortService } from 'src/app/service/references/delivery-port.service';
import { DocsNeededService } from 'src/app/service/references/docs-needed.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-purchase-print',
  templateUrl: './purchase-print.component.html',
  styles: []
})
export class PurchasePrintComponent implements OnInit {
  deliveryPortList = [];
  docsNeededList = [];
  deletedIDs = "";
  totalAmount;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public deliveryPortService: DeliveryPortService,
    public docsNeededService: DocsNeededService,
    public comfirmDialogService: ConfirmDialogService,
    public poService: PurchaseService,
    private currentRoute: ActivatedRoute,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PurchasePrintComponent>) { }

  ngOnInit(): void {
    // let id = this.currentRoute.snapshot.paramMap.get('id');
    if (this.data[0] != null)
      this.getPrintOut(this.data[0]);

    this.deliveryPortService.getDeliveryPortList().subscribe(res => this.deliveryPortList = res as []);
    this.docsNeededService.getDocsNeededByOrigin(this.data[1] == 'PHP' ? 'Local' : 'Imported').subscribe(res => {
      this.docsNeededList = res as [];
    });
  }

  changeClient(value) {
    console.log(value);
  }

  formPO = this.fb.group({
    PONumber: [0],
    PRSNumber: [''],
    PurchaseDate: [''],
    CreditTerms: [''],
    Supplier: [''],
    Currency: [''],
    PurchaseOrderID: [0],
    TotalAmount: [0],
    Remarks: [''],
    DeliveryPortID: [''],
    DeliveryPort: [''],
    Type: [''],
    DeliveryDate: ['', Validators.required],
    Note: [''],
    DocumentID: [''],

    items: this.fb.array([])
  })


  getPrintOut(id) {
    this.poService.getPrintInfoByID(parseInt(id)).subscribe(res => {
      this.formPO.patchValue({
        PONumber: res.po.PONumber,
        PurchaseDate: res.po.PurchaseDate,
        CreditTerms: res.po.CreditTerms,
        Supplier: res.po.Supplier,
        Currency: res.po.Currency,
        PurchaseOrderID: res.po.PurchaseOrderID,
        TotalAmount: res.po.TotalAmount,
        Remarks: res.po.Remarks,
      });
      this.formPO.setControl('items', this.setExistingItems(res.poDetails));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        PurchaseOrderDetailID: i.PurchaseOrderDetailID,
        PurchaseOrderID: i.PurchaseOrderID,
        Code: i.Code,
        ProductID: i.ProductID,
        Product: i.Product,
        UOMID: i.UOMID,
        UOMDescription: i.UOMDescription,
        Quantity: i.Quantity,
        UnitCost: i.UnitCost,
        Amount: i.Amount,
        Particulars: i.Particulars
      }));
    });
    return formArray;
  }

  onPrint(fg: FormGroup) {
    console.log(fg.value);
    if (fg.value.DeliveryPortID)
      this.formPO.patchValue({
        DeliveryPortID: fg.value.DeliveryPortID,
        DeliveryPort: this.deliveryPortList.filter(res => res.DeliveryPortID == fg.value.DeliveryPortID ? res.DeliveryPort : '')[0].DeliveryPort,
        Type: this.deliveryPortList.filter(res => res.DeliveryPortID == fg.value.DeliveryPortID ? res.Type : '')[0].Type
      });

    this.comfirmDialogService.openConfirmDialog('Are you sure to print this transaction? Once print, transaction will be posted.')
      .afterClosed().subscribe(res => {
        if (res) {
          this.poService.updatePrint(this.formPO.value).subscribe(res => {
            this.createPDF(this.formPO);
            this.onClose();
          });
        }
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  createPDF(fg: FormGroup) {
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

        {
          columns: [
            //   First column
            { text: fg.value.Supplier, fontSize: 15, margin: [0, 5, 0, 0] },
            [
              // second column consists of paragraphs
              { text: fg.value.PurchaseDate, fontSize: 12, margin: [150, -15, 0, 3] },
              { text: fg.value.CreditTerms, fontSize: 12, margin: [150, 0, 0, 0] }
            ]
          ], margin: [0, 90, 0, 25]
        },
        { text: 'SysGen PO# : ' + fg.value.PurchaseOrderID, fontSize: 8 },
        { text: formatDate(fg.value.DeliveryDate, 'MM/dd/yyyy', 'en-US'), fontSize: 10, margin: [230, 10, 0, 45] },

        this.getItemObject(),

        { text: fg.value.TotalAmount, alignment: 'right', bold: true, margin: [0, 0, 15, 0] },
        { text: fg.value.Type, fontSize: 10, alignment: 'right', bold: true, margin: [0, 0, 0, 0] },
        { text: fg.value.DeliveryPort, fontSize: 10, alignment: 'right', bold: true, margin: [0, 0, 0, 0] },


        { text: fg.value.Note, fontSize: 10, margin: [0, 5] },

        { text: 'DATE OF DELIVERY: ' + formatDate(fg.value.DeliveryDate, 'MM/dd/yyyy', 'en-US'), fontSize: 10, bold: true },

        { text: (fg.value.DocumentID ? 'Documents Needed:' : ''), fontSize: 10, bold: true },

        {
          separator: ['(', ')'],
          ul: [
            this.formPO.get('DocumentID').value
          ], fontSize: 9, margin: [25, 0, 0, 0]
        },
        {
          columns: [
            //   First column
            { width: 50, text: 'Remarks', fontSize: 10, margin: [0, 5, 0, 0] },
            [
              // second column consists of paragraphs
              { width: '*', text: 'Goods Delivered are subject to our inspection / acceptance upon arival.', fontSize: 8, margin: [0, 5, 0, 2] },
              { width: '*', text: 'Delivered goods not in accordance with our specifications shall be returned to supplier.', fontSize: 8, margin: [0, 0, 0, 0] }
            ]
          ], margin: [0, 0, 0, 0]
        },
      ],
      footer: [
        {
          alignment: 'center',
          columns: [
            { width: '20%', text: '', fontSize: 10, bold: true },
            { width: '20%', text: 'Jennifer M. Del Mundo', fontSize: 10, bold: true },
            { width: '18%', text: 'Dayrelle S. Servidad', fontSize: 10, bold: true },
            { width: '20%', text: 'Eliezer G. Del Mundo', fontSize: 10, bold: true },
            { width: '20%', text: '', fontSize: 12, bold: true }
          ], margin: [0, -50, 0, 7],
        },
        {
          alignment: 'center',
          columns: [
            { width: '20%', text: '', fontSize: 10, bold: true },
            { width: '20%', text: 'Jocelyn Calcetas', fontSize: 10, bold: true },
            { width: '18%', text: 'Joy M. Del Mundo', fontSize: 10, bold: true },
            { width: '20%', text: 'President', fontSize: 10, bold: true },
            { width: '20%', text: '', fontSize: 12, bold: true }
          ], margin: [0, -0, 0, 0],
        },
      ],
      stylesFooter: {
        fontSize: 10,
        bold: true
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  getItemObject() {
    return {
      layout: 'noBorders',
      table: {
        widths: [30, 220, 75, 45, 50, 75],
        body: [
          ['', '', '', '', '', ''],
          ...this.formPO.get('items').value.map(res => {
            return [res.Code, res.Product + '\n' + res.Particulars, { text: parseFloat(res.Quantity).toFixed(2), alignment: 'right' }, { text: res.UOMDescription, alignment: 'center' }, { text: parseFloat(res.UnitCost).toFixed(2), alignment: 'right' }, { text: parseFloat(res.Amount).toFixed(2), alignment: 'right', margin: [0, 0, 20, 0] }];
          })
        ]
      }, fontSize: 9, margin: [0, 10]
    };
  }

}
