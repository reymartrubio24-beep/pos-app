## RetailPOS 🛒

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![React][react-shield]][react-url]
[![PHP][php-shield]][php-url]
[![MySQL][mysql-shield]][mysql-url]

<br />
<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/226/226777.png" alt="Logo" width="80" height="80">

  <h3 align="center">RetailPOS — Point of Sale & Sales Monitoring System</h3>

  <p align="center">
    A full-stack retail management solution for small retail stores, built with React + Vite and PHP/MySQL.
    <br />
    <br />
    <a href="https://github.com/reymartrubio24-beep/pos-app">💻 View Code</a>
    ·
    <a href="https://github.com/reymartrubio24-beep/pos-app/issues">🐞 Report Bug</a>
    ·
    <a href="https://github.com/reymartrubio24-beep/pos-app/issues">✨ Request Feature</a>
  </p>
</div>

---

## 📖 About The Project

**RetailPOS** is a Point of Sale & Sales Monitoring System designed for small retail stores. It provides a modern, responsive interface for managing daily sales, inventory, users, and store analytics — all from a single dashboard.

### ✨ Key Features

- **🔐 Role-Based Access Control (RBAC)** — Three distinct roles (`Owner`, `Admin`, `Cashier`) with permission-based page access and restricted capabilities.
- **💳 POS Terminal** — A streamlined, interactive point-of-sale interface for fast transaction processing with cart management, category filtering, and payment modals with change calculation.
- **📦 Inventory Management** — Full CRUD operations for products including name, category, price, stock levels, low-stock thresholds, and product images.
- **📊 Dashboard Analytics** — Real-time statistics cards, revenue charts, low-stock alerts, and recent transaction history.
- **📈 Sales Reports** — Detailed transaction history with stat summaries and data export capabilities.
- **📝 Audit Logs** — Comprehensive activity tracking of all system actions with export and clear functionality.
- **👥 User Management** — Create, update, and delete system users with role assignment and avatar uploads.
- **🔑 Secure Authentication** — Login system with hashed passwords (bcrypt) and session management.
- **🌗 Light / Dark Theme** — Toggle between light and dark modes, with preference persistence.
- **📱 Responsive Design** — Collapsible sidebar, mobile-friendly navigation, and adaptive layouts.

---

### 🛠️ Built With

