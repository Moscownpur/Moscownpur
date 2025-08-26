// Script to set up an admin user
// Run this script to promote a user to admin status

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin(email) {
  try {
    console.log(`Setting up admin for email: ${email}`);
    
    // First, get the user by email
    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !users) {
      console.error('User not found:', userError);
      return;
    }

    console.log(`Found user: ${users.email} (ID: ${users.id})`);

    // Check if user_roles entry exists
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', users.id)
      .single();

    if (roleCheckError && roleCheckError.code !== 'PGRST116') {
      console.error('Error checking existing role:', roleCheckError);
      return;
    }

    if (existingRole) {
      // Update existing role
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ is_admin: true })
        .eq('user_id', users.id);

      if (updateError) {
        console.error('Error updating role:', updateError);
        return;
      }

      console.log('✅ Successfully updated user to admin');
    } else {
      // Create new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: users.id,
          is_admin: true
        });

      if (insertError) {
        console.error('Error creating role:', insertError);
        return;
      }

      console.log('✅ Successfully created admin role for user');
    }

    // Verify the change
    const { data: verifyRole, error: verifyError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', users.id)
      .single();

    if (verifyError) {
      console.error('Error verifying role:', verifyError);
      return;
    }

    console.log('✅ Verification successful:');
    console.log(`   User ID: ${verifyRole.user_id}`);
    console.log(`   Is Admin: ${verifyRole.is_admin}`);
    console.log(`   Created: ${verifyRole.created_at}`);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node setup-admin.js <email>');
  console.log('Example: node setup-admin.js admin@example.com');
  process.exit(1);
}

setupAdmin(email);
