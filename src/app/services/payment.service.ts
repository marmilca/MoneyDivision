import { Input, Injectable } from '@angular/core';
import { IPayment } from 'src/models/IPayment';

@Injectable({
    providedIn: 'root',
  })
export class PaymentService {

    private _payments = new Array<IPayment>();
    private _incrementalId: number = 0;

    constructor() { }

    get incrementalId(): number{
        this._incrementalId++;
        return this._incrementalId;
    }

    getPayments(): Array<IPayment> {
        return this._payments;
    }

    pushPayment(payment: IPayment) {
        this._payments.push(payment);
    }
    
    cleanPayments() {
        this._incrementalId = 0;
        this._payments = new Array<IPayment>();
    }
}