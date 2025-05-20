import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, Container, Typography, AppBar, Toolbar, Button } from '@mui/material'

// Simple Home component
const Home = () => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Welcome to Centralized Firewall Management
    </Typography>
    <Typography variant="body1">
      This is a simple placeholder page. The full application is being set up.
    </Typography>
  </Box>
)

// Simple About component
const About = () => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      About
    </Typography>
    <Typography variant="body1">
      The Centralized Firewall Management System allows you to manage firewall rules across multiple endpoints.
    </Typography>
  </Box>
)

// Simple App component
const App: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Centralized Firewall
          </Typography>
          <Button color="inherit" href="/">Home</Button>
          <Button color="inherit" href="/about">About</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
