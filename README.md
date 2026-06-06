# CritterCard - Livestock Marketplace

A modern, full-stack marketplace platform for buying and selling livestock. Sellers can list animals, buyers can browse and purchase, and CritterCard takes a 15% commission on each sale.

## Features

- 🐄 **Seller Dashboard** - List and manage animal listings
- 🛒 **Buyer Marketplace** - Browse and purchase animals
- 💳 **Stripe Payment Integration** - Secure payments with automatic commission handling
- 📊 **Admin Dashboard** - Monitor sales, revenue, and platform metrics
- 🔐 **User Authentication** - Secure login for sellers and buyers

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** HTML/CSS/JavaScript + React (optional)
- **Database:** PostgreSQL
- **Payments:** Stripe API
- **Hosting:** Ready for Heroku/Railway/Vercel

## Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL
- Stripe account (free at stripe.com)

### Installation

1. Clone the repository
```bash
git clone https://github.com/jaimgreen47-dev/CritterCards.git
cd CritterCards
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database and Stripe keys
```

4. Initialize database
```bash
npm run db:setup
```

5. Start the server
```bash
npm start
```

Visit `http://localhost:3000`

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/crittercard
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=3000
```

## Project Structure

```
CritterCards/
├── server/
│   ├── routes/
│   ├── middleware/
│   └── db.js
├── public/
│   ├── css/style.css
│   ├── js/
│   └── *.html
├── db/
│   ├── schema.sql
│   └── setup.js
└── package.json
```

## Revenue Model

- **Commission:** 15% on every sale
- **Example:** $1,000 sale = $150 to CritterCard, $850 to seller

## Deployment

Deploy to Heroku, Railway, or Vercel with your Stripe and database keys.

## License

MIT
