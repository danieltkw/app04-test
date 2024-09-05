export default {
  // This function is called when the dashboard page loads
  async initializeDashboard() {
    const userID = appsmith.store.userID;  // Retrieve stored VAT (user ID)

    if (userID) {
      console.log('User ID:', userID);
      // Fetch data related to the user, e.g., orders
      await getOrdersForUserID.run({ userID: userID });
    } else {
      showAlert('No user ID found. Please log in again.', 'error');
      navigateTo('Login', {}, 'SAME_WINDOW');  // Redirect to login if no userID
    }
  },

  // Additional functions for the dashboard can go here...
  
  // Example function to fetch orders based on userID
  async fetchDashboardData() {
    const userID = appsmith.store.userID;
    if (userID) {
      const orders = await getOrdersForUserID.run({ userID: userID });
      console.log('Fetched orders:', orders);
    }
  }
};
