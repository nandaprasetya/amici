import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="" description="">
            <Head title="Log in" />
            <div className="fixed inset-0 -z-50 overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    src="/asset/vid-login.mp4"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="flex items-center justify-center px-4">
                <div className="w-full max-w-[90%] overflow-hidden rounded-2xl border border-white/20 bg-black/30 p-8 shadow-2xl backdrop-blur-md">

                    <div className="mb-6 text-center">
                        <h2 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-300">
                            Silakan masuk ke akun Anda
                        </p>
                    </div>

                    <Form
                        {...AuthenticatedSessionController.store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-gray-200">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"

                                            className="border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-gray-200">Password</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-gray-400 hover:text-gray-300"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="border-white/50 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-gray-300 font-normal cursor-pointer">
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full bg-gray-600 py-6 text-base font-bold hover:bg-gray-700 transition-all duration-200 shadow-lg shadow-gray-900/20"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && (
                                            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                        )}
                                        Log in
                                    </Button>
                                </div>

                                <div className="mt-4 text-center text-sm text-gray-300">
                                    Don't have an account?{' '}
                                    <TextLink
                                        href={register()}
                                        tabIndex={5}
                                        className="font-semibold text-white underline decoration-gray-500 decoration-2 underline-offset-4 hover:text-gray-400 transition-colors"
                                    >
                                        Sign up
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-4 rounded-md bg-green-500/20 p-3 text-center text-sm font-medium text-green-300 border border-green-500/30">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </AuthLayout>
    );
}