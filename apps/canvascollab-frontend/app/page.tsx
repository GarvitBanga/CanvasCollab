import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, Share2, Users2, Sparkles, Github, Download } from "lucide-react";
import Link from "next/link";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 text-foreground">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Collaborative Whiteboarding
            <span className="block text-primary mt-2">Made Simple</span>
          </h1>
          <p className="mt-6 mx-auto max-w-xl text-lg text-muted-foreground">
            Create, collaborate, and share beautiful diagrams and sketches with our intuitive drawing tool. 
            No sign-up required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signin">
              <Button variant="primary" size="lg" className="h-12 px-6 shadow-md">
              <>
              <span>Sign In</span>
              <Pencil className="h-4 w-4" />
              </>
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="h-12 px-6 shadow-sm border-primary text-primary hover:bg-primary hover:text-white transition">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 border shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Collaboration</h3>
              </div>
              <p className="text-muted-foreground">
                Work together with your team in real-time. Share your drawings instantly with a simple link.
              </p>
            </Card>

            <Card className="p-6 border shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Multiplayer Editing</h3>
              </div>
              <p className="text-muted-foreground">
                Multiple users can edit the same canvas simultaneously. See whos drawing what in real-time.
              </p>
            </Card>

            <Card className="p-6 border shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Drawing</h3>
              </div>
              <p className="text-muted-foreground">
                Intelligent shape recognition and drawing assistance helps you create perfect diagrams.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 sm:p-16 shadow-xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Ready to start creating?
              </h2>
              <p className="mt-6 text-lg text-white/90">
                Join thousands of users already making amazing diagrams and sketches.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button variant="secondary" size="lg" className="h-12 px-6 border border-white text-white hover:bg-white hover:text-primary transition">
                  Open Canvas
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" className="h-12 px-6 border border-white text-white hover:bg-white hover:text-primary transition">
                  View Gallery
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CanvasCollab. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://github.com" target="_blank" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Download className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;