import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@src/components/ui/card.tsx";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@src/components/ui/form.tsx";
import {Button} from "@src/components/ui/button.tsx";
import {Slider} from "@src/components/ui/slider.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@src/components/ui/select.tsx";
import {useForm} from "react-hook-form";
import {useState, useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import { readingFormSchema, type readingForm } from "@kanpeki/form-schemas";
import { getRandomThemes } from "./themes.ts";

export default function CustomizeReading() {

    {
        // 3 things here:
        // - pick one out of four random story themes to choose from
        // - set JLPT proficiency level (N5-N1)
        // - set paragraph length (minimum 4, max 8, as a slider)
    }

    const [themes, setThemes] = useState<string[]>([]);

    useEffect(() => {
        setThemes(getRandomThemes());
    }, []);

    const form = useForm<readingForm>({

        resolver: zodResolver(readingFormSchema),
        defaultValues: {
            sentences: 5,
            jlpt: "N5",
            theme: "daily life"
        },

    });

    function onSubmit(values: readingForm) {

        try {
            console.log(values);
            // await api.post("/reading/setupReading", values);
            // navigate("/reading")
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Generate a new reading</CardTitle>
                <CardDescription>
                    Use the controls below to customize the length, proficiency level, and theme
                    of the Japanese paragraph you will read.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="sentences"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of sentences: {[field.value]}</FormLabel>
                                    <FormControl>
                                        <Slider
                                            defaultValue={[5]}
                                            min={4}
                                            max={8}
                                            step={1}
                                            value={[field.value]}
                                            onValueChange={(val) => field.onChange(val[0])}
                                            className="py-2"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Adjust the slider to set the total number of sentences that will appear in the paragraph.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="jlpt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proficiency level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Set profiency level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="N5">N5</SelectItem>
                                            <SelectItem value="N4">N4</SelectItem>
                                            <SelectItem value="N3">N3</SelectItem>
                                            <SelectItem value="N2">N2</SelectItem>
                                            <SelectItem value="N1">N1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select a Japanese Language Proficiency Test (JLPT) level to influence the vocabulary, grammar, and kanji shown to you.
                                        N5 is the the lowest proficiency and N1 is the highest proficiency.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="theme"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Story Theme</FormLabel>
                                    <FormControl>
                                        <Card className="flex border-none shadow-none py-1" onChange={field.onChange}>
                                            {themes.map(theme => (
                                                <Button
                                                    key={theme}
                                                    type="button"
                                                    className="w-auto"
                                                    variant={field.value === theme ? "default" : "outline"}
                                                    onClick={() => field.onChange(theme)}>
                                                    {theme}
                                                </Button>
                                            ))}
                                        </Card>
                                    </FormControl>
                                    <FormDescription>
                                        Select one of the four random themes above to dictate the storyline of the paragraph.
                                        You can select none of these to make the story a generic "daily life" theme.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="border">Generate Paragraph</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );

}