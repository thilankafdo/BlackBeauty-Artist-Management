import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";
import ical from 'ical-generator';
import { google } from 'googleapis';
import { Buffer } from 'buffer';

dotenv.config({ path: '../.env.local' });

const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database Setup
const defaultData = {
    gigs: [
        { id: '1', venue: 'Vibe Club', city: 'Colombo', date: '2025-05-18', startTime: '22:00', endTime: '02:00', status: 'Confirmed', fee: 150000, deposit: 50000, isDepositPaid: true, isFeePaid: false, currency: 'LKR', notes: 'Main Stage Techno Set. Rider confirmed.', clientId: '1' },
        { id: '2', venue: 'Warehouse Project', city: 'Manchester', date: '2025-06-02', startTime: '02:00', endTime: '04:00', status: 'Confirmed', fee: 18000, deposit: 9000, isDepositPaid: true, isFeePaid: true, currency: 'GBP', notes: 'Closing set. Flight BA255.', clientId: '2' },
        { id: '3', venue: 'Electric Gardens', city: 'Melbourne', date: '2025-06-15', startTime: '16:00', endTime: '18:00', status: 'Pending', fee: 4500, deposit: 0, isDepositPaid: false, isFeePaid: false, currency: 'USD', notes: 'Festival slot. Contract negotiation pending.', clientId: '3' },
        { id: '4', venue: 'Fabric', city: 'London', date: '2025-06-05', startTime: '23:00', endTime: '01:00', status: 'Canceled', fee: 2000, deposit: 0, isDepositPaid: false, isFeePaid: false, currency: 'GBP', notes: 'Promoter canceled due to licensing issues.', clientId: '4' },
        { id: '5', venue: 'ZOUK', city: 'Singapore', date: '2025-07-20', startTime: '01:00', endTime: '03:00', status: 'Confirmed', fee: 8000, deposit: 4000, isDepositPaid: true, isFeePaid: false, currency: 'USD', notes: 'Asia Tour Leg 1.', clientId: '5' },
        { id: '6', venue: 'Kama Colombo', city: 'Colombo', date: '2025-04-10', startTime: '21:00', endTime: '00:00', status: 'Confirmed', fee: 85000, deposit: 85000, isDepositPaid: true, isFeePaid: true, currency: 'LKR', notes: 'Private Corporate Event.', clientId: '6' }
    ],
    expenses: [
        { id: 'e1', date: '2025-05-15', category: 'Travel', description: 'Manchester Flight', amount: 850, currency: 'GBP', gigId: '2' },
        { id: 'e2', date: '2025-05-18', category: 'Gear', description: 'Monitor Rental', amount: 15000, currency: 'LKR', gigId: '1' },
        { id: 'e3', date: '2025-06-01', category: 'Marketing', description: 'UK Tour Ads', amount: 500, currency: 'GBP', gigId: '2' },
        { id: 'e4', date: '2025-04-05', category: 'Staff', description: 'Tour Manager Advance', amount: 50000, currency: 'LKR', gigId: '6' },
        { id: 'e5', date: '2025-06-14', category: 'Travel', description: 'Uber to Airport', amount: 45, currency: 'USD', gigId: '3' }
    ],
    jobRegistry: [
        { id: 'd1', gigId: '1', type: 'Contract', dateGenerated: '2025-04-20', status: 'Approved', fileName: 'Vibe_Club_Contract_Signed.pdf' },
        { id: 'd2', gigId: '1', type: 'Rider', dateGenerated: '2025-04-22', status: 'Sent', fileName: 'Black_Beauty_Tech_Rider_v2.pdf' },
        { id: 'd3', gigId: '2', type: 'Invoice', dateGenerated: '2025-05-01', status: 'Paid', fileName: 'INV-2025-001_Warehouse.pdf', totalAmount: 18000 },
        { id: 'd4', gigId: '3', type: 'Quotation', dateGenerated: '2025-05-10', status: 'Draft', fileName: 'Quote_Electric_Gardens.pdf' }
    ],
    clients: [
        { id: '1', name: 'Roshan P.', company: 'Vibe Ent', email: 'roshan@vibe.lk', phone: '+94771234567', category: 'Promoter' },
        { id: '2', name: 'Sarah Jones', company: 'MCR Warehouse', email: 'sarah@warehouse.mcr', phone: '+447911123456', category: 'Venue' },
        { id: '3', name: 'Festival Team', company: 'EG Australia', email: 'bookings@electricgardens.au', phone: '+61412345678', category: 'Promoter' },
        { id: '4', name: 'London Events', company: 'Fabric Live', email: 'info@fabric.london', phone: '+442073368898', category: 'Venue' },
        { id: '5', name: 'Lim Wei', company: 'Zouk Group', email: 'wei@zouk.sg', phone: '+6567382988', category: 'Venue' },
        { id: '6', name: 'Tech Corp', company: 'Virtusa', email: 'events@virtusa.com', phone: '+94112345678', category: 'Corporate' }
    ]
};

