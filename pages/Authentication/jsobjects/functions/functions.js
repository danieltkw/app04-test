export default {
  defaultTab: 'Sign In',
  testMode: true,

  // Initialize the default tab to "SignIn"
  initialize() {
    console.log('Initializing with default tab set to Sign In');
    this.setDefaultTab('Sign In');  // Set the default tab to SignIn when the app loads
  },

  // Set the tab directly to "SignIn"
  setDefaultTab(tabName) {
    if (tabName === 'Sign In') {
      this.defaultTab = tabName;
    } else {
      console.error('Invalid tab name:', tabName);
    }
  },

  // Navigate to the external form
  navigateToSignUpForm() {
    navigateTo(
      'https://docs.google.com/forms/d/e/1FAIpQLSea9NOGjFYhjPSYULcSrd_JemTH9CtChcq_xK6OcU87VhOmJQ/viewform?usp=sf_link', 
      {}, 
      'NEW_WINDOW'
    );
  },

  // Create Token (dummy function for simplicity)
  async createToken(user) {
    if (!user || !user.email) {
      throw new Error("User object is undefined or missing email.");
    }
    return 'dummy-token-for-' + user.email;
  },

  // Sign In Function
  async signIn() {
    const password = inp_password.text || 'testpassword';
    const email = inp_email.text || 'test@example.com';

    try {
      // Fetch the user data from Google Sheets
      const users = await entry_form.run();  // Assuming "entry_form" is the query fetching the users

      const user = users.find((u) => u['Email address'] === email && u['Senha desejada'] === password);

      if (user) {
        const userVAT = user['NIF/VAT']; // Capture the VAT as the user identifier

        // Store the VAT as the userID for the session
        await storeValue('userID', userVAT);

        // Store the token (optional)
        await storeValue('token', await this.createToken(user));

        // Navigate to the dashboard after successful login
        navigateTo('DashboardPage');  // Replace 'DashboardPage' with the actual page name

        showAlert('Login Success', 'success');
      } else {
        showAlert('Invalid email/password combination', 'error');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      showAlert('An error occurred during sign-in', 'error');
    }
  },

  // Update Login Function (not needed in this context, but for future reference)
  async updateLogin(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is undefined');
      }

      await UpdateLogin_sql.run({
        user_id: userId,
        updated_at: new Date().toISOString().slice(0, 19).replace("T", " ")
      });

      console.log(`Updated login time for user ID: ${userId}`);
    } catch (error) {
      console.error('Error during updateLogin:', error);
      showAlert('An error occurred while updating login time', 'error');
    }
  }
};

	


// ------------------------------------------------------------
// Temporary Login page
// ------------------------------------------------------------
// Daniel T. K. W. - github.com/danieltkw - danielkopolo95@gmail.com
// ------------------------------------------------------------


