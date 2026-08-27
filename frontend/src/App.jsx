import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/react";
import "./App.css";

function App() {
  return (
    <div>
      <h1>MY APP</h1>
      <header>
        <SignedOut>
          <SignInButton mode="modal">
            <button type="button">Sign in</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button type="button">Sign up</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  );
}

export default App;
