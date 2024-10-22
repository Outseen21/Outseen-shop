import React from 'react';
import { motion } from 'framer-motion'; 
import './App.css';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: 'spring', stiffness: 50 } },
};

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {}
      <motion.section 
        className="hero-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Welcome to Outseen-Shop</h1>
            <p>Your destination for premium gaming gear</p>
            <a href="/category" className="hero-button">
              Browse Products
            </a>
          </div>
        </div>
      </motion.section>

      {}
      <motion.section
        className="promotion-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <h2>Current Promotions</h2>
        <div className="promotions">
          <motion.div
            className="promotion"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <img src="https://unsplash.com/photos/Mf23RF8xArY/download?force=true&w=1920" alt="Gaming promotion" />
            <h3>20% off on gaming accessories!</h3>
            <p>Check out our latest gaming accessories with great discounts.</p>
          </motion.div>
          <motion.div
            className="promotion"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <img src="https://unsplash.com/photos/_cgfRpV7E-g/download?force=true&w=1920" alt="New games release" />
            <h3>New game releases</h3>
            <p>Explore our new collection of top-rated games for every platform.</p>
          </motion.div>
        </div>
      </motion.section>

      {}
      <motion.section
        className="reviews-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <h2>Customer Reviews</h2>
        <div className="reviews">
          <motion.div
            className="review"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <p>"Great selection of gaming products! Fast shipping and excellent customer service."</p>
            <span>- Alex, Gamer from Warsaw</span>
          </motion.div>
          <motion.div
            className="review"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <p>"I love their accessories! High quality and awesome designs. Totally recommended!"</p>
            <span>- Marta, Pro Gamer</span>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
