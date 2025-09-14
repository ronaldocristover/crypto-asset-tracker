# Crypto Asset Tracker

A modern, mobile-responsive Vue.js application for tracking cryptocurrency investments across multiple exchanges. Built with Vue 3, Vite, and Tailwind CSS.

## Features

- **Growth Summary Page**: View portfolio performance with interactive charts and statistics
- **Asset Input Page**: Add and manage crypto assets from different exchanges
- **Real-time Calculations**: Automatic profit/loss calculations and percentage returns
- **Mobile Responsive**: Optimized for all device sizes
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Mock API**: Built-in dummy data for demonstration

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and development server
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Interactive charts and graphs
- **Vue Chart.js** - Vue wrapper for Chart.js

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asset-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── Card.vue        # Generic card component
│   ├── Chart.vue       # Chart wrapper component
│   ├── Layout.vue      # Main layout with navigation
│   └── StatCard.vue    # Statistics display component
├── pages/              # Page components
│   ├── GrowthSummary.vue  # Portfolio overview page
│   └── AssetInput.vue     # Add assets page
├── services/           # API and data services
│   └── api.js         # Mock API service
├── App.vue            # Root component
├── main.js            # Application entry point
└── style.css          # Global styles and Tailwind imports
```

## Usage

### Growth Summary Page

- View total portfolio value and profit/loss
- Interactive charts showing portfolio performance over time
- Detailed table of all assets with individual performance
- Top performer highlighting

### Asset Input Page

- Add new crypto assets with purchase details
- Select from popular cryptocurrencies and exchanges
- Real-time profit/loss preview
- Recent assets display

## Mock Data

The application includes realistic mock data for demonstration:

- **Sample Assets**: Bitcoin, Ethereum, Cardano with realistic prices
- **Exchanges**: Binance, Coinbase, Kraken, and more
- **Historical Data**: 30 days of portfolio value and profit/loss data
- **Crypto List**: Popular cryptocurrencies with symbols and names

## Customization

### Adding New Cryptocurrencies

Edit `src/services/api.js` and add to the `cryptoList` array:

```javascript
{ symbol: 'NEW', name: 'NewCoin' }
```

### Adding New Exchanges

Edit `src/services/api.js` and add to the `exchanges` array:

```javascript
'NewExchange'
```

### Styling

The application uses Tailwind CSS with custom color schemes. Modify `tailwind.config.js` to change the color palette or add new design tokens.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
