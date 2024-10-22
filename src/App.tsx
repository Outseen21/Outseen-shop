import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Category from './Category';
import LeagueOfLegendsProducts from './LeagueOfLegends';
import Login from './Login';
import Register from './Register';
import HomePage from './HomePage';
import Verify from './Verify';
import Contact from './Contact';
import StripePaymentForm from './StripePaymentForm';
import AdminPanel from './AdminPanel';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import emailjs from 'emailjs-com';
import logo from './outseen-shop-logo-7.png';
import cartIcon from './cart-icon.png';
import { motion } from 'framer-motion';
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
  const [user, setUser] = useState<null | { username: string; email: string }>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedCode, setSavedCode] = useState<string>(''); 
  const [isVerified, setIsVerified] = useState(false);
  const [isInVerification, setIsInVerification] = useState(false);
  const [timer, setTimer] = useState(300); 
  const [resendCountdown, setResendCountdown] = useState(60); 
  const navigate = useNavigate();

  const setupAdminAccount = () => {
    const storedUsers = localStorage.getItem('registeredUsers');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

    const adminExists = registeredUsers.some((user: { username: string }) => user.username === 'admin');

    if (!adminExists) {
      const adminUser = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        registeredAt: new Date().toISOString(),
        location: 'Polska',
      };

      registeredUsers.push(adminUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      console.log('Admin account created: username: admin, password: admin123');
    }
  };

  useEffect(() => {
    setupAdminAccount();

    const storedUser = localStorage.getItem('user');
    const adminStatus = localStorage.getItem('admin');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAdmin(adminStatus === 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setUser(null);
    setIsAdmin(false);
  };

  const handleLogin = (username: string, password: string) => {
    const storedUsers = localStorage.getItem('registeredUsers');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = registeredUsers.find(
      (user: { username: string; password: string }) => user.username === username && user.password === password
    );

    if (userExists) {
      setUser({ username: userExists.username, email: userExists.email });
      localStorage.setItem('user', JSON.stringify({ username: userExists.username, email: userExists.email }));

      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin', 'true');
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        localStorage.removeItem('admin');
      }
      navigate('/category');
    } else {
      alert('Nieprawidłowe dane logowania.');
    }
  };

  const handleRegister = (username: string, email: string, password: string) => {
    const storedUsers = localStorage.getItem('registeredUsers');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = registeredUsers.find((user: { email: string }) => user.email === email);
    if (userExists) {
      alert('Użytkownik z tym adresem e-mail już istnieje.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSavedCode(code);

    const templateParams = {
      to_name: username,
      to_email: email, 
      verification_code: code,
    };

    emailjs
      .send(
        'service_gwq47rj',
        'template_yfpoyis',
        templateParams,
        'sdlRnZzsfN7RdKPb8'
      )
      .then((response) => {
        console.log('E-mail wysłany!', response.status, response.text);
        setIsInVerification(true); 
        localStorage.setItem('pendingUser', JSON.stringify({ username, email, password }));
        navigate('/verify');
      })
      .catch((err) => {
        console.error('Błąd przy wysyłaniu e-maila:', err);
      });

    setUser(null); 
  };

  const handleVerification = (inputCode: string) => {
    if (inputCode === savedCode) {
      alert('Weryfikacja zakończona sukcesem!');
      setIsVerified(true);
      setIsInVerification(false);

      const pendingUser = localStorage.getItem('pendingUser');
      if (pendingUser) {
        const { username, email, password } = JSON.parse(pendingUser);
        const storedUsers = localStorage.getItem('registeredUsers');
        const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

        registeredUsers.push({ username, email, password });
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        localStorage.removeItem('pendingUser');

        alert('Zarejestrowano pomyślnie.');
      }
      navigate('/login');
    } else {
      alert('Błędny kod, spróbuj ponownie.');
    }
  };

  const resendVerificationCode = () => {
    if (resendCountdown > 0) {
      return; 
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSavedCode(code);

    const pendingUser = localStorage.getItem('pendingUser');
    if (pendingUser) {
      const { username, email } = JSON.parse(pendingUser);

      const templateParams = {
        to_name: username,
        to_email: email,
        verification_code: code,
      };

      emailjs
        .send('service_gwq47rj', 'template_yfpoyis', templateParams, 'sdlRnZzsfN7RdKPb8')
        .then(() => {
          alert('Nowy kod weryfikacyjny został wysłany.');
          setResendCountdown(60); 
        })
        .catch((err) => {
          console.error('Błąd przy ponownym wysyłaniu kodu:', err);
        });
    }
  };

  const addToCart = (product: string, price: number) => {
    if (!user) {
      alert('Musisz być zalogowany, aby dodać produkt do koszyka.');
      return;
    }

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
    const validDiscountCodes = {
      RABAT20: 20,
      RABAT50: 50,
    } as const;

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
    <motion.div 
      className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.nav
        className="App-navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 50 }}
      >
        <div className="App-navbar-left">
          <Link to="/" className="App-title-link">
            <motion.img
              src={logo}
              className="App-logo"
              alt="logo"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
            />
            <motion.h1
              className="App-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Outseen-Shop
            </motion.h1>
          </Link>
        </div>
        <ul className="App-nav">
          <motion.li
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link to="/HomePage">Strona główna</Link>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to="/category">Kategorie</Link>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link to="/about">O nas</Link>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link to="/contact">Kontakt</Link>
          </motion.li>
          {isAdmin && (
            <motion.li
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Link to="/admin">Admin</Link>
            </motion.li>
          )}
        </ul>
        <div className="App-auth">
          {user ? (
            <>
              <span>Witaj, {user.username}</span>
              <button onClick={handleLogout}>Wyloguj się</button>
            </>
          ) : (
            <>
              <Link to="/login">Zaloguj się</Link>
              <Link to="/register">Zarejestruj się</Link>
            </>
          )}
        </div>
        <div className="App-cart-icon" onClick={toggleCart}>
          <motion.img
            src={cartIcon}
            alt="Koszyk"
            className="transparent-icon"
            whileHover={{ scale: 1.1 }}
          />
          {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
        </div>
      </motion.nav>

      {cartVisible && (
        <motion.div
          className="App-cart"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
              <PayPalScriptProvider options={{ clientId: 'your_paypal_client_id' }}>
                <PayPalButtons
                  style={{ layout: 'vertical' }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [
                        {
                          amount: {
                            currency_code: 'PLN',
                            value: getTotalPrice().toFixed(2),
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
                        }
                      });
                    } else {
                      console.error('Order action is undefined.');
                    }
                  }}
                />
              </PayPalScriptProvider>
            </>
          )}
        </motion.div>
      )}

      <header className="App-header">
        <Routes>
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/" element={<Navigate to="/category" />} />
          <Route path="/category" element={<Category />} />
          <Route path="/league-of-legends" element={<LeagueOfLegendsProducts addToCart={addToCart} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={user ? <Navigate to="/category" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/category" /> : <Register onRegister={handleRegister} />} />
          <Route path="/verify" element={<Verify savedCode={savedCode} onVerify={handleVerification} timer={timer} resendCountdown={resendCountdown} onResendCode={resendVerificationCode} />} />
          <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/login" />} />
        </Routes>
      </header>
    </motion.div>
  );
}

export default App;
