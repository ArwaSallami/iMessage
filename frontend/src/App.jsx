import { Show, SignInButton, SignOutButton, UserButton } from "@clerk/react";
import "./App.css";

function App() {
  return (
    <div>
      <h1>MY APP</h1>
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal" />
          <SignOutButton mode="modal" />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  );
}

export default App;
