import { Button } from "@src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@src/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@src/components/ui/form"
import { Input } from "@src/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// @ts-ignore
import { signupFormSchema } from "@shared/formSchemas.js";
import { z } from "zod";

type signupForm = z.infer<typeof signupFormSchema>;

export default function SignupPage() {

    const form = useForm<signupForm>({

        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },

    });

    const watchUsername = form.watch("username");
    const watchEmail = form.watch("email");
    const watchPassword = form.watch("password");

    function onSubmit(values: signupForm) {

        try {
            console.log(values);
            // await api.post("/users", values);
            // navigate("/dashboard")
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-center">Create your account</CardTitle>
                <CardDescription>
                    Enter your preferred username, email, and password below to create a new account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} />
                                    </FormControl>
                                    { watchUsername && <FormMessage className="text-red-500"/> }
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="example@email.com" {...field} />
                                    </FormControl>
                                    { watchEmail && <FormMessage className="text-red-500"/> }
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    { watchPassword && <FormMessage className="text-red-500"/> }
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="border">Sign Up</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
