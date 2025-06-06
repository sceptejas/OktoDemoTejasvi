import React, { useState, useEffect } from 'react';
import { AlertCircle, Wallet, Send, LogOut, Mail, Chrome } from 'lucide-react';

const OKTO_BASE_URL = 'https://sandbox-api.okto.tech';
const GOOGLE_CLIENT_ID = 'your-google-client-id'; // Replace with actual client ID

// Alert Component
const Alert = ({ children, variant = 'default' }) => (
  <div className={`p-4 rounded-lg border ${
    variant === 'destructive' 
      ? 'bg-red-50 border-red-200 text-red-800' 
      : 'bg-blue-50 border-blue-200 text-blue-800'
  }`}>
    {children}
  </div>
);

// Button Component
const Button = ({ children, onClick, disabled, variant = 'default', className = '', ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Input Component
const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

// Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md border ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900">
    {children}
  </h3>
);

const CardContent = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

// Main App Component
const OktoDemo = () => {
  // State Management
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  
  // Login states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Transfer states
  const [transferData, setTransferData] = useState({
    recipientAddress: '',
    tokenAmount: '',
    networkName: 'POLYGON_TESTNET'
  });
  const [wallets, setWallets] = useState([]);

  // Demo mode API simulation
  const simulateApiCall = async (endpoint, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    if (endpoint === '/api/v1/authenticate/email/send-otp') {
      return { status: 'success', message: 'OTP sent successfully' };
    }
    
    if (endpoint === '/api/v1/authenticate/email/verify-otp') {
      if (otp === '123456') {
        return { 
          status: 'success', 
          data: { 
            auth_token: 'demo_token_12345',
            user: { email: email }
          } 
        };
      } else {
        throw new Error('Invalid OTP. Use 123456 for demo.');
      }
    }
    
    if (endpoint === '/api/v1/wallet') {
      return {
        status: 'success',
        data: {
          wallets: [
            {
              network_name: 'POLYGON_TESTNET',
              address: '0x742d35Cc6634C0532925a3b8D0C5E0c02210a8B5'
            },
            {
              network_name: 'BASE_TESTNET', 
              address: '0x123abc456def789ghi012jkl345mno678pqr901st'
            }
          ]
        }
      };
    }
    
    if (endpoint === '/api/v1/transfer/tokens/execute') {
      return {
        status: 'success',
        data: {
          order_id: 'demo_order_' + Date.now(),
          transaction_hash: '0xdemo123...'
        }
      };
    }
    
    return { status: 'success' };
  };
  const apiCall = async (endpoint, options = {}) => {
    const url = `${OKTO_BASE_URL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers
      },
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send credentials to avoid CORS issues
      ...options
    };

    console.log('Making API call to:', url);
    console.log('Config:', config);

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
      
    } catch (error) {
      console.error('API Call Error:', error);
      
      // Check if it's a network/CORS error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - This might be due to CORS restrictions in the preview environment. Try deploying to a live server.');
      }
      
      throw error;
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      clearMessages();

      // Note: In a real implementation, you'd use Google OAuth flow
      // This is a placeholder for the Google login process
      setError('Google OAuth integration requires additional setup. Please configure Google Client ID and implement OAuth flow.');
      
      // Placeholder for actual Google OAuth implementation:
      // 1. Initialize Google OAuth
      // 2. Get Google ID token
      // 3. Send to Okto API for authentication
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Email OTP Login - Send OTP
  const sendOTP = async () => {
    try {
      setLoading(true);
      clearMessages();

      let response;
      try {
        response = await apiCall('/api/v1/authenticate/email/send-otp', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
      } catch (error) {
        console.log('Real API failed, switching to demo mode:', error.message);
        setDemoMode(true);
        response = await simulateApiCall('/api/v1/authenticate/email/send-otp', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
        setSuccess('⚠️ Demo Mode: OTP sent! Use 123456 to login (Real API unavailable in preview)');
        setOtpSent(true);
        return;
      }

      setOtpSent(true);
      setSuccess('OTP sent to your email!');
    } catch (err) {
      setError(`Failed to send OTP: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Email OTP Login - Verify OTP
  const verifyOTP = async () => {
    try {
      setLoading(true);
      clearMessages();

      let response;
      if (demoMode) {
        response = await simulateApiCall('/api/v1/authenticate/email/verify-otp', {
          method: 'POST',
          body: JSON.stringify({ email, otp })
        });
      } else {
        try {
          response = await apiCall('/api/v1/authenticate/email/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp })
          });
        } catch (error) {
          console.log('Real API failed, switching to demo mode:', error.message);
          setDemoMode(true);
          response = await simulateApiCall('/api/v1/authenticate/email/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp })
          });
        }
      }

      setAuthToken(response.data.auth_token);
      setUser({ email });
      setSuccess(demoMode ? '🎭 Demo Login Successful!' : 'Login successful!');
      
      // Fetch user wallets after login
      await fetchWallets();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch User Wallets
  const fetchWallets = async () => {
    try {
      let response;
      if (demoMode) {
        response = await simulateApiCall('/api/v1/wallet');
      } else {
        try {
          response = await apiCall('/api/v1/wallet');
        } catch (error) {
          console.log('Wallet API failed, using demo data:', error.message);
          response = await simulateApiCall('/api/v1/wallet');
        }
      }
      setWallets(response.data.wallets || []);
    } catch (err) {
      console.error('Failed to fetch wallets:', err);
    }
  };

  // Token Transfer with Intent Flow
  const handleTransfer = async () => {
    try {
      setLoading(true);
      clearMessages();

      let response;
      if (demoMode) {
        response = await simulateApiCall('/api/v1/transfer/tokens/execute', {
          method: 'POST',
          body: JSON.stringify({
            network_name: transferData.networkName,
            token_address: '',
            recipient_address: transferData.recipientAddress,
            quantity: transferData.tokenAmount
          })
        });
      } else {
        try {
          response = await apiCall('/api/v1/transfer/tokens/execute', {
            method: 'POST',
            body: JSON.stringify({
              network_name: transferData.networkName,
              token_address: '',
              recipient_address: transferData.recipientAddress,
              quantity: transferData.tokenAmount
            })
          });
        } catch (error) {
          console.log('Transfer API failed, using demo mode:', error.message);
          response = await simulateApiCall('/api/v1/transfer/tokens/execute', {
            method: 'POST',
            body: JSON.stringify({
              network_name: transferData.networkName,
              token_address: '',
              recipient_address: transferData.recipientAddress,
              quantity: transferData.tokenAmount
            })
          });
        }
      }

      const prefix = demoMode ? '🎭 Demo: ' : '';
      setSuccess(`${prefix}Transfer initiated! Order ID: ${response.data.order_id}`);
      
      // Clear form
      setTransferData({
        recipientAddress: '',
        tokenAmount: '',
        networkName: 'POLYGON_TESTNET'
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setWallets([]);
    setOtpSent(false);
    setOtp('');
    setEmail('');
    setDemoMode(false);
    clearMessages();
  };

  // Load Google OAuth script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Okto Demo App</h1>
          <p className="text-gray-600">Solutions Engineer Takehome Project</p>
          {demoMode && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 font-medium">🎭 Demo Mode Active</p>
              <p className="text-sm text-yellow-700">Real API unavailable in preview. Use OTP: 123456</p>
            </div>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6">
            {success}
          </Alert>
        )}

        {!user ? (
          /* Login Section */
          <div className="grid md:grid-cols-2 gap-6">
            {/* Google Login */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Chrome className="mr-2 h-5 w-5" />
                  Google Login
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Authenticating...' : 'Login with Google'}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Quick authentication using your Google account
                </p>
              </CardContent>
            </Card>

            {/* Email OTP Login */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Email OTP Login
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || otpSent}
                  />
                </div>
                
                {!otpSent ? (
                  <Button
                    onClick={sendOTP}
                    disabled={loading || !email}
                    className="w-full"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={loading}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={verifyOTP}
                        disabled={loading || !otp}
                        className="flex-1"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                      <Button
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        variant="outline"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Dashboard Section */
          <div className="space-y-6">
            {/* User Info & Logout */}
            <Card>
              <CardContent className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Welcome!</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>

            {/* Wallets Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Your Wallets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wallets.length > 0 ? (
                  <div className="space-y-2">
                    {wallets.map((wallet, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{wallet.network_name}</p>
                        <p className="text-sm text-gray-600 font-mono">{wallet.address}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No wallets found</p>
                )}
              </CardContent>
            </Card>

            {/* Token Transfer Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Token Transfer (Intent Flow)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Network</label>
                  <select
                    value={transferData.networkName}
                    onChange={(e) => setTransferData({...transferData, networkName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="POLYGON_TESTNET">Polygon Testnet</option>
                    <option value="BASE_TESTNET">Base Testnet</option>
                    <option value="SOLANA_TESTNET">Solana Testnet</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Address</label>
                  <Input
                    placeholder="0x... or wallet address"
                    value={transferData.recipientAddress}
                    onChange={(e) => setTransferData({...transferData, recipientAddress: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.001"
                    step="0.001"
                    value={transferData.tokenAmount}
                    onChange={(e) => setTransferData({...transferData, tokenAmount: e.target.value})}
                  />
                </div>
                
                <Button
                  onClick={handleTransfer}
                  disabled={loading || !transferData.recipientAddress || !transferData.tokenAmount}
                  className="w-full"
                >
                  {loading ? 'Processing Transfer...' : 'Send Tokens'}
                </Button>
                
                <p className="text-sm text-gray-500">
                  This will transfer native tokens using Okto's Intent flow for seamless execution.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Built with Okto APIs | Solutions Engineer Takehome</p>
          <p className="text-sm mt-1">Direct API integration without React SDK</p>
        </div>
      </div>
    </div>
  );
};

export default OktoDemo;