import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <div className="bg-[#f9f6f1] min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-[16px] px-[24px] py-[32px] shadow-lg w-full max-w-[80%] my-10">
                <AuthLayout
                    title="Create an account"
                    description="Enter your details below to create your account"
                >
                    <Head title="Register" />
                    <Form
                        {...RegisteredUserController.store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-black">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Full name"
                                            className="bg-[#f9f6f1] border border-black rounded-[8px] text-black px-3 py-2"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-black">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                            className="bg-[#f9f6f1] border border-black rounded-[8px] text-black px-3 py-2"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone_number" className="text-black">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="phone_number"
                                            required
                                            tabIndex={2}
                                            autoComplete="phone_number"
                                            name="phone_number"
                                            placeholder="+62"
                                            className="bg-[#f9f6f1] border border-black rounded-[8px] text-black px-3 py-2"
                                        />
                                        <InputError message={errors.phone_number} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-black">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Password"
                                            className="bg-[#f9f6f1] border border-black rounded-[8px] text-black px-3 py-2"
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-black">Confirm password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm password"
                                            className="bg-[#f9f6f1] border border-black rounded-[8px] text-black px-3 py-2"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="mt-2 w-full border border-black rounded-[24px] py-2 font-medium text-black bg-[#f9f6f1] hover:bg-black hover:text-white duration-300"
                                        tabIndex={5}
                                        data-test="register-user-button"
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        )}
                                        Create account
                                    </Button>
                                </div>
                                <div className="text-center text-sm text-muted-foreground mt-6">
                                    Already have an account?{' '}
                                    <TextLink href={login()} tabIndex={6} className="text-black underline hover:text-black/70">
                                        Log in
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </AuthLayout>
            </div>
        </div>
    );
}
