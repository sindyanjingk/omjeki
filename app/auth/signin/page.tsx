// app/page.tsx


import {  signIn, signOut } from "next-auth/react";

const SigninPage = () => {
  
  return (
    <div>
      <h1>Welcome to NextAuth Example</h1>
      {/* {!session ? (
        <>
          <button onClick={() => signIn("credentials")}>Sign In</button>
        </>
      ) : (
        <>
          <h2>Welcome, {session?.name}</h2>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      )} */}
    </div>
  );
};

export default SigninPage;
