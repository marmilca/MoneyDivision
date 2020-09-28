import { IPerson } from './IPerson';

export interface IPayment {
    id: number;
    debtorPerson: IPerson;
    creditorPerson: IPerson;
    amount: number;
}