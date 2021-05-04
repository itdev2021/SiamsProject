import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { BankService } from 'src/app/service/accounting/bank.service';
import { DisbursementFATService } from 'src/app/service/disbursement/transaction/disbursementfat.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-dfat-voucher-payment-lookup',
  templateUrl: './dfat-voucher-payment.component.html',
  styles: []
})
export class DFATVoucherPaymentComponent implements OnInit {

  bankList = [];
  constructor(
    public service: DisbursementFATService,
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
