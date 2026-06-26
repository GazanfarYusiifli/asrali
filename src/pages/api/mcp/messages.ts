import { NextApiRequest, NextApiResponse } from 'next';
import { mcpTransports } from '../../../lib/mcp-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Extract sessionId from URL query params
    const sessionId = req.query.sessionId as string;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    const transport = mcpTransports.get(sessionId);
    if (!transport) {
      return res.status(404).json({ error: 'Session not found' });
    }

    try {
      // transport.handlePostMessage handles reading the body and sending the JSON-RPC response
      await transport.handlePostMessage(req as any, res as any, req.body);
    } catch (error: any) {
      console.error('Error handling MCP message:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
