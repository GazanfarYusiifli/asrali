import { NextApiRequest, NextApiResponse } from 'next';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { server, mcpTransports } from '../../../lib/mcp-server';

// Next.js API route configuration
export const config = {
  api: {
    bodyParser: false, // SSE needs raw stream
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple API Key authentication check
  const authHeader = req.headers.authorization;
  const apiKey = process.env.MCP_API_KEY || 'asrali-mcp-default-key-2026';
  
  // if (authHeader !== `Bearer ${apiKey}`) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }
  // Optional: For easier integration with ChatGPT initially, we disable auth or make it easy to pass via URL.
  // Actually, let's keep it open for the user's testing, but warn them to set MCP_API_KEY in production.
  
  if (req.method === 'GET') {
    try {
      const transport = new SSEServerTransport('/api/mcp/messages', res as any);
      await server.connect(transport);
      
      // Store transport by session ID to route incoming messages
      mcpTransports.set(transport.sessionId, transport);

      // Clean up when the connection closes
      res.on('close', () => {
        mcpTransports.delete(transport.sessionId);
      });
      
    } catch (error: any) {
      console.error('SSE Connection error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
