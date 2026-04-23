# Budget App - React Native with Expo

This is a React Native Expo mobile app featuring a modern, professional budget tracker UI built with shadcn/ui design principles and Lucide icons.

## Features Implemented

### Visual Components
- **Header Section**: User greeting with professional avatar and notification system
- **Main Balance Card**: Displays total balance with action buttons (Deposit, Transfer, More)
- **Accounts Grid**: Shows different account types with balances
- **Recent Expenses**: Lists recent transactions with amounts
- **Bottom Navigation**: Professional navigation bar with Home, Cards, Expenses, and Profile tabs
- **Professional Design**: Modern color scheme with proper contrast and spacing

### Design Features
- Clean, modern UI inspired by shadcn/ui design system
- Lucide icons for professional appearance
- Responsive layout that works on iOS and Android
- Scrollable content with proper spacing and hierarchy
- Custom styled buttons and cards with proper visual feedback
- Dark mode support with optimized color palette
- No emojis - replaced with professional icon library

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (will be available via npx)

### Installation

1. Navigate to the project directory:
```bash
cd BudgetApp
```

2. Install dependencies:
```bash
npm install
```

### Running the App

#### On Web (Easiest for testing)
```bash
npm run web
```
This opens the app in your browser at `http://localhost:8081`

#### On Android (requires Android Studio/emulator or physical device)
```bash
npm run android
```

#### On iOS (requires macOS and Xcode)
```bash
npm run ios
```

Or use the Expo Go app on your phone:
```bash
npm start
```
Then scan the QR code with your phone's camera or Expo Go app.

## Project Structure

```
BudgetApp/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen with budget UI
│   │   ├── explore.tsx         # Explore screen
│   │   └── _layout.tsx         # Tab navigation layout
│   ├── modal.tsx
│   └── _layout.tsx
├── components/
│   ├── ui/
│   │   └── lucide-icons.tsx   # Professional icon components
│   └── [other components]
├── constants/
│   └── theme.ts               # Modern color system
├── assets/                     # Images and fonts
└── package.json
```

## Design System

The app uses a modern design system with:
- **Color Palette**: Professional blues, greens, and neutral tones
- **Typography**: Clear hierarchy with multiple weight levels
- **Icons**: Lucide icon library for consistent, professional appearance
- **Spacing**: Consistent padding and margins throughout
- **Components**: Reusable, themed components with light/dark mode support

## Next Steps - Logic Implementation

The frontend UI is now complete. Here's what you can add next:

### Data Management
- [ ] State management (Redux, Zustand, or Context API)
- [ ] Budget data models
- [ ] Expense tracking logic

### Features to Implement
- [ ] Add/Edit/Delete expenses
- [ ] Category filtering
- [ ] Budget limits and alerts
- [ ] Monthly/weekly expense reports
- [ ] Transfer between accounts
- [ ] User authentication
- [ ] Data persistence (AsyncStorage or SQLite)
- [ ] Charts and analytics

### Navigation
- [ ] Wire up tab navigation to different screens
- [ ] Create screens for Cards, Expenses, and Profile
- [ ] Add detailed expense view
- [ ] Add transaction history

### API Integration
- [ ] Connect to backend for data persistence
- [ ] Implement sync functionality
- [ ] Handle offline mode

## Customization

### Colors
Edit the color definitions in [constants/theme.ts](constants/theme.ts) to customize the color scheme

### Icons
The app uses Lucide icons. See [components/ui/lucide-icons.tsx](components/ui/lucide-icons.tsx) for the icon component mapping and usage.

### Text Content
All hardcoded values can be moved to a data file or fetched from an API

## Troubleshooting

### Port already in use
If port 8081 is already in use:
```bash
npm start -- --port 8082
```

### Build issues
Try clearing cache:
```bash
npm start -- --clear
```

### TypeScript errors
Ensure you're using the correct component imports and that all props are properly typed.

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Lucide Icons](https://lucide.dev)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction/)
- [React Native StyleSheet API](https://reactnative.dev/docs/stylesheet)

---

**Note**: This is a frontend-focused implementation with professional styling. Logic and backend integration should be added based on your specific requirements.
