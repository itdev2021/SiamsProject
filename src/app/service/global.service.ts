import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from './references/department.service';
import { UserPermissionService } from './user/user-permission.service';
import { UserService } from './User/user.service';
@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    userDetails;
    departmentName;

    View: boolean = false;
    Create: boolean;
    Edit: boolean;
    Save: boolean;
    Delete: boolean;
    Post: boolean;
    Unpost: boolean;
    Cancel: boolean;
    Print: boolean;
    Amount: boolean;

    constructor(
        private router: Router,
        private userPermissionService: UserPermissionService,
        private userService: UserService,
        private _location: Location,
        private departmentService: DepartmentService
    ) {
    }

    getUserProfile() {
        this.userService.getuserProfile().subscribe(
            res => {
                this.userDetails = res;  
            },
            err => {
                // console.log(err);
            }
        )
    }

    getUserAccess(route) {
        this.userService.getuserProfile().subscribe(res => {
            // this.departmentService.getByID(res.DepartmentID).subscribe(dept => {
            //     this.departmentName = dept.DeptAbbr;
            // });
            this.userPermissionService.getUserPermissionById(res.Id).subscribe(
                nav => {
                    let filterPermission;
                    filterPermission = nav;
                    if (filterPermission.filter(x => x.route == route)[0] === undefined) {
                        // this.router.navigate(['/home']); //this._location.back()
                    } else {
                        this.Create = filterPermission.filter(x => x.route == route)[0].Create;
                        this.Edit = filterPermission.filter(x => x.route == route)[0].Edit;
                        this.Save = filterPermission.filter(x => x.route == route)[0].Save;
                        this.Delete = filterPermission.filter(x => x.route == route)[0].Delete;
                        this.Post = filterPermission.filter(x => x.route == route)[0].Post;
                        this.Unpost = filterPermission.filter(x => x.route == route)[0].Unpost;
                        this.Cancel = filterPermission.filter(x => x.route == route)[0].Cancel;
                        this.Print = filterPermission.filter(x => x.route == route)[0].Print;
                        this.Amount = filterPermission.filter(x => x.route == route)[0].Amount;
                    }
                },
                err => { 
                    // console.log(;err) 
                });
        });
    }



    padLeft(text: string, padChar: string, size: number): string {
        return (String(padChar).repeat(size) + text).substr((size * -1), size);
    }


    th = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    dg = ['Zzero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    tn = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    tw = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return 'not a number';
        let x = s.indexOf('.');
        if (x == -1) x = s.length;
        if (x > 15) return 'too big';
        let n = s.split('');
        let str = '';
        let sk = 0;
        for (let i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += this.tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                }
                else if (n[i] != 0) {
                    str += this.tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            }
            else if (n[i] != 0) {
                str += this.dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) str += 'hundred ';
                sk = 1;
            }

            if ((x - i) % 3 == 1) {
                if (sk) str += this.th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }
        if (x != s.length) {
            let y = s.length;
            str += 'And ';
            // for (let i =x+1; i<y; i++) str += this.dg[n[i]] +' ';
            // for (let i =x+1; i<y; i++) str += i +' ';
            str += s.split(".")[1] + '/' + 100;
        }
        return str.replace(/\s+/g, ' ') + ' Pesos Only';
    }



}