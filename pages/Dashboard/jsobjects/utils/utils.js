export default {
    // Utility function to fetch and store VAT (clientId)
    async fetchAndSetClientId() {
        try {
            // Fetch VAT (client_id) from the database
            const result = await getClientIdFromDB.run(); // Query to fetch the VAT (vat_number)
            if (result && result.length > 0) {
                const clientId = result[0].client_id; // 'vat_number' as 'client_id'
                storeValue("clientId", clientId); // Store the VAT in Appsmith store
                return clientId;
            } else {
                // Fallback for testing or if no VAT is found
                const defaultClientId = '1'; // Use '1' as default for testing
                storeValue("clientId", defaultClientId);
                return defaultClientId;
            }
        } catch (error) {
            console.error('Error fetching VAT number (client ID):', error);
            // Fallback if an error occurs
            const defaultClientId = '1'; // Use '1' as default for testing
            storeValue("clientId", defaultClientId);
            return defaultClientId;
        }
    },

    // Function to get the stored VAT (client ID)
    async getClientId() {
        // Check if the VAT is already stored
        if (appsmith.store.clientId) {
            return appsmith.store.clientId;
        } else {
            // Fetch and store the VAT if it's not already stored
            return await this.fetchAndSetClientId();
        }
    },

    // Function to fetch and calculate dashboard metrics
    dashboardMetrics: async () => {
    const clientId = await this.getClientId(); // Ensures clientId (vat_number) is set correctly
    const orders = await getOrders.run({ clientId }); // Fetch orders based on VAT (clientId)

    // Calculate various metrics from the fetched orders
    const allOrders = orders.length;  // Total orders
    const fulfilledOrders = orders.filter(o => o.delivery_status === 'Delivered').length;  // Delivered orders
    const cancelledOrders = orders.filter(o => o.delivery_status === 'Cancelled').length;  // Cancelled orders
    const shippedOrders = orders.filter(o => o.delivery_status === 'Shipped').length;  // Shipped orders
    const packedOrders = orders.filter(o => o.delivery_status === 'Packed').length;  // Packed orders
    const totalOrderValue = orders.reduce((a, b) => a + b.total, 0);  // Sum of total order values
    const formattedOrderValueAmount = totalOrderValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3);

    return {
        allOrders,
        fulfilledOrders,
        cancelledOrders,
        shippedOrders,
        packedOrders,
        totalOrderValue: formattedOrderValueAmount,
    };
},

    // Function to fetch top ordered products
    async topOrderedProductsChart() {
        const clientId = await this.getClientId(); // Ensure VAT (clientId) is fetched
        const orderedProductsCount = await getOrderProductCount.run({ clientId });

        return orderedProductsCount.map(p => {
            return {
                x: String(p.name), // Ensure the name is a string
                y: p.variant_count, // Ensure this is a number or appropriate value
            };
        });
    },

    // Function to fetch revenue by month
    async revenueChart() {
        try {
            const clientId = await this.getClientId(); // Ensure VAT (clientId) is fetched
            const revenueByMonth = await getRevenueByMonth.run({ clientId });

            const months = [
                'January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            return revenueByMonth.map(r => {
                return {
                    x: months[parseInt(r.month.substring(5)) - 1] + ' ' + r.month.substring(2, 4),
                    y: r.total,
                };
            });
        } catch (error) {
            console.error('Error in revenueChart:', error);
            return [];
        }
    },
};





// ------------------------------------------------------------

// Dashboard page 

// ------------------------------------------------------------
// // Daniel T. K. W. - github.com/danieltkw - danielkopolo95@gmail.com
// ------------------------------------------------------------



