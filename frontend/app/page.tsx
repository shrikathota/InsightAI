import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to InsightAI</h1>
        <p className="text-xl text-muted-foreground mb-8">
          AI-powered meeting assistant with smart summaries and action items
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