let db;

async function initDb() {
    db = await JSONFilePreset('db.json', defaultData);
}

// Routes
app.get('/api/gigs', async (req, res) => {
    await db.read();
    res.json(db.data.gigs);
});

app.post('/api/gigs', async (req, res) => {
    await db.read();
    const newGig = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    db.data.gigs.push(newGig);
    await db.write();
    res.json(newGig);
});

app.put('/api/gigs/:id', async (req, res) => {
    await db.read();
    const index = db.data.gigs.findIndex(g => g.id === req.params.id);
    if (index > -1) {
        db.data.gigs[index] = { ...db.data.gigs[index], ...req.body };
        await db.write();
        res.json(db.data.gigs[index]);
    } else {
        res.status(404).json({ error: 'Gig not found' });
    }
});

app.get('/api/expenses', async (req, res) => {
    await db.read();
    res.json(db.data.expenses);
});

app.post('/api/expenses', async (req, res) => {
    await db.read();
    const newExpense = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    db.data.expenses.push(newExpense);
    await db.write();
    res.json(newExpense);
});

app.get('/api/clients', async (req, res) => {
    await db.read();
    res.json(db.data.clients);
});

app.post('/api/clients', async (req, res) => {
    await db.read();
    const newClient = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    db.data.clients.push(newClient);
    await db.write();
    res.json(newClient);
});

// Google Drive Setup
let drive;
if (process.env.GOOGLE_DRIVE_KEY) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_DRIVE_KEY);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        drive = google.drive({ version: 'v3', auth });
    } catch (e) {
        console.error('Failed to initialize Google Drive:', e);
    }
}

// Google Sheets Setup
let sheets;
if (process.env.GOOGLE_DRIVE_KEY) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_DRIVE_KEY);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: [
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/gmail.readonly'
            ],
        });
        sheets = google.sheets({ version: 'v4', auth });
    } catch (e) {
        console.error('Failed to initialize Google Sheets/API:', e);
    }
}

// iCal Feed Endpoint
app.get('/api/calendar.ics', async (req, res) => {
    try {
        await db.read();
        const calendar = ical({ name: 'Black Beauty Touring Calendar' });

        db.data.gigs.filter(gig => gig.status === 'Confirmed').forEach(gig => {
            const start = new Date(`${gig.date}T${gig.startTime || '21:00'}:00`);
            const end = new Date(`${gig.date}T${gig.endTime || '00:00'}:00`);

            // Handle cross-day sets
            if (end < start) {
                end.setDate(end.getDate() + 1);
            }

            calendar.createEvent({
                start: start,
                end: end,
                summary: `Performance: ${gig.venue}`,
                description: `Fee: ${gig.currency} ${gig.fee}\nNotes: ${gig.notes || 'N/A'}\nStatus: ${gig.status}`,
                location: `${gig.venue}, ${gig.city}`,
                url: 'https://black-beauty.management'
            });
        });

        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="calendar.ics"');
        res.send(calendar.toString());
    } catch (error) {
        console.error('iCal Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate calendar feed' });
    }
});

// Document Upload Endpoint (Base64 PDF -> Google Drive)
app.post('/api/documents/upload', async (req, res) => {
    try {
        const { base64Data, fileName, gigId, clientName, venueName, type } = req.body;

        if (!base64Data || !fileName || !gigId) {
            return res.status(400).json({ error: 'Missing required upload data' });
        }

        let googleDriveUrl = null;

        if (drive) {
            const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
            const fileMetadata = {
                name: fileName,
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Optional, fallback to root if missing
            };
            const media = {
                mimeType: 'application/pdf',
                body: buffer,
            };

            const response = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, webViewLink',
            });
            googleDriveUrl = response.data.webViewLink;
        }

        // Update local database
        await db.read();
        const newDoc = {
            id: Math.random().toString(36).substr(2, 9),
            gigId,
            type,
            dateGenerated: new Date().toISOString().split('T')[0],
            status: type === 'Invoice' ? 'Paid' : 'Approved',
            fileName,
            googleDriveUrl,
            clientName,
            venueName
        };

        db.data.jobRegistry.push(newDoc);
        await db.write();

        res.json(newDoc);
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
});

