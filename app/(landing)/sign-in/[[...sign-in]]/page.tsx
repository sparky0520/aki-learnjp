import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center py-24">
      <SignIn forceRedirectUrl="/app" />
    </div>
  );
}
