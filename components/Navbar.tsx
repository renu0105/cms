import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="bg-black text-white flex flex-row items-center font-bold py-4 px-7  fixed top-0 w-full z-10">
      <h1 className="mx-auto text-2xl ">CMS</h1>
      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base py-2 px-4 sm:px-5 cursor-pointer ml-4">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};
export default Navbar;
