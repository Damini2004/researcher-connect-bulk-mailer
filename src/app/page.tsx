
import MailForm from "@/components/MailForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl relative">
        <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-t-3xl text-center">
            <div className="inline-flex items-center justify-center bg-white/20 text-primary-foreground rounded-full w-24 h-24 mb-4 p-2">
                <Image src="/rclogo.png" alt="Researcher Connect Logo" width={80} height={80} className="rounded-full" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary-foreground">
                Researcher Connect
            </h1>
            <p className="mt-3 text-lg text-primary-foreground/90 max-w-md mx-auto">
                Upload a contact list, compose your message, and send personalized emails in bulk.
            </p>
        </div>
        <MailForm />
      </div>
    </main>
  );
}
