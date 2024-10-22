import React, { useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
  password: string;
  registeredAt: string;
  location: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('registeredUsers');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    setUsers(registeredUsers);
  }, []);

  const handleDeleteUser = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email);
    setUsers(filteredUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(filteredUsers));
    alert('Użytkownik został usunięty.');
  };

  return (
    <div className="admin-panel">
      <h2>Panel administratora</h2>
      <table>
        <thead>
          <tr>
            <th>Nazwa użytkownika</th>
            <th>E-mail</th>
            <th>Data rejestracji</th>
            <th>Miejsce rejestracji</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{new Date(user.registeredAt).toLocaleString()}</td> {}
              <td>{user.location}</td> {}
              <td>
                <button onClick={() => handleDeleteUser(user.email)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