// Sync Financials to Google Sheets
app.post('/api/sync/sheets', async (req, res) => {
    if (!sheets || !process.env.GOOGLE_SHEETS_ID) {
        return res.status(501).json({ error: 'Google Sheets integration not configured' });
    }

    try {
        await db.read();
        const { gigs, expenses } = db.data;

        // Prepare Gigs sheet
        const gigRows = [
            ['ID', 'Venue', 'City', 'Date', 'Start', 'End', 'Status', 'Fee', 'Currency', 'Notes'],
            ...gigs.map(g => [g.id, g.venue, g.city, g.date, g.startTime || '', g.endTime || '', g.status, g.fee, g.currency, g.notes || ''])
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEETS_ID,
            range: 'Gigs!A1',
            valueInputOption: 'RAW',
            resource: { values: gigRows },
        });

        // Prepare Expenses sheet
        const expenseRows = [
            ['ID', 'Date', 'Category', 'Description', 'Amount', 'Currency', 'Gig ID'],
            ...expenses.map(e => [e.id, e.date, e.category, e.description, e.amount, e.currency, e.gigId || ''])
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEETS_ID,
            range: 'Expenses!A1',
            valueInputOption: 'RAW',
            resource: { values: expenseRows },
        });

        res.json({ message: 'Financials synchronized to Google Sheets' });
    } catch (error) {
        console.error('Sheets Sync Error:', error);
        res.status(500).json({ error: 'Failed to sync to Google Sheets' });
    }
});

// Gmail Preview Mock/Service
app.get('/api/gmail/preview', async (req, res) => {
    // In a real scenario, we'd use service.users.messages.list
    // For this demo, returning premium-styled mock data that looks "real"
    res.json([
        { id: 'm1', from: 'Ultra Music Festival', subject: 'Artist Advance: Main Stage Set', date: '2 min ago', snippet: 'Hello Black Beauty, we have processed the technical rider...', unread: true },
        { id: 'm2', from: 'Sony Music', subject: 'Royalty Statement - Q4 2025', date: '1 hour ago', snippet: 'Your quarterly statement is now available for download...', unread: true },
        { id: 'm3', from: 'Vibe Club', subject: 'Booking Confirmation: VIP Event', date: 'Yesterday', snippet: 'We are excited to confirm your appearance for the upcoming...', unread: false }
    ]);
});

// Drive Files Fetch
app.get('/api/drive/files', async (req, res) => {
    if (!drive) return res.json([]);
    try {
        const response = await drive.files.list({
            pageSize: 5,
            fields: 'files(id, name, webViewLink, iconLink, modifiedTime)',
            orderBy: 'modifiedTime desc'
        });
        res.json(response.data.files);
    } catch (error) {
        res.json([]);
    }
});

// Gemini Proxy
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createBookingDeclaration = {
    name: 'create_booking',
    parameters: {
        type: Type.OBJECT,
        description: 'Set up a new performance booking for DJ Black Beauty.',
        properties: {
            venue: { type: Type.STRING },
            city: { type: Type.STRING },
            date: { type: Type.STRING },
            startTime: { type: Type.STRING },
            endTime: { type: Type.STRING },
            fee: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            notes: { type: Type.STRING },
        },
        required: ['venue', 'city', 'date', 'fee', 'currency'],
    },
};

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp', // Updated to latest model if available, or stick to preview
            contents: message,
            config: {
                systemInstruction: `You are the Digital Chief of Staff and Booking Agent for DJ Black Beauty. 
        Your primary goal is to assist the manager in organizing tours, handling logistics, and managing bookings.
        Default to Sri Lankan Rupee (LKR) for local bookings unless specified otherwise.
        You have the authority to create new bookings. If a user provides venue, city, date, fee, and timing information, use the 'create_booking' tool.
        Always ask for clarification if critical details like fee or date are missing.
        Be professional, efficient, and deeply knowledgeable about the global and Sri Lankan electronic music scene.`,
                tools: [{ functionDeclarations: [createBookingDeclaration] }],
            },
        });

        // Check for function calls
        const candidates = response.candidates;
        if (candidates && candidates[0].content.parts) {
            // Simple proxy response for now. Ideally we loop and handle tool calls effectively on backend or Frontend.
            // For simplicity, we just return the full response and let frontend handle parsing or text display.
            // But wait, the frontend expects text.
            // If it's a tool call, we might want to return that structure.
            // Let's return the raw parts.
            res.json({ parts: candidates[0].content.parts });
        } else {
            res.json({ parts: [{ text: "No response generated." }] });
        }

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to communicate with AI' });
    }
});

// Start Server
initDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
