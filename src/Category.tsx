import React from 'react';
import { motion } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';
import leagueImage from './league-of-legends-logo2.png'; 
import './App.css'; 

// Animacje dla sekcji
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: 'spring', stiffness: 50 } },
};

const Category: React.FC = () => {
  const navigate = useNavigate();

  const goToLeagueOfLegends = () => {
    navigate('/league-of-legends'); 
  };

  return (
    <motion.div
      className="category-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <h2>Wybierz kategorię</h2>
      <motion.div
        className="category-background"
        onClick={goToLeagueOfLegends} 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="category-content">
          <img src={leagueImage} alt="League of Legends" className="league-image" />
          <span className="category-title">League of Legends</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Category;
