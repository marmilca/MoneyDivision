import { IOrder } from 'src/models/IOrder';
import { Input, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class OrderService {

    private _order: IOrder;
    private _incrementalId: number = 0;

    constructor() { }

    get incrementalId(): number{
        this._incrementalId++;
        return this._incrementalId;
    }

    getOrder(): IOrder {
        return this._order;
    }

    setOrder(order: IOrder) {
        this._order = order;
    }
}