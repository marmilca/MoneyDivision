import { Input, Injectable } from '@angular/core';
import { IPayment } from 'src/models/IPayment';

@Injectable({
    providedIn: 'root',
  })
export class PaymentService {

    private _payment = new Array<IPayment>();
    private _incrementalId: number = 0;

    constructor() { }

    get incrementalId(): number{
        this._incrementalId++;
        return this._incrementalId;
    }

    getPayment(): Array<IPayment> {
        return this._payment;
    }

    pushPayment(payment: IPayment) {
        this._payment.push(payment);
    }
}