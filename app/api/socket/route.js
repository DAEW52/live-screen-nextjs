import { NextResponse } from 'next/server';

export async function POST(request) {
    const io = request.io;
    try {
        const { event, data } = await request.json();
        if (io && event) {
            io.emit(event, data);
            console.log(`Socket event emitted: ${event}`);
            return NextResponse.json({ ok: true });
        }
        return NextResponse.json({ ok: false, error: 'Socket server not available' }, { status: 500 });
    } catch (error) {
        console.error('Socket API Error:', error);
        return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
    }
}ห