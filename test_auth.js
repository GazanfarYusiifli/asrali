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
  const email = `test_bypass_${Date.now()}@example.com`;
  console.log('Testing registration with email:', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123'
  });
  
  if (error) {
    console.error('SignUp Error:', error.message);
    return;
  }
  
  if (data.session) {
    console.log('SUCCESS: Session returned! Confirm Email is OFF.');
  } else {
    console.log('FAIL: Session is null! Confirm Email is still ON.');
  }
}

test();
