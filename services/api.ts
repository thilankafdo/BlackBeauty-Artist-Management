import { Gig, Expense, Client } from '../types';

const API_BASE_URL = 'http://localhost:3002/api';

export const api = {
    async getGigs(): Promise<Gig[]> {
        const response = await fetch(`${API_BASE_URL}/gigs`);
        if (!response.ok) throw new Error('Failed to fetch gigs');
        return response.json();
    },

    async addGig(gig: Omit<Gig, 'id'>): Promise<Gig> {
        const response = await fetch(`${API_BASE_URL}/gigs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gig),
        });
        if (!response.ok) throw new Error('Failed to add gig');
        return response.json();
    },

    async updateGig(id: string, updates: Partial<Gig>): Promise<Gig> {
        const response = await fetch(`${API_BASE_URL}/gigs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update gig');
        return response.json();
    },

    async getExpenses(): Promise<Expense[]> {
        const response = await fetch(`${API_BASE_URL}/expenses`);
        if (!response.ok) throw new Error('Failed to fetch expenses');
        return response.json();
    },

    async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        });
        if (!response.ok) throw new Error('Failed to add expense');
        return response.json();
    },

    async getClients(): Promise<Client[]> {
        const response = await fetch(`${API_BASE_URL}/clients`);
        if (!response.ok) throw new Error('Failed to fetch clients');
        return response.json();
    },

    async addClient(client: Omit<Client, 'id'>): Promise<Client> {
        const response = await fetch(`${API_BASE_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
        });
        if (!response.ok) throw new Error('Failed to add client');
        return response.json();
    },

    async chat(message: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        if (!response.ok) throw new Error('Failed to chat');
        return response.json();
    }
};
