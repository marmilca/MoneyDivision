import { Component } from '@angular/core';
import { IPerson, StateEnum } from 'src/models/IPerson';
import { IOrder } from 'src/models/IOrder';
import { OrderService } from './services/order.service';
import { IPayment } from 'src/models/IPayment';
import { PaymentService } from './services/payment.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    personCount: number;

    personList = new Array<IPerson>();
    paymentList = new Array<IPayment>();
    hasPerson: boolean = false;

    isPaymentFinished: boolean = false;

    private _creditList = new Array<IPerson>();
    private _debitList = new Array<IPerson>();

    private _incrementId: number = 1;

    constructor(private _orderService: OrderService,
        private _paymentService: PaymentService) { }

    pushList() {
        this._incrementId = 1;
        if (this.personCount > 0) {
            this.personList = new Array<IPerson>();
            this.hasPerson = true;

            for (let index = 0; index < this.personCount; index++) {
                var person = <IPerson>{
                    id: this._incrementId
                }
                this._incrementId++;
                this.personList.push(person);
            }
        } else {
            this.hasPerson = false;
        }
    }

    calculate() {
        this.setOrder();

        this.setPayment();
    }

    private setOrder() {
        var total: number = 0;

        for (let person of this.personList) {
            total += person.amount;
        };
        var average: number = total / this.personList.length;

        for (let person of this.personList) {
            if (average == person.amount) {
                person.state = StateEnum.Settled;
            } else if (average > person.amount) {
                person.state = StateEnum.Debit;
                this._debitList.push(person);
            } else if (average < person.amount) {
                person.state = StateEnum.Credit;
                this._creditList.push(person);
            }
        };

        var order = <IOrder>{
            id: this._orderService.incrementalId,
            total: total,
            personList: this.personList,
            average: average
        }

        this._orderService.setOrder(order);
    }

    private setPayment() {
        var order = this._orderService.getOrder();

        this._creditList.map(creditPerson => {
            var credit = creditPerson.amount - order.average;
            for (let debitPerson of this._debitList) {
                if (debitPerson.state != StateEnum.Settled && creditPerson.state != StateEnum.Settled) {
                    var debit = order.average - debitPerson.amount;
                    if (credit >= debit) {
                        var rest = credit - debit;
                        credit = rest;

                        debitPerson.state = StateEnum.Settled;

                        if (credit == 0) {
                            creditPerson.state = StateEnum.Settled;
                        }

                        var payment = <IPayment>{
                            id: this._paymentService.incrementalId,
                            amount: debit,
                            debtorPerson: debitPerson,
                            creditorPerson: creditPerson
                        }
                        this._paymentService.pushPayment(payment);
                    } else if (credit < debit) {
                        var rest = debit - credit;
                        credit = 0;
                        creditPerson.state = StateEnum.Settled;

                        var payment = <IPayment>{
                            id: this._paymentService.incrementalId,
                            amount: rest,
                            debtorPerson: debitPerson,
                            creditorPerson: creditPerson
                        }
                        this._paymentService.pushPayment(payment);

                    }
                }
            }

        });

        this.paymentList = this._paymentService.getPayment();

        this.isPaymentFinished = true;
    }
}
