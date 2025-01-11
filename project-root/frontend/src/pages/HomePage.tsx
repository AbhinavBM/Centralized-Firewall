import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div style={styles.homepageContainer}>
      <header style={styles.header}>
        <h1>Application Firewall Dashboard</h1>
      </header>

      <main style={styles.mainContent}>
        <section style={styles.featureCard}>
          <h2 style={styles.cardTitle}>1. Identify App Traffic</h2>
          <p style={styles.cardText}>The firewall identifies the domains, IPs, and protocols that apps are trying to access.</p>
        </section>

        <section style={styles.featureCard}>
          <h2 style={styles.cardTitle}>2. Fine-Grained Control</h2>
          <p style={styles.cardText}>Set specific permissions for each app to control where they can connect and how they communicate.</p>
        </section>

        <section style={styles.featureCard}>
          <h2 style={styles.cardTitle}>3. Central Command Center</h2>
          <p style={styles.cardText}>Manage all endpoints and firewall rules from a centralized web console for convenience and efficiency.</p>
        </section>

        <section style={styles.featureCard}>
          <h2 style={styles.cardTitle}>4. Behavior Tracking & Alerts</h2>
          <p style={styles.cardText}>Monitor app network behavior and receive alerts for suspicious or abnormal activities.</p>
        </section>

        <section style={styles.featureCard}>
          <h2 style={styles.cardTitle}>5. Windows Endpoint Security</h2>
          <p style={styles.cardText}>Ensure all firewall policies and controls are effective for Windows systems.</p>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2024 Application Firewall Solutions</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  homepageContainer: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    color: '#333',
  },
  header: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '20px 0',
  },
  mainContent: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
  },
  featureCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    padding: '20px',
    textAlign: 'left',
  },
  cardTitle: {
    color: '#4a90e2',
  },
  cardText: {
    color: '#333',
  },
  footer: {
    marginTop: '20px',
    padding: '10px 0',
    backgroundColor: '#333',
    color: 'white',
  },
};

export default HomePage;
