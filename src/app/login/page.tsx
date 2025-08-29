
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader className="text-center p-6">
          <CardTitle className="text-3xl font-bold text-primary font-heading">Welcome Back</CardTitle>
          <CardDescription className="text-base text-muted-foreground pt-1">
            Sign in to your account with your phone number.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
