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
  const ts = Date.now();
  const email = `test_full_${ts}@example.com`;
  const password = 'password123';
  console.log('1. Registering email:', email);
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (signUpError) {
    console.error('SignUp Error:', signUpError.message);
    return;
  }
  
  console.log('SignUp Data Session exists:', !!signUpData.session);
  
  // Now logout
  await supabase.auth.signOut();
  
  console.log('2. Trying to login with email:', email);
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (signInError) {
    console.error('SignIn Error:', signInError.message);
  } else {
    console.log('SUCCESS: Logged in! Session exists:', !!signInData.session);
  }
}

test();
