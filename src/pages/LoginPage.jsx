import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/app/schemas/login.js';
import { useLogin } from '@/app/hooks/useLogin.js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

export function LoginPage() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema)
    },
  );

  const onSubmit = async (data) => {
    login.mutate(data);
  }

  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center">
      <Card className="xlg:w-1/4 lg:w-1/3 md:w-1/2 w-full m-auto">
        <CardHeader>
          <CardTitle tag="h2">Admin gateway</CardTitle>
          <CardDescription tag="p">Login with your administrator credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  placeholder="Enter your email"
                  autoComplete="off"
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  placeholder="Enter your password"
                  autoComplete="off"
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>
              <Button type="submit" color="primary">Login</Button>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

