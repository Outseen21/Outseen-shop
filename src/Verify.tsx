import React, { useEffect, useState } from 'react';

interface VerifyProps {
  savedCode: string;
  onVerify: (inputCode: string) => void;
  timer: number; 
  resendCountdown: number; 
  onResendCode: () => void;
}

const Verify: React.FC<VerifyProps> = ({ savedCode, onVerify, timer, resendCountdown, onResendCode }) => {
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(inputCode);
  };

  return (
    <div className="verify-container">
      <h2>Weryfikacja</h2>
      <p>Czas na weryfikację: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Wprowadź kod weryfikacyjny:</label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zweryfikuj</button>
      </form>
      <div>
        {resendCountdown > 0 ? (
          <p>Ponowne wysłanie kodu za {resendCountdown} sekund.</p>
        ) : (
          <button onClick={onResendCode}>Wyślij ponownie kod</button>
        )}
      </div>
    </div>
  );
};

export default Verify;
