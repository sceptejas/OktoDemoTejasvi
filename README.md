# Okto Demo App - Solutions Engineer Takehome

This is a React application built for the Okto Solutions Engineer position takehome assignment. It demonstrates direct integration with Okto APIs without using the React SDK.

##  Features

### Authentication
- **Google OAuth Login**: Seamless authentication using Google accounts
- **Email OTP Login**: Secure email-based authentication with OTP verification

### Core Functionality  
- **Token Transfer**: Intent-based token transfers across supported networks
- **Wallet Management**: View and manage user wallets
- **Multi-Network Support**: Polygon, Base, and Solana testnets

##  Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for consistent iconography
- **API Integration**: Direct REST API calls to Okto endpoints
- **Deployment**: Optimized for Vercel/Netlify hosting

##  Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- Okto API access (sandbox environment)
- Google OAuth Client ID (for Google login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd okto-demo-solutions-engineer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_OKTO_API_URL=https://sandbox-api.okto.tech
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Update `GOOGLE_CLIENT_ID` in the code

### Okto API Integration
The app integrates with these Okto API endpoints:
- `/api/oc/v1/authenticate/email/send-otp` - Send OTP to email
- `/api/oc/v1/authenticate/email/verify-otp` - Verify OTP and get auth token
- `/api/oc/v1/wallet` - Fetch user wallets
- `/api/oc/v1/transfer/tokens/execute` - Execute token transfers

## 🏗️ Architecture

### Component Structure
```
src/
├── App.js (Main component with all functionality)
├── App.css (Tailwind imports and custom styles)
└── index.js (React DOM rendering)
```

### State Management
- React Hooks (useState, useEffect) for local state
- No external state management library for simplicity
- Session-based authentication token storage

### API Integration Pattern
```javascript
const apiCall = async (endpoint, options = {}) => {
  const url = `${OKTO_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  };
  // ... error handling and response processing
};
```

## 🎯 Key Features Implementation

### 1. Authentication Flow
- **Email OTP**: Send OTP → Verify OTP → Receive auth token
- **Google OAuth**: OAuth flow → ID token → Okto authentication
- **Session Management**: Token-based authentication with logout

### 2. Token Transfer (Intent Flow)
- Network selection (Polygon, Base, Solana testnets)
- Recipient address validation
- Amount input with decimal support
- Intent-based execution for optimal gas/fees

### 3. Wallet Management
- Automatic wallet fetching post-authentication  
- Multi-network wallet display
- Address formatting and network identification

## 🚀 Deployment

### Vercel Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Netlify Deployment
1. Build the project: `npm run build`
2. Drag and drop `build` folder to Netlify
3. Configure environment variables
4. Set up continuous deployment

## 🔒 Security Considerations

- **API Token Security**: Tokens stored in memory only (no localStorage)
- **Input Validation**: Client-side validation for all user inputs
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **CORS**: Properly configured for cross-origin requests

## 🧪 Testing

### Manual Testing Checklist
- [ ] Email OTP login flow
- [ ] Google OAuth login (when configured)
- [ ] Wallet fetching and display
- [ ] Token transfer functionality
- [ ] Error handling for invalid inputs
- [ ] Responsive design on mobile/desktop
- [ ] Logout functionality

### API Testing
- All API calls include proper error handling
- Network timeouts and connection issues handled gracefully
- Invalid response formatting handled

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Grid Layout**: Responsive grid for login options
- **Touch-Friendly**: Large buttons and touch targets
- **Accessibility**: Proper focus states and ARIA labels

## 🔍 Code Quality

### Best Practices Implemented
- **Clean Code**: Well-commented, readable code structure
- **Error Boundaries**: Comprehensive error handling
- **Loading States**: User feedback during async operations
- **Semantic HTML**: Proper HTML5 semantics for accessibility
- **Performance**: Optimized re-renders and API calls

### Code Comments
```javascript
// Utility function for API calls with auth headers
const apiCall = async (endpoint, options = {}) => {
  // ... implementation with detailed comments
};

// Email OTP Login - Send OTP
const sendOTP = async () => {
  // ... step-by-step process comments
};
```

##  Performance Optimizations

- **Lazy Loading**: Components load only when needed
- **API Debouncing**: Prevent excessive API calls
- **Memory Management**: Proper cleanup in useEffect
- **Bundle Size**: Minimal dependencies for faster loading

##  Contributing

This is a takehome project, but the code follows these standards:
- ESLint configuration for code consistency
- Prettier for code formatting
- Conventional commit messages
- Comprehensive documentation

## Support

For questions about this implementation:
- Check Okto documentation: https://docs.okto.tech
- Review the demo app: https://react-template-oktov2.vercel.app/
- Reference the original template: https://github.com/okto-hq/okto-sdkv2-react-template-app



**Requirements Met:**
- [x] Google Auth login implementation
- [x] Email OTP login flow
- [x] Token transfer with Intent flow
- [x] Direct API integration (no React SDK)
- [x] Well-commented, clean code
- [x] Production-ready deployment setup
- [x] Comprehensive documentation

**Deadline**: 48 hours from assignment start
**Deliverables**: Live URL + GitHub repository (completed)

---

Built with ❤️ for Okto Solutions Engineer position