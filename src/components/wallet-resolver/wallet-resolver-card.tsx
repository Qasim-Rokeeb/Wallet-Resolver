import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SendForm } from "./send-form"
import { RegisterForm } from "./register-form"
import { AIGuide } from "./ai-guide"

export function WalletResolverCard() {
  return (
    <>
      <div id="send" className="scroll-mt-20">
        <Card className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden border-2 border-primary/10">
          <CardHeader className="text-center p-6 relative">
            <CardTitle className="text-3xl font-bold text-primary">Wallet Resolver</CardTitle>
            <CardDescription className="text-base text-muted-foreground pt-1">Send crypto using just a phone number.</CardDescription>
            <div className="absolute top-3 right-3">
              <AIGuide />
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-secondary/30">
            <Tabs defaultValue="send" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="send">Send</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="send" className="pt-6">
                <SendForm />
              </TabsContent>
              <TabsContent value="register" className="pt-6">
                 <div id="register" className="scroll-mt-20">
                    <RegisterForm />
                 </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
