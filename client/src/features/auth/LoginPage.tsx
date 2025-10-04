import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@src/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@src/components/ui/form.tsx";
import { Input } from "@src/components/ui/input.tsx";
import { Button } from "@src/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { type loginForm, loginFormSchema } from "@shared/authSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";


export default function LoginPage() {


    const form = useForm<loginForm>({

        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },

    });

    const watchIdentifier = form.watch("identifier");
    const watchPassword = form.watch("password");

    function onSubmit(values: loginForm) {

        try {
            console.log(values);
            // await api.post("/sessions", values);
            // navigate("/dashboard")
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Log in to your account</CardTitle>
                <CardDescription>
                    Enter your credentials to log in.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@email.com" {...field} />
                                    </FormControl>
                                    { watchIdentifier && <FormMessage className="text-red-500"/> }
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

                        <Button type="submit" className="border">Log In</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}