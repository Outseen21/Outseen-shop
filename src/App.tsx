import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'; // PayPal
import StripePaymentForm from './StripePaymentForm'; // Stripe
import logo from './outseen-shop-logo-7.png';
import cartIcon from './cart-icon.png';
import categoryBackground from './league-of-legends-logo2.png'; // Tło dla przycisku kategorii
import offerBackground from './league-of-legends-logo.png'; // Tło dla ofert w szczegółowym widoku
import './App.css';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountError, setDiscountError] = useState(false);

  const validDiscountCodes = {
    RABAT20: 20,
    RABAT50: 50,
  } as const;

  const addToCart = (product: string, price: number) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.name === product);
      if (itemExists) {
        return prevItems.map((item) =>
          item.name === product ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { name: product, price, quantity: 1 }];
    });
  };

  const removeFromCart = (product: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.name === product
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

  const applyDiscount = () => {
    const upperCaseCode = discountCode.toUpperCase() as keyof typeof validDiscountCodes;
    const discountPercentage = validDiscountCodes[upperCaseCode];

    if (discountPercentage) {
      setDiscount(discountPercentage);
      setDiscountError(false);
    } else {
      setDiscountError(true);
      setDiscount(0);
    }
  };

  const removeDiscount = () => {
    setDiscount(0);
    setDiscountCode('');
    setDiscountError(false);
  };

  const getTotalPrice = () => {
    const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discountAmount = (total * discount) / 100;
    return total - discountAmount;
  };

  return (
    <Router>
      <div className="App">
        {/* Pasek nawigacyjny */}
        <nav className="App-navbar">
          <div className="App-navbar-left">
            <Link to="/" className="App-title-link">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Outseen-Shop</h1>
            </Link>
          </div>
          <ul className="App-nav">
            <li>
              <Link to="/products">Produkty</Link>
            </li>
            <li>
              <Link to="/about">O nas</Link>
            </li>
            <li>
              <Link to="/contact">Kontakt</Link>
            </li>
          </ul>
          <div className="App-cart-icon" onClick={toggleCart}>
            <img src={cartIcon} alt="Koszyk" className="transparent-icon" />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </div>
        </nav>

        {/* Koszyk */}
        {cartVisible && (
          <div className="App-cart">
            <h3>Koszyk</h3>
            {cartItems.length === 0 ? (
              <p>Koszyk jest pusty</p>
            ) : (
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} szt. ({item.price} PLN za szt.)
                    <button onClick={() => removeFromCart(item.name)}>Usuń</button>
                  </li>
                ))}
              </ul>
            )}
            {cartItems.length > 0 && (
              <>
                <h4>Łączna cena: {getTotalPrice().toFixed(2)} PLN</h4>
                {discount > 0 && <p>Zniżka: {discount}%</p>}
                <div className="discount-section">
                  <input
                    type="text"
                    placeholder="Wpisz kod rabatowy"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button className="apply-discount" onClick={applyDiscount}>
                    Zastosuj rabat
                  </button>
                </div>
                {discountError && <p className="error-message">Błędny kod rabatowy</p>}
                {discount > 0 && (
                  <button className="remove-discount" onClick={removeDiscount}>
                    Usuń rabat
                  </button>
                )}

                <h4>Płatność kartą</h4>
                <StripePaymentForm />

                <h4>Płatność przez PayPal</h4>
                <PayPalScriptProvider options={{ clientId: "your_paypal_client_id" }}>
  <PayPalButtons
    style={{ layout: "vertical" }}
    createOrder={(data, actions) => {
      return actions.order.create({
        intent: "CAPTURE", // Natychmiastowa płatność
        purchase_units: [
          {
            amount: {
              currency_code: "PLN",
              value: getTotalPrice().toFixed(2), // Łączna cena
            },
          },
        ],
      });
    }}
    onApprove={async (data, actions) => {
      if (actions?.order) {
        return actions.order.capture().then((details) => {
          const payerName = details.payer?.name?.given_name;
          if (payerName) {
            alert(`Transakcja zakończona przez ${payerName}`);
          } else {
            console.log("Payer details are not available.");
          }
        });
      } else {
        console.error("Order action is undefined.");
      }
    }}
  />
</PayPalScriptProvider>


              </>
            )}
          </div>
        )}

        {/* Zawartość strony */}
        <header className="App-header">
          <Routes>
            <Route path="/" element={<EmptyComponent />} />
            <Route path="/products" element={<Products addToCart={addToCart} />} />
            <Route path="/products/league-of-legends" element={<LeagueOfLegendsCategory addToCart={addToCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

// Komponent strony produktów
function Products({ addToCart }: { addToCart: (product: string, price: number) => void }) {
  return (
    <div className="Products">
      <h2>Kategorie produktów</h2>
      <div className="category-list">
        <Link to="/products/league-of-legends" className="category-item">
          <div
            className="category-background"
            style={{
              backgroundImage: `url(${categoryBackground})`,
            }}
          >
            <h3>League of Legends</h3>
          </div>
        </Link>
      </div>
    </div>
  );
}

// Komponent kategorii League of Legends
function LeagueOfLegendsCategory({ addToCart }: { addToCart: (product: string, price: number) => void }) {
  return (
    <div className="league-of-legends-category">
      <div
        className="offer-background"
        style={{
          backgroundImage: `url(${offerBackground})`,
        }}
      >
        <h2 className="category-title">League of Legends - Skórki</h2>
      </div>
      <div className="product-list">
        {[
          {
            name: 'Skin za 975 RP',
            description: 'You can choose any 975 RP skin (should be on the store). Delivery time 8 days. EUNE/EUW.',
            price: 20, // 20 PLN
          },
          {
            name: 'Skin za 1350 RP',
            description: 'You can choose any 1350 RP skin (should be on the store). Delivery time 8 days. EUNE/EUW.',
            price: 30, // 30 PLN
          },
          {
            name: 'Skin za 1820 RP',
            description: 'You can choose any 1820 RP skin (should be on the store). Delivery time 8 days. EUNE/EUW.',
            price: 50, // 50 PLN
          },
        ].map((product, index) => (
          <Product
            key={index}
            name={product.name}
            description={product.description}
            price={product.price}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

// Komponent produktu
function Product({
  name,
  description,
  price,
  addToCart,
}: {
  name: string;
  description: string;
  price: number;
  addToCart: (product: string, price: number) => void;
}) {
  return (
    <div className="product">
      <h3>{name}</h3>
      <p className="product-description">{description}</p>
      <p className="price">Cena: {price} PLN</p>
      <button className="add-to-cart" onClick={() => addToCart(name, price)}>
        Dodaj do koszyka
      </button>
    </div>
  );
}

// Komponenty podstron
function About() {
  return (
    <div className="About">
      <h2>O nas</h2>
      <p>Outseen-Shop to wiodący sklep z grami online, oferujący najlepsze tytuły w przystępnych cenach.</p>
    </div>
  );
}

function Contact() {
  return (
    <div className="Contact">
      <h2>Kontakt</h2>
      <p>Masz pytania? Skontaktuj się z nami pod adresem email: kontakt@outseen-shop.com</p>
    </div>
  );
}

function EmptyComponent() {
  return null;
}

export default App;
