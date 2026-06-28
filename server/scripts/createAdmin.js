const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../src/models');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Check if admin exists
    let admin = await User.findOne({ where: { email: 'admin@skybook.com' } });
    if (!admin) {
      admin = await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@skybook.com',
        password: 'adminpassword123',
        role: 'admin',
        isVerified: true
      });
      console.log('Admin user created successfully');
    } else {
      // Force update password and role just to be sure we can log in
      admin.password = 'adminpassword123';
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user already exists, updated password and role.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

createAdmin();
