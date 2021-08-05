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

    private _creditList;
    private _debitList;

    constructor(private _orderService: OrderService,
        private _paymentService: PaymentService) { }

    pushList() {
        if (this.personCount > 0) {
            this.personList = new Array<IPerson>();
            this.hasPerson = true;

            for (let index = 0; index < this.personCount; index++) {
                var person = <IPerson>{
                    id: index
                }
                this.personList.push(person);
            }
        } else {
            this.hasPerson = false;
        }
    }

    calculate() {
        this._debitList = new Array<IPerson>();
        this._creditList = new Array<IPerson>();
        this._paymentService.cleanPayments();
        this.setOrder();

        this.setPayment();
    }

    private setOrder() {
        var total: number = 0;

        for (let person of this.personList) {
            person.amount = person.amount == null ? 0 : person.amount;
            total += person.amount;
        };
        var average: number = total / this.personList.length;

        for (let person of this.personList) {
            if (average == person.amount) {
                person.state = StateEnum.Settled;
            } else if (average < person.amount) {
                person.state = StateEnum.Debit;
                var debitPerson = <IPerson>{
                    id: person.id,
                    amount: person.amount,
                    name: person.name,
                    orderId: person.orderId,
                    state: person.state
                }
                this._debitList.push(debitPerson);
            } else if (average > person.amount) {
                person.state = StateEnum.Credit;
                var creditPerson = <IPerson>{
                    id: person.id,
                    amount: person.amount,
                    name: person.name,
                    orderId: person.orderId,
                    state: person.state
                }
                this._creditList.push(creditPerson);
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
            var credit = order.average - creditPerson.amount;

            for (let debitPerson of this._debitList) {

                if (debitPerson.state != StateEnum.Settled && creditPerson.state != StateEnum.Settled) {
                    var debit = debitPerson.amount - order.average;
                    
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
                        debitPerson.amount = debitPerson.amount - credit;

                        creditPerson.state = StateEnum.Settled;

                        var payment = <IPayment>{
                            id: this._paymentService.incrementalId,
                            amount: credit,
                            debtorPerson: debitPerson,
                            creditorPerson: creditPerson
                        }
                        
                        credit = 0;
                        this._paymentService.pushPayment(payment);

                    }
                }
            }

        });

        this.paymentList = this._paymentService.getPayments();

        this.isPaymentFinished = true;
    }
}
