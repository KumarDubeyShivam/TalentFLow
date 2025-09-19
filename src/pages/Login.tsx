import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const demoCredentials = [
    { role: 'Recruiter', email: 'recruiter@talentflow.com', password: 'password123' },
    { role: 'Applicant', email: 'john.doe@email.com', password: 'password123' },
  ];

  const fillDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="h-8 w-8 text-white font-bold flex items-center justify-center text-xl">
                TF
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">TalentFlow</h1>
          </div>
          {/* Signup Button */}
          <a href="/signup">
            <Button className="mt-2" variant="secondary">Sign up</Button>
          </a>
          <p className="text-white/80">The modern hiring platform</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your TalentFlow account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              
              <div className="w-full">
                <p className="text-sm text-muted-foreground text-center mb-3">Demo Accounts:</p>
                <div className="space-y-2">
                  {demoCredentials.map((cred) => (
                    <Button
                      key={cred.role}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => fillDemo(cred.email, cred.password)}
                      type="button"
                    >
                      Login as {cred.role}
                    </Button>
                  ))}
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
        </div>
      </div>
      <footer className="w-full text-center py-4 bg-card/0 border-none text-muted-foreground text-sm">
        &copy; ShivamKumarDubey 2025
      </footer>
    </div>
  );
}