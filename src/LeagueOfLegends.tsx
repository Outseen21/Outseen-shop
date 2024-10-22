import React from 'react';
import { motion } from 'framer-motion'; 
import './App.css'; 

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: 'spring', stiffness: 50 } },
};

interface LeagueOfLegendsProps {
  addToCart: (product: string, price: number) => void;
}

const LeagueOfLegendsProducts: React.FC<LeagueOfLegendsProps> = ({ addToCart }) => {
  const products = [
    { name: 'Champion Skin', price: 50 },
    { name: 'Riot Points Pack', price: 100 },
    { name: 'Special Edition Item', price: 200 },
  ];

  return (
    <motion.div
      className="products-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <h2>League of Legends Products</h2>
      <motion.div className="product-list">
        {products.map((product, index) => (
          <motion.div
            className="product-card"
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <h3>{product.name}</h3>
            <p>{product.price} PLN</p>
            <button onClick={() => addToCart(product.name, product.price)}>Dodaj do koszyka</button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LeagueOfLegendsProducts;
