'use client'

import { useState } from 'react'
import { login, signup } from '@/features/auth/actions'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [pending, setPending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)

    let result
    if (isLogin) {
      result = await login(formData)
    } else {
      result = await signup(formData)
    }

    if (result?.error) {
      setErrorMsg(result.error)
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left decorative panel */}
      <div className="hidden flex-1 flex-col justify-between bg-primary p-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20">
            <span className="text-sm font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-base font-semibold text-primary-foreground">CRM Base</span>
        </div>
        <div>
          <p className="text-lg font-medium leading-relaxed text-primary-foreground/90">
            "Una plataforma pensada para escalar desde el primer día."
          </p>
          <p className="mt-2 text-sm text-primary-foreground/60">Template interno · Go Dream AI</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-card px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">C</span>
            </div>
            <span className="text-sm font-semibold text-foreground">CRM Base</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isLogin ? 'Ingresá tus credenciales para continuar' : 'Completá los datos para comenzar'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                  Nombre completo
                </label>
                <Input id="fullName" name="fullName" required placeholder="Ej: Mauro García" />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <Input id="email" name="email" type="email" required placeholder="nombre@ejemplo.com" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Contraseña
              </label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMsg}
              </div>
            )}

            <Button type="submit" disabled={pending} className="w-full h-10">
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Ingresar' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setErrorMsg('') }}
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {isLogin ? 'Registrate' : 'Iniciá sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

