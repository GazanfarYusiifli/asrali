const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key] = rest.join('=');
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.rpc('complete_user_registration', {
    p_full_name: 'Test',
    p_company_name: 'Test',
    p_phone: '123',
    p_country: 'Test',
    p_city: 'Test',
    p_username: null,
    p_email: 'test@test.com'
  });
  
  console.log('Error:', JSON.stringify(error, null, 2));
}

test();