| Layer    | Technology                                                                  |
| -------- | --------------------------------------------------------------------------- |
| Frontend | [React 19](https://reactjs.org/) + [Vite 5](https://vitejs.dev/)            |
| Backend  | [PHP](https://www.php.net/) (REST API)                                      |
| Database | [MySQL](https://www.mysql.com/) via [XAMPP](https://www.apachefriends.org/) |
| Styling  | Vanilla CSS with CSS Variables & Inter font (Google Fonts)                  |
| Tooling  | ESLint, Prettier                                                            |

---

## 📂 Project Structure

```
pos-app/
├── public/                     # Static assets (favicon, uploads)
├── src/
│   ├── components/
│   │   ├── Audit/              # AuditTable
│   │   ├── Dashboard/          # DashboardCards, RevenueChart, LowStockAlerts, RecentTransactions
│   │   ├── Inventory/          # ProductTable, ProductModal
│   │   ├── POS/                # Cart, CartItem, PaymentModal, ProductCard, ProductFilters, SuccessModal
│   │   ├── Sales/              # StatsCards, TransactionTable
│   │   ├── Users/              # UserTable, UserModal
│   │   ├── Sidebar.jsx         # Collapsible navigation sidebar
│   │   ├── TopBar.jsx          # Top header with breadcrumbs, theme toggle & user menu
│   │   └── Footer.jsx          # Application footer
│   ├── pages/
│   │   ├── Login.jsx           # Authentication page
│   │   ├── Dashboard.jsx       # Analytics overview
│   │   ├── POSTerminal.jsx     # Point-of-sale checkout
│   │   ├── Inventory.jsx       # Product management
│   │   ├── SalesReport.jsx     # Sales analytics & history
│   │   ├── AuditLog.jsx        # Activity log viewer
│   │   └── Users.jsx           # User management
│   ├── utils/
│   │   └── api.js              # Centralized API service (fetch wrapper)
│   ├── App.jsx                 # Root component with routing & layout
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles & theme variables
├── php/
│   ├── config/
│   │   └── db.php              # PDO database connection
│   ├── api/
│   │   ├── auth/               # login, logout, register
│   │   ├── dashboard/          # stats
│   │   ├── products/           # index, manage, categories
│   │   ├── transactions/       # create
│   │   ├── sales/              # report, export, clear
│   │   ├── audit/              # index, export, clear
│   │   ├── users/              # index, create, update, delete
│   │   └── utils/              # common utilities
│   └── uploads/                # User-uploaded files (avatars, product images)
├── database/
│   └── schema.sql              # Database schema & seed data
├── index.html                  # HTML entry point
├── vite.config.js              # Vite config with PHP API proxy
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** (v18+) & **npm**
- **XAMPP** (Apache + MySQL + PHP)

### ⚙️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/reymartrubio24-beep/pos-app.git
cd pos-app
```

2. **Install frontend dependencies:**

```bash
npm install
```

3. **Setup the PHP backend:**

   Copy or symlink the entire `pos-app` folder into your XAMPP `htdocs` directory so that the PHP API is accessible at:

   ```
   http://localhost/GUI-1/pos-app/php/api/
   ```

   > The Vite dev server proxies `/api` requests to this path automatically via `vite.config.js`.

4. **Create the database:**
   - Start **Apache** and **MySQL** from the XAMPP Control Panel.
   - Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
   - Create a new database called `pos_system`.
   - Import the schema file: `database/schema.sql`.

5. **Configure the database connection** (if needed):

   Edit `php/config/db.php` with your MySQL credentials:

   ```php
   $host     = 'localhost';
   $dbname   = 'pos_system';
   $username = 'root';       // Default for XAMPP
   $password = '';            // Default for XAMPP
   ```

6. **Start the development server:**

```bash
npm run dev
```

7. **Open the app** at `http://localhost:5173`.

---

### 🔑 Default Accounts

| Role    | Username              | Password   |
| ------- | --------------------- | ---------- |
| Owner   | `owner@example.com`   | `password` |
| Cashier | `cashier@example.com` | `password` |

---

## 💡 Usage

### 🎯 Application Roles & Permissions

| Feature         | Owner / Admin | Cashier |
| --------------- | :-----------: | :-----: |
| Dashboard       |      ✅       |   ✅    |
| POS Terminal    |      ✅       |   ✅    |
| Inventory       |      ✅       |   ✅    |
| Sales Reports   |      ✅       |   ❌    |
| Audit Logs      |      ✅       |   ❌    |
| User Management |      ✅       |   ❌    |

**Owner / Admin**

- Full access to all modules including dashboard analytics, sales reports, audit logs, and user management.
- Can create, update, and delete users and assign roles.
- Can export and clear sales and audit data.

**Cashier**

- Access to the POS Terminal for processing sales transactions.
- View-only access to the Dashboard and Inventory.
- Redirected to the POS Terminal on login for quick checkout.

---

## 🗺️ Roadmap

- [ ] **Mobile Accessibility** 📱
  - [ ] Progressive Web App (PWA) support for mobile installation
  - [ ] Dedicated mobile-optimized dashboard for owners
  - [ ] Responsive UI refinements for small-screen POS checkout
- [ ] **Payment & Hardware** 💳
  - [ ] Integrate with digital wallets (GCash, PayMaya, GrabPay via Stripe/Xendit)
  - [ ] Hardware barcode scanner integration
  - [ ] ESC/POS receipt thermal printer support
- [ ] **Advanced Features** ✨
  - [ ] Generate downloadable PDF sales & inventory reports
  - [ ] Multi-branch / Multi-store cloud synchronization
  - [ ] Dynamic discount & promotion management system
  - [ ] AI-powered sales forecasting based on trends

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📫 Contact

**Rey Mart Rubio** — [GitHub Profile](https://github.com/reymartrubio24-beep)

Project Link: [https://github.com/reymartrubio24-beep/pos-app](https://github.com/reymartrubio24-beep/pos-app)

<!-- MARKDOWN LINKS & IMAGES -->

[forks-shield]: https://img.shields.io/github/forks/reymartrubio24-beep/pos-app?style=for-the-badge
[forks-url]: https://github.com/reymartrubio24-beep/pos-app/network/members
[stars-shield]: https://img.shields.io/github/stars/reymartrubio24-beep/pos-app?style=for-the-badge
[stars-url]: https://github.com/reymartrubio24-beep/pos-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/reymartrubio24-beep/pos-app?style=for-the-badge
[issues-url]: https://github.com/reymartrubio24-beep/pos-app/issues
[react-shield]: https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[php-shield]: https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white
[php-url]: https://www.php.net/
[mysql-shield]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[mysql-url]: https://www.mysql.com/
