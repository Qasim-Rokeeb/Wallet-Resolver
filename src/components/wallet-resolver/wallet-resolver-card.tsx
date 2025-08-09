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
    <Card className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden border-2 border-gray-200/60">
      <CardHeader className="text-center bg-white p-6 relative border-b">
        <CardTitle className="text-3xl font-bold text-primary" style={{fontFamily: 'Inter, sans-serif'}}>Wallet Resolver</CardTitle>
        <CardDescription className="text-base text-gray-500">Send crypto using just a phone number.</CardDescription>
        <div className="absolute top-3 right-3">
          <AIGuide />
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50">
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200/70">
            <TabsTrigger value="send" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">Send</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="send" className="pt-6">
            <SendForm />
          </TabsContent>
          <TabsContent value="register" className="pt-6">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
