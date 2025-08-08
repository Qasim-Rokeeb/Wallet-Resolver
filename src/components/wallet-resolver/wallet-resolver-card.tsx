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
    <Card className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden">
      <CardHeader className="text-center bg-card p-6 relative">
        <CardTitle className="text-3xl font-bold text-primary font-headline">Wallet Resolver</CardTitle>
        <CardDescription className="text-base">Send crypto using just a phone number.</CardDescription>
        <div className="absolute top-3 right-3">
          <AIGuide />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/60">
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="send" className="pt-4">
            <SendForm />
          </TabsContent>
          <TabsContent value="register" className="pt-4">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
