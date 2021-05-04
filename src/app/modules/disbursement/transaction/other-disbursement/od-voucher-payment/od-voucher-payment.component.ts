import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { BankService } from 'src/app/service/accounting/bank.service';
import { OtherDisbursementService } from 'src/app/service/disbursement/transaction/other-disbursement.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-od-voucher-payment-lookup',
  templateUrl: './od-voucher-payment.component.html',
  styles: []
})
export class ODVoucherPaymentComponent implements OnInit {

  bankList = [];
  constructor(
    public service: OtherDisbursementService,
    public globalService: GlobalService,
    private bankService: BankService) { }

  ngOnInit(): void {
    this.bankService.getBankList().subscribe(res => this.bankList = res as []);
    // console.log(this.globalService.toWords(7185366.25));
  }

  changeClient(value) {
    console.log(value);
  }


}


 