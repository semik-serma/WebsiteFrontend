'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';

export default function Heartbeat({ token }) {
    useEffect(() => {
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        const ping = () => axios.post(api.heartbeat, {}, { headers }).catch(() => {});
        ping();
        const interval = setInterval(ping, 30000);
        return () => clearInterval(interval);
    }, [token]);
    return null;
}
