import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const server = new McpServer({
  name: "Asrali ERP MCP",
  version: "1.0.0"
});

server.tool(
  "get_products",
  "Anbardakı məhsulların siyahısını gətirir",
  {
    limit: z.number().optional().describe("Gətiriləcək məhsul sayı (default 50)")
  },
  async ({ limit = 50 }) => {
    const { data, error } = await supabase.from('erp_products').select('*').limit(limit);
    if (error) throw new Error(error.message);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }
);

server.tool(
  "get_sales",
  "Sistemdəki satışları (fakturaları) axtarır",
  {
    limit: z.number().optional()
  },
  async ({ limit = 20 }) => {
    const { data, error } = await supabase.from('erp_sales').select('*').order('created_at', { ascending: false }).limit(limit);
    if (error) throw new Error(error.message);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }
);

server.tool(
  "get_expenses",
  "Sistemdəki xərcləri axtarır",
  {
    limit: z.number().optional()
  },
  async ({ limit = 20 }) => {
    const { data, error } = await supabase.from('erp_expenses').select('*').order('created_at', { ascending: false }).limit(limit);
    if (error) throw new Error(error.message);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }
);

server.tool(
  "get_dashboard_stats",
  "Sistemin əsas göstəricilərini gətirir (Cəmi satışlar və xərclər)",
  {},
  async () => {
    const { data: salesData } = await supabase.from('erp_sales').select('*');
    const { data: expensesData } = await supabase.from('erp_expenses').select('*');
    
    const totalSales = salesData ? salesData.reduce((acc, curr) => acc + (Number(curr.tutar) || Number(curr.yekunMebleg) || 0), 0) : 0;
    const totalExpenses = expensesData ? expensesData.reduce((acc, curr) => acc + (Number(curr.tutar) || Number(curr.mebleg) || 0), 0) : 0;

    const stats = {
      totalSales,
      totalExpenses,
      balance: totalSales - totalExpenses
    };

    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }]
    };
  }
);

const globalAny = global as any;
if (!globalAny.mcpTransports) {
  globalAny.mcpTransports = new Map<string, SSEServerTransport>();
}

export const mcpTransports: Map<string, SSEServerTransport> = globalAny.mcpTransports;
export { server };
