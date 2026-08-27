import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";
import "./App.css";

function App() {
  const { isSignedIn } = useUser();

  return (
    <div>
      <h1>MY APP</h1>
      <header>
        {!isSignedIn && (
          <>
            <SignInButton mode="modal">
              <button type="button">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button type="button">Sign up</button>
            </SignUpButton>
          </>
        )}
        {isSignedIn && <UserButton />}
      </header>
    </div>
  );
}

export default App;
