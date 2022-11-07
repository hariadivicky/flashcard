import React, { useEffect, useState } from "react";

function Header() {

  const session = JSON.parse(localStorage.getItem('flashcard-app-session'))

  const handleSignOut = () => {
    localStorage.removeItem('flashcard-app-session')

    document.location.pathname = '/sign_in'
  }

  return (
    <header className="jumbotron bg-dark mb-4">
      <div className="container text-white">
        <h1 className="display-4">Memore</h1>
        <p className="lead">Make learning vocabulary simple by designing flashcards that work for you.</p>

        {session && (
          <div className="text-right">
            <span className="mr-4">{session.name}</span>
            <button className="btn btn-sm btn-light" onClick={handleSignOut}>Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
