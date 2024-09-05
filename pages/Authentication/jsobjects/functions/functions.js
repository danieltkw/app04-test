export default {
  defaultTab: 'Sign In',
  testMode: true,

  initialize() {
    console.log('Initializing with default tab set to Sign In');
    this.setDefaultTab('Sign In');  // Set the default tab to SignIn when the app loads
  },

  setDefaultTab(tabName) {
    if (tabName === 'Sign In') {
      this.defaultTab = tabName;
    } else {
      console.error('Invalid tab name:', tabName);
    }
  },

  async signIn() {
    const email = inp_email.text;
    const password = inp_password.text;

    try {
      const result = await entry_form.run(); // Runs the Google Sheet query

      if (result.length > 0) {
        const user = result.find(row => row['Email address'] === email);

        if (user) {
          if (user['Senha desejada'] === password) {
            await storeValue('userID', user['NIF/VAT']);  // Store VAT as user ID
            navigateTo('Dashboard', {}, 'SAME_WINDOW');  // Redirect to dashboard
            showAlert('Login Success', 'success');
          } else {
            showAlert('Invalid password', 'error');
          }
        } else {
          showAlert('User not found', 'error');
        }
      } else {
        showAlert('No data available', 'error');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      showAlert('An error occurred during sign-in', 'error');
    }
  },

  navigateToSignUpForm() {
    navigateTo(
      'https://docs.google.com/forms/d/e/1FAIpQLSea9NOGjFYhjPSYULcSrd_JemTH9CtChcq_xK6OcU87VhOmJQ/viewform?usp=sf_link', 
      {}, 
      'NEW_WINDOW'
    );
  }
};




	


// ------------------------------------------------------------
// Temporary Login page
// ------------------------------------------------------------
// Daniel T. K. W. - github.com/danieltkw - danielkopolo95@gmail.com
// ------------------------------------------------------------


