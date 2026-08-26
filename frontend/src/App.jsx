import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import "./App.css";

function App() {
  return (
    <div>
      <h1>MY APP</h1>
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal">Sign in</SignInButton>
          <SignUpButton mode="modal">Sign up</SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  );
}

export default App;
