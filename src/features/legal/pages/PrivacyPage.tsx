import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0e] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/auth"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          <ArrowLeft size={14} />
          Volver
        </Link>

        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Política de privacidad</h1>
            <p className="mt-1 text-sm text-gray-500">Última actualización: 22 de mayo de 2026</p>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-[#2a2a38] bg-[#111117] p-6 text-sm leading-relaxed text-gray-300">
          <p className="text-gray-400">
            Esta app es un proyecto personal sin fines de lucro para que un grupo de amigos
            compita prediciendo los resultados del Mundial 2026. Queremos ser claros y honestos
            sobre qué datos tuyos guardamos y por qué.
          </p>

          <Section title="Qué datos guardamos">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <span className="text-gray-100">Email</span>: necesario para crear tu cuenta,
                iniciar sesión y enviarte el correo de verificación.
              </li>
              <li>
                <span className="text-gray-100">Nombre de usuario</span>: el que elegís al
                registrarte. Se muestra al resto de participantes en las quinielas en las que
                estés.
              </li>
              <li>
                <span className="text-gray-100">Contraseña</span>: la guardamos cifrada (hash).
                Ni siquiera nosotros la podemos ver en claro.
              </li>
              <li>
                <span className="text-gray-100">Predicciones y resultados</span>: cada
                pronóstico que cargás, junto con los puntos que te suma.
              </li>
              <li>
                <span className="text-gray-100">Quinielas en las que participás</span>: los
                grupos a los que te uniste o creaste.
              </li>
            </ul>
            <p className="mt-3 text-gray-500">
              <span className="text-gray-300">No guardamos</span>: ubicación, número de
              teléfono, datos de pago, ni información personal adicional. No usamos Google
              Analytics ni otros servicios de tracking.
            </p>
          </Section>

          <Section title="Para qué los usamos">
            <p>
              Únicamente para que la app funcione: autenticarte, mostrar tus predicciones,
              calcular tu posición en el ranking y notificarte vía email lo relacionado con tu
              cuenta (verificación, recuperación de contraseña).
            </p>
            <p className="mt-2 text-gray-500">No te mandamos publicidad ni newsletters.</p>
          </Section>

          <Section title="Quién más ve tus datos">
            <p>
              Usamos dos proveedores técnicos para hacer correr la app:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <span className="text-gray-100">Supabase</span> (Estados Unidos): guarda la base
                de datos, la autenticación y maneja los emails de verificación.
              </li>
              <li>
                <span className="text-gray-100">Vercel</span> (Estados Unidos): sirve el sitio
                web.
              </li>
            </ul>
            <p className="mt-3 text-gray-500">
              No compartimos tus datos con anunciantes, terceros, ni nadie fuera de los
              proveedores técnicos necesarios.
            </p>
          </Section>

          <Section title="Cuánto tiempo los guardamos">
            <p>
              Mientras tengas tu cuenta activa. Si pedís borrado, los eliminamos. No hay un
              borrado automático por inactividad — pero si querés desaparecer, basta con
              avisarnos.
            </p>
          </Section>

          <Section title="Tus derechos">
            <p>
              Podés pedir en cualquier momento:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Ver qué datos tuyos tenemos.</li>
              <li>Cambiar tu username o email.</li>
              <li>Borrar tu cuenta y todos los datos asociados.</li>
              <li>Exportar tus predicciones.</li>
            </ul>
          </Section>

          <Section title="Cómo nos contactás">
            <p>
              Escribinos a{' '}
              <a
                href="mailto:eufragio.marco@gmail.com"
                className="text-green-400 underline-offset-2 hover:underline"
              >
                eufragio.marco@gmail.com
              </a>
              . Es el mail del responsable del proyecto. Respondemos lo más rápido que podamos.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Solo usamos las cookies de sesión que pone Supabase para mantenerte autenticado.
              No usamos cookies de tracking, publicidad ni de terceros.
            </p>
          </Section>
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/auth">
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Volver al login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold text-gray-100">{title}</h2>
      <div className="text-gray-300">{children}</div>
    </section>
  )
}
