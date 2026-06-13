'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Loader2, Sparkles } from 'lucide-react';

import { loginAction } from './actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const loginSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAction(data.password);
      if (!result.success) {
        setError(result.error || 'Contraseña incorrecta');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Ocurrió un error inesperado. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Decorative Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute -top-[30%] -left-[10%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="absolute -bottom-[30%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />

      <Card className="relative w-full max-w-md border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl text-slate-100 mx-4">
        {/* Top accent line */}
        <div className="absolute top-0 left-1/2 h-[1px] w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Panel de Administración <Sparkles className="h-5 w-5 text-violet-400" />
          </CardTitle>
          <CardDescription className="text-slate-400">
            Introduce la contraseña para acceder a la gestión de invitaciones
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none text-slate-300 flex items-center gap-1"
              >
                Contraseña <span className="text-violet-400">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={cn(
                  'h-8 w-full min-w-0 rounded-lg border border-slate-800 bg-slate-950/50 px-2.5 py-1 text-base text-slate-100 placeholder:text-slate-600 transition-colors outline-none focus-visible:ring-violet-500 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rose-500 md:text-sm',
                  errors.password && 'border-rose-500 focus-visible:ring-rose-500'
                )}
                disabled={isLoading}
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs font-semibold text-rose-500">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="pb-8">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-white hover:from-violet-500 hover:to-indigo-500 focus-visible:ring-violet-500 transition-all duration-300 shadow-lg shadow-violet-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Entrar al Panel'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
