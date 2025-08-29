
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SendForm } from "./send-form";
import { RegisterForm } from "./register-form";
import { SheetFormWrapper } from "./sheet-form-wrapper";
import { Send, UserPlus } from "lucide-react";
import { AIGuide } from "./ai-guide";

export function WalletResolverMobile() {
    return (
        <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl overflow-hidden border-2 border-primary/10">
            <CardHeader className="text-center p-6 relative">
                <CardTitle className="text-3xl font-bold text-primary font-heading">Wallet Resolver</CardTitle>
                <CardDescription className="text-base text-muted-foreground pt-1">
                    Send crypto using just a phone number.
                </CardDescription>
                <div className="absolute top-3 right-3">
                    <AIGuide />
                </div>
            </CardHeader>
            <CardContent className="p-6 bg-secondary/30">
                <div className="grid grid-cols-1 gap-4">
                    <SheetFormWrapper
                        title="Send Payment"
                        description="Enter recipient's phone and amount."
                        trigger={
                            <Button size="lg" className="w-full">
                                <Send />
                                Send
                            </Button>
                        }
                    >
                        <SendForm />
                    </SheetFormWrapper>

                    <SheetFormWrapper
                        title="Register Number"
                        description="Register your phone number to receive payments."
                        trigger={
                            <Button size="lg" variant="outline" className="w-full">
                                <UserPlus />
                                Register
                            </Button>
                        }
                    >
                        <RegisterForm />
                    </SheetFormWrapper>
                </div>
            </CardContent>
        </Card>
    )
}
