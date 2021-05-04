import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';


@Injectable({
    providedIn: 'root'
})
export class DesignationService {

    constructor(private http: HttpClient,
        private fb: FormBuilder) { }

    formDesignation = this.fb.group({
        DesignationID: [0],
        Code: ['', Validators.required],
        Designation: ['', Validators.required],
        Active:[1],
        RC: [new Date()],
        RCU: [0]
    });

    initializeFormGroup() {
        this.formDesignation.setValue({
            DesignationID: 0,
            Code: '',
            Designation: '',
            Active: 1,
            RC: new Date(),
            RCU: 0

        });
    }

    insertDesignation(formDesignation) {
        return this.http.post(environment.apiURL + '/Designation', formDesignation);
    }

    updateDesignation(formDesignation) {
        return this.http.put(environment.apiURL + '/Designation/' + formDesignation.DesignationID, formDesignation);
    }

    getDesignationList() {
        return this.http.get(environment.apiURL + '/Designation');
    }

    getDesignationByID(id: number): any {
        return this.http.get(environment.apiURL + '/Designation/' + id);
    }

    deleteDesignation(id: number) {
        return this.http.delete(environment.apiURL + '/Designation/' + id);
    }
}
