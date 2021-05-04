import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DisbursementService } from 'src/app/service/disbursement/transaction/disbursement.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-cd-voucher-payment-lookup',
  templateUrl: './cd-voucher-payment.component.html',
  styles: []
})
export class CDVoucherPaymentComponent implements OnInit {

  constructor(
    public service: DisbursementService,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    // console.log(this.globalService.toWords(7185366.25));
  }



}
