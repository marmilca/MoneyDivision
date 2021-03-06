export interface IPerson {
    id: number;
    name: string;
    orderId: string;
    amount: number;
    state: StateEnum;
}

export enum StateEnum {
    Settled,
    Credit,
    Debit
}