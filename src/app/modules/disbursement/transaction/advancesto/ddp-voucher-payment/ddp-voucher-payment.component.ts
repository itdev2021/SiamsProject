import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DisbursementDPService } from 'src/app/service/disbursement/transaction/disbursementdp.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-ddp-voucher-payment-lookup',
  templateUrl: './ddp-voucher-payment.component.html',
  styles: []
})
export class DDPVoucherPaymentComponent implements OnInit {

  constructor(
    public service: DisbursementDPService,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    // console.log(this.globalService.toWords(7185366.25));
  }



}
