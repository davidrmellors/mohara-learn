import React from 'react';

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="user-layout">
      <header>User Header</header>
      <main>{children}</main>
      <footer>User Footer</footer>
    </div>
  );
};

export default UserLayout;
