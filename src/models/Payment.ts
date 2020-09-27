export interface Payment {
    id: number;
    debtorPersonId: number;
    creditorPersonId: number;
    amount: number;
}